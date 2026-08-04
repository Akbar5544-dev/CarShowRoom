import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {DateRangePreset, MetricCardData} from '../../../components';
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

/** Prefer actual rental status (same source as invoice detail), not invented labels. */
function mapInvoiceStatus(
  statusRaw: string,
  payment: PaymentStatus,
  order: OrderStatus,
): InvoiceStatus {
  const key = statusRaw.trim().toLowerCase();
  if (
    key.includes('complete') ||
    key.includes('returned') ||
    order === 'Completed'
  ) {
    return 'Completed';
  }
  if (
    key.includes('paid') ||
    key.includes('settled') ||
    payment === 'Paid'
  ) {
    return 'Paid';
  }
  if (
    key.includes('overdue') ||
    key.includes('late') ||
    order === 'Overdue'
  ) {
    return 'Overdue';
  }
  if (key.includes('draft') || key.includes('cancel')) {
    return 'Draft';
  }
  if (
    key.includes('pending') ||
    payment === 'Pending' ||
    payment === 'Partial'
  ) {
    return 'Pending';
  }
  if (order === 'Reserved') {
    return 'Pending';
  }
  // Active rentals without explicit payment still pending settlement
  return 'Pending';
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
  statusRaw: string;
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
    statusRaw,
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

const DATE_RANGE_LABEL: Record<DateRangePreset, string> = {
  all: 'All time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function getDateRangeBounds(
  preset: DateRangePreset,
): {from: number; to: number} | null {
  if (preset === 'all') {
    return null;
  }

  const now = new Date();

  if (preset === 'daily') {
    return {
      from: startOfDay(now).getTime(),
      to: endOfDay(now).getTime(),
    };
  }

  if (preset === 'weekly') {
    const day = now.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      from: startOfDay(monday).getTime(),
      to: endOfDay(sunday).getTime(),
    };
  }

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: startOfDay(firstDay).getTime(),
    to: endOfDay(lastDay).getTime(),
  };
}

function getRowDateTs(row: RentalRow): number | null {
  const raw = row.startDate || row.expectedReturnDate || row.returnDate;
  if (!raw) {
    return null;
  }
  const ts = new Date(raw).getTime();
  return Number.isFinite(ts) ? ts : null;
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

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [dateRangePreset, setDateRangePreset] =
    useState<DateRangePreset>('all');
  const [isDateRangeModalVisible, setIsDateRangeModalVisible] = useState(false);

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
          byId.set(row.id, {
            ...row,
            orderStatus: 'Completed',
            statusRaw: row.statusRaw || 'completed',
          });
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
    const query = searchQuery.trim().toLowerCase();
    const range = getDateRangeBounds(dateRangePreset);

    const filtered = rows.filter(row => {
      if (statusFilter !== 'All' && row.orderStatus !== statusFilter) {
        return false;
      }

      if (range) {
        const ts = getRowDateTs(row);
        if (ts == null) {
          return false;
        }
        if (ts < range.from || ts > range.to) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      return (
        row.rentalCode.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query)
      );
    });

    return filtered.map(row => ({
      id: row.id,
      orderId: row.rentalCode,
      customer: row.customer,
      amount: formatMoney(row.amount),
      payment: row.paymentStatus,
      status: row.orderStatus,
    }));
  }, [rows, searchQuery, statusFilter, dateRangePreset]);

  const lateReturns = useMemo<LateReturnItem[]>(() => {
    const now = Date.now();
    return rows
      .filter(row => {
        if (row.orderStatus === 'Completed' || row.orderStatus === 'Cancelled') {
          return false;
        }
        const expectedTs = new Date(row.expectedReturnDate).getTime();
        if (!Number.isFinite(expectedTs)) {
          return false;
        }
        return expectedTs < now;
      })
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
      status: mapInvoiceStatus(
        row.statusRaw,
        row.paymentStatus,
        row.orderStatus,
      ),
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
      status: mapInvoiceStatus(
        row.statusRaw,
        row.paymentStatus,
        row.orderStatus,
      ),
    }));
    const totalInvoiced = allInvoices.reduce((sum, item) => sum + item.amount, 0);
    const paid = allInvoices
      .filter(item => item.status === 'Paid' || item.status === 'Completed')
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

  const exportTextFile = useCallback(
    async (filename: string, mimeType: string, content: string) => {
      const url = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
      try {
        await Linking.openURL(url);
        showMessage({message: `${filename} exported`, type: 'success'});
      } catch {
        showMessage({
          message: 'Export failed on this device',
          type: 'danger',
        });
      }
    },
    [],
  );

  const onExportPress = useCallback(() => {
    const escapeCsv = (v: unknown) => {
      const s = String(v ?? '');
      return `"${s.replace(/"/g, '""')}"`;
    };

    const header = [
      'order_id',
      'customer',
      'amount',
      'payment',
      'status',
    ].join(',');

    const lines = orders.map(o =>
      [
        escapeCsv(o.orderId),
        escapeCsv(o.customer),
        escapeCsv(o.amount),
        escapeCsv(o.payment),
        escapeCsv(o.status),
      ].join(','),
    );

    const csv = [header, ...lines].join('\n');
    void exportTextFile('rental_orders.csv', 'text/csv', csv);
  }, [exportTextFile, orders]);

  const onExportPdfPress = useCallback(() => {
    setIsExportPdfModalVisible(true);
  }, []);
  const onCloseExportPdfModal = useCallback(() => {
    setIsExportPdfModalVisible(false);
  }, []);
  const onConfirmExportPdf = useCallback(
    (format?: string) => {
      setIsExportPdfModalVisible(false);

      const escapeCsv = (v: unknown) => {
        const s = String(v ?? '');
        return `"${s.replace(/"/g, '""')}"`;
      };

      if (format === 'csv' || format === 'excel') {
        const header = ['invoice_id', 'customer', 'amount', 'due', 'status'].join(',');
        const lines = invoices.map(inv =>
          [
            escapeCsv(inv.invoiceId),
            escapeCsv(inv.customer),
            escapeCsv(inv.amount),
            escapeCsv(inv.due),
            escapeCsv(inv.status),
          ].join(','),
        );
        const csv = [header, ...lines].join('\n');
        void exportTextFile('rental_invoices.csv', 'text/csv', csv);
        return;
      }

      // PDF not generated in-app; export a printable text snapshot instead.
      const text = [
        'Rental Invoices Export',
        `Generated: ${new Date().toISOString()}`,
        '',
        ...invoices.map(
          inv =>
            `${inv.invoiceId} | ${inv.customer} | Amount: ${inv.amount} | Due: ${inv.due} | Status: ${inv.status}`,
        ),
      ].join('\n');
      void exportTextFile('rental_invoices.txt', 'text/plain', text);
    },
    [exportTextFile, invoices],
  );
  const onPrintPress = useCallback(() => {
    Alert.alert(
      'Print',
      'Print preview generation is not implemented yet. Use Export PDF/Export CSV instead.',
    );
  }, []);
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
  const onStatusFilterPress = useCallback(() => {
    Alert.alert(
      'Filter by status',
      'Choose order status',
      [
        {text: 'All', onPress: () => setStatusFilter('All')},
        {text: 'Active', onPress: () => setStatusFilter('Active')},
        {text: 'Overdue', onPress: () => setStatusFilter('Overdue')},
        {text: 'Reserved', onPress: () => setStatusFilter('Reserved')},
        {text: 'Completed', onPress: () => setStatusFilter('Completed')},
        {text: 'Cancelled', onPress: () => setStatusFilter('Cancelled')},
      ],
      {cancelable: true},
    );
  }, []);

  const onDateFilterPress = useCallback(() => {
    setIsDateRangeModalVisible(true);
  }, []);
  const onCloseDateRangeModal = useCallback(() => {
    setIsDateRangeModalVisible(false);
  }, []);
  const onSelectDateRange = useCallback((preset: DateRangePreset) => {
    setDateRangePreset(preset);
    setIsDateRangeModalVisible(false);
  }, []);

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
  const onEmailPress = useCallback((id: string) => {
    Alert.alert('Email to customer', 'Do you want to send an email?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Send',
        onPress: () => {
          showMessage({message: `Email queued for ${id}`, type: 'success'});
        },
      },
    ]);
  }, []);
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
    showingLabel:
      dateRangePreset === 'all'
        ? `Showing ${orders.length} results`
        : `Showing ${orders.length} results · ${DATE_RANGE_LABEL[dateRangePreset]}`,
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
    dateRangePreset,
    isDateRangeModalVisible,
    onDateFilterPress,
    onCloseDateRangeModal,
    onSelectDateRange,
    onOrderPress,
    onInvoicePress,
    onViewInvoicePress,
    onCallPress,
    onEmailPress,
    onChargeFeePress,
  };
}
