import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {MetricCardData} from '../../../components';
import type {RentalsStackParamList} from '../../../navigation/types';
import {
  vehicleRentalRentOrdersService,
  vehicleRentalRentalsService,
} from '../../../services';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchRentals} from '../../../store/dataCacheSlice';
import {colors as defaultColors, useThemeColors} from '../../../theme';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import {
  asRecord,
  formatMoney,
  pickNumber,
  pickString,
  unwrapList,
  unwrapMeta,
} from '../../../utils/apiHelpers';
import type {
  HistoryCompletedRow,
  InvoiceRow,
  InvoiceStatus,
  LateReturnItem,
  OrderStatus,
  PaymentStatus,
  RentalOrderRow,
  RentalOrdersController,
  RentalOrdersTab,
  RentalOrdersTabId,
} from './module';

type RentalOrdersNav = NativeStackNavigationProp<
  RentalsStackParamList,
  'RentalOrders'
>;

const TABS: RentalOrdersTab[] = [
  {id: 'orders', label: 'Rental Orders', icon: 'navRentals'},
  {id: 'history', label: 'Rental History', icon: 'shiftClock'},
  {id: 'late', label: 'Late Returns', icon: 'statusOverdue'},
  {id: 'invoices', label: 'Invoices', icon: 'documentFile'},
];

function mapOrderStatus(raw: string): OrderStatus {
  const key = raw.trim().toLowerCase();
  if (key.includes('overdue') || key.includes('late')) {
    return 'Overdue';
  }
  if (key.includes('reserv') || key.includes('pending')) {
    return 'Reserved';
  }
  if (key.includes('complete') || key.includes('returned')) {
    return 'Completed';
  }
  if (key.includes('cancel')) {
    return 'Cancelled';
  }
  return 'Active';
}

function mapPaymentStatus(raw: string): PaymentStatus {
  const key = raw.trim().toLowerCase();
  if (key.includes('partial')) {
    return 'Partial';
  }
  if (key.includes('refund')) {
    return 'Refund';
  }
  if (key.includes('pending') || key.includes('unpaid') || key === '') {
    return 'Pending';
  }
  return 'Paid';
}

function mapInvoiceStatus(
  payment: PaymentStatus,
  order: OrderStatus,
): InvoiceStatus {
  if (order === 'Overdue') {
    return 'Overdue';
  }
  if (payment === 'Paid') {
    return 'Paid';
  }
  if (payment === 'Pending' || payment === 'Partial') {
    return 'Pending';
  }
  return 'Draft';
}

function formatDateLabel(value: string): string {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}

function formatOverdue(expectedReturnDate: string): string {
  const expected = new Date(expectedReturnDate).getTime();
  if (!Number.isFinite(expected)) {
    return '—';
  }
  const diffMs = Date.now() - expected;
  if (diffMs <= 0) {
    return '0h 0m';
  }
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

type RentalRow = {
  id: string;
  rentalCode: string;
  customer: string;
  vehicle: string;
  amount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  expectedReturnDate: string;
  returnDate: string;
  lateFee: number;
};

function mapRentalRow(item: unknown, index: number): RentalRow {
  const row = asRecord(item);
  const customer = asRecord(row.customer);
  const vehicle = asRecord(row.vehicle);
  const customerName =
    pickString(customer, ['name', 'full_name']) ||
    pickString(row, ['customer_name'], 'Customer');
  const vehicleLabel =
    [pickString(vehicle, ['make']), pickString(vehicle, ['model'])]
      .filter(Boolean)
      .join(' ') || pickString(row, ['vehicle_name'], 'Vehicle');
  const rentalCode = pickString(
    row,
    ['rental_no', 'order_no', 'code'],
    `RN-${row.id ?? index}`,
  );
  const statusRaw = pickString(row, ['status'], 'active');
  const dailyRate = pickNumber(row, ['daily_rate']);
  const advancePaid = pickNumber(row, ['advance_paid'], -1);
  const finalAmount = pickNumber(row, ['final_amount'], -1);
  const amount =
    finalAmount >= 0 ? finalAmount : advancePaid >= 0 ? advancePaid : dailyRate;
  const lateFee =
    pickNumber(row, ['late_charges']) ||
    pickNumber(row, ['damage_charges']) ||
    0;

  return {
    id: String(row.id ?? index),
    rentalCode: rentalCode.startsWith('#') ? rentalCode : `#${rentalCode}`,
    customer: customerName,
    vehicle: vehicleLabel,
    amount,
    orderStatus: mapOrderStatus(statusRaw),
    paymentStatus: mapPaymentStatus(pickString(row, ['payment_status'], '')),
    startDate: pickString(row, ['start_date', 'pickup_date']),
    expectedReturnDate: pickString(row, [
      'expected_return_date',
      'end_date',
    ]),
    returnDate: pickString(row, ['return_date', 'actual_return_date']),
    lateFee,
  };
}

function daysBetween(start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) {
    return 0;
  }
  return Math.max(1, Math.round((b - a) / 86400000));
}

function buildMonthlySeries(rows: RentalRow[]): {
  rentals: number[];
  revenue: number[];
} {
  const now = new Date();
  const rentals = Array.from({length: 12}, () => 0);
  const revenue = Array.from({length: 12}, () => 0);

  rows.forEach(row => {
    const raw = row.startDate || row.returnDate || row.expectedReturnDate;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const monthDiff =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    if (monthDiff < 0 || monthDiff > 11) {
      return;
    }
    const index = 11 - monthDiff;
    rentals[index] += 1;
    revenue[index] += row.amount;
  });

  // Normalize revenue to chart scale 0-100 relative to max
  const maxRevenue = Math.max(...revenue, 1);
  const maxRentals = Math.max(...rentals, 1);
  return {
    rentals: rentals.map(value => Math.round((value / maxRentals) * 100)),
    revenue: revenue.map(value => Math.round((value / maxRevenue) * 100)),
  };
}

export function useRentalOrdersController(): RentalOrdersController {
  const colors = useThemeColors();
  const navigation = useNavigation<RentalOrdersNav>();
  const dispatch = useAppDispatch();
  const rentalsCache = useAppSelector(state => state.dataCache.rentals);
  const [activeTab, setActiveTab] = useState<RentalOrdersTabId>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [isSendRemindersModalVisible, setIsSendRemindersModalVisible] =
    useState(false);
  const [isCreateInvoiceModalVisible, setIsCreateInvoiceModalVisible] =
    useState(false);
  const [isExportPdfModalVisible, setIsExportPdfModalVisible] = useState(false);

  const [rows, setRows] = useState<RentalRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rentalIdByOrderId, setRentalIdByOrderId] = useState<
    Record<string, string>
  >({});

  const ensureRentals = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchRentals(options));
    },
    [dispatch],
  );
  useSmartFocusFetch(rentalsCache.meta.fetchedAt, ensureRentals);

  const fetchData = useCallback(async () => {
    try {
      const rentalsFromCache = rentalsCache.raw;
      const [rentOrdersRes, rentalsRes, completedRes] = await Promise.all([
        vehicleRentalRentOrdersService.listRentOrders({per_page: 50}),
        rentalsFromCache.length
          ? Promise.resolve({data: rentalsFromCache})
          : vehicleRentalRentalsService.listRentals({per_page: 100}),
        vehicleRentalRentalsService
          .listRentals({status: 'completed', per_page: 50})
          .catch(() => null),
      ]);
      const rentOrdersList = unwrapList(rentOrdersRes);
      const rentalsList = unwrapList(rentalsRes);
      const completedList = completedRes ? unwrapList(completedRes) : [];
      const source = rentalsList.length
        ? rentalsList
        : rentOrdersList.length
          ? rentOrdersList
          : completedList;
      const mapped = source.map(mapRentalRow);
      // Prefer completed endpoint rows when available for status accuracy
      if (completedList.length) {
        const completedMapped = completedList.map(mapRentalRow);
        const byId = new Map(mapped.map(row => [row.id, row]));
        completedMapped.forEach(row => {
          byId.set(row.id, {...row, orderStatus: 'Completed'});
        });
        setRows(Array.from(byId.values()));
      } else {
        setRows(mapped);
      }
      const meta = unwrapMeta(rentalsRes);
      setTotalCount(meta.total || mapped.length);

      const idMap: Record<string, string> = {};
      mapped.forEach(row => {
        idMap[row.rentalCode] = row.id;
      });
      setRentalIdByOrderId(idMap);
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load rental orders'),
        type: 'danger',
      });
    }
  }, [rentalsCache.raw]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const orders = useMemo<RentalOrderRow[]>(() => {
    const mapped = rows.map(row => ({
      id: row.id,
      orderId: row.rentalCode,
      customer: row.customer,
      amount: formatMoney(row.amount),
      payment: row.paymentStatus,
      status: row.orderStatus,
    }));
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return mapped;
    }
    return mapped.filter(
      order =>
        order.orderId.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query),
    );
  }, [rows, searchQuery]);

  const lateReturns = useMemo<LateReturnItem[]>(() => {
    return rows
      .filter(row => row.orderStatus === 'Overdue')
      .map(row => ({
        id: row.id,
        customer: row.customer,
        orderId: row.rentalCode,
        vehicle: row.vehicle,
        overdueLabel: formatOverdue(row.expectedReturnDate),
        lateFee: formatMoney(row.lateFee || 50),
      }));
  }, [rows]);

  const invoices = useMemo<InvoiceRow[]>(() => {
    const mapped = rows.map(row => ({
      id: row.id,
      invoiceId: `INV-${row.id}`,
      customer: row.customer,
      amount: formatMoney(row.amount),
      due: formatDateLabel(row.expectedReturnDate),
      status: mapInvoiceStatus(row.paymentStatus, row.orderStatus),
    }));
    const query = invoiceSearchQuery.trim().toLowerCase();
    if (!query) {
      return mapped;
    }
    return mapped.filter(
      invoice =>
        invoice.invoiceId.toLowerCase().includes(query) ||
        invoice.customer.toLowerCase().includes(query),
    );
  }, [invoiceSearchQuery, rows]);

  const invoiceMetrics = useMemo<MetricCardData[]>(() => {
    const allInvoices = rows.map(row => ({
      amount: row.amount,
      status: mapInvoiceStatus(row.paymentStatus, row.orderStatus),
    }));
    const totalInvoiced = allInvoices.reduce((sum, item) => sum + item.amount, 0);
    const paid = allInvoices
      .filter(item => item.status === 'Paid')
      .reduce((sum, item) => sum + item.amount, 0);
    const pending = allInvoices
      .filter(item => item.status === 'Pending')
      .reduce((sum, item) => sum + item.amount, 0);
    const overdue = allInvoices
      .filter(item => item.status === 'Overdue')
      .reduce((sum, item) => sum + item.amount, 0);

    return [
      {
        id: 'total',
        label: 'Total Invoiced',
        value: formatMoney(totalInvoiced),
        change: '',
        positive: true,
        backgroundColor: colors.metricBlue,
        icon: 'documentFile',
        iconBg: colors.actionTint12,
        sparklineColor: colors.actionBlue,
        sparklinePoints: [10, 14, 12, 18, 16, 20, 22, 26],
      },
      {
        id: 'paid',
        label: 'Paid',
        value: formatMoney(paid),
        change: '',
        positive: true,
        backgroundColor: colors.metricGreen,
        icon: 'activityCheck',
        iconBg: 'rgba(32,180,107,0.12)',
        sparklineColor: colors.successBright,
        sparklinePoints: [8, 10, 12, 11, 14, 16, 18, 22],
      },
      {
        id: 'pending',
        label: 'Pending',
        value: formatMoney(pending),
        change: '',
        positive: false,
        backgroundColor: colors.metricOrange,
        icon: 'statusPending',
        iconBg: 'rgba(245,158,11,0.14)',
        sparklineColor: colors.late,
        sparklinePoints: [20, 18, 16, 15, 14, 12, 11, 10],
      },
      {
        id: 'overdue',
        label: 'Overdue',
        value: formatMoney(overdue),
        change: '',
        positive: overdue === 0,
        backgroundColor: colors.metricPurple,
        icon: 'statusOverdue',
        iconBg: 'rgba(139,92,246,0.12)',
        sparklineColor: colors.deptSales,
        sparklinePoints: [8, 10, 11, 13, 12, 15, 16, 18],
      },
    ];
  }, [rows]);

  const ordersSummary = useMemo(() => {
    const revenue = rows.reduce((sum, row) => sum + row.amount, 0);
    return `${totalCount} orders this quarter · ${formatMoney(revenue)} revenue`;
  }, [rows, totalCount]);

  const historySummary = ordersSummary;

  const historySeries = useMemo(() => buildMonthlySeries(rows), [rows]);

  const historyCompleted = useMemo<HistoryCompletedRow[]>(() => {
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    return rows
      .filter(row => {
        if (row.orderStatus !== 'Completed') {
          return false;
        }
        const stamp = new Date(
          row.returnDate || row.expectedReturnDate || row.startDate,
        ).getTime();
        return Number.isFinite(stamp) ? stamp >= thirtyDaysAgo : true;
      })
      .slice(0, 8)
      .map(row => {
        const end = row.returnDate || row.expectedReturnDate;
        const days = daysBetween(row.startDate, end);
        return {
          id: row.id,
          vehicle: row.vehicle,
          days: String(days || '—'),
          amount: formatMoney(row.amount),
        };
      });
  }, [rows]);

  const lateSummary = useMemo(() => {
    const fees = lateReturns.reduce(
      (sum, item) => sum + (Number(item.lateFee.replace(/[^0-9.]/g, '')) || 0),
      0,
    );
    return `${lateReturns.length} rentals past their return window · ${formatMoney(fees)} in late fees pending`;
  }, [lateReturns]);

  const invoicesSummary = 'Every invoice issued for rental orders';

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onExportPress = useCallback(() => {}, []);
  const onExportPdfPress = useCallback(() => {
    setIsExportPdfModalVisible(true);
  }, []);
  const onCloseExportPdfModal = useCallback(() => {
    setIsExportPdfModalVisible(false);
  }, []);
  const onConfirmExportPdf = useCallback(() => {
    setIsExportPdfModalVisible(false);
  }, []);
  const onPrintPress = useCallback(() => {}, []);
  const onCreateInvoicePress = useCallback(() => {
    setIsCreateInvoiceModalVisible(true);
  }, []);
  const onCloseCreateInvoiceModal = useCallback(() => {
    setIsCreateInvoiceModalVisible(false);
  }, []);
  const onConfirmCreateInvoice = useCallback(() => {
    setIsCreateInvoiceModalVisible(false);
  }, []);
  const onSendRemindersPress = useCallback(() => {
    setIsSendRemindersModalVisible(true);
  }, []);
  const onCloseSendRemindersModal = useCallback(() => {
    setIsSendRemindersModalVisible(false);
  }, []);
  const onConfirmSendReminders = useCallback(() => {
    setIsSendRemindersModalVisible(false);
  }, []);
  const onStatusFilterPress = useCallback(() => {}, []);
  const onDateFilterPress = useCallback(() => {}, []);

  const onOrderPress = useCallback(
    (orderId: string) => {
      const rentalId = rentalIdByOrderId[orderId];
      if (rentalId) {
        navigation.navigate('RentalInvoice', {rentalId});
      }
    },
    [navigation, rentalIdByOrderId],
  );

  const onInvoicePress = useCallback(
    (invoiceId: string) => {
      const rentalId = invoiceId.replace(/^INV-/, '');
      if (rentalId) {
        navigation.navigate('RentalInvoice', {rentalId});
      }
    },
    [navigation],
  );

  const onViewInvoicePress = useCallback(
    (invoiceId: string) => {
      onInvoicePress(invoiceId);
    },
    [onInvoicePress],
  );

  const onCallPress = useCallback((_id: string) => {}, []);
  const onEmailPress = useCallback((_id: string) => {}, []);
  const onChargeFeePress = useCallback(
    (id: string) => {
      navigation.navigate('ReturnVehicle', {rentalId: id});
    },
    [navigation],
  );

  return {
    tabs: TABS,
    activeTab,
    ordersSummary,
    historySummary,
    lateSummary,
    invoicesSummary,
    searchQuery,
    invoiceSearchQuery,
    showingLabel: `Showing ${orders.length} of ${totalCount}`,
    orders,
    lateReturns,
    invoiceMetrics,
    invoices,
    historyRentalsSeries: historySeries.rentals,
    historyRevenueSeries: historySeries.revenue,
    historyCompleted,
    onBackPress,
    setActiveTab,
    setSearchQuery,
    setInvoiceSearchQuery,
    onExportPress,
    onExportPdfPress,
    isExportPdfModalVisible,
    onCloseExportPdfModal,
    onConfirmExportPdf,
    onPrintPress,
    onCreateInvoicePress,
    isCreateInvoiceModalVisible,
    onCloseCreateInvoiceModal,
    onConfirmCreateInvoice,
    onSendRemindersPress,
    isSendRemindersModalVisible,
    onCloseSendRemindersModal,
    onConfirmSendReminders,
    onStatusFilterPress,
    onDateFilterPress,
    onOrderPress,
    onInvoicePress,
    onViewInvoicePress,
    onCallPress,
    onEmailPress,
    onChargeFeePress,
  };
}
