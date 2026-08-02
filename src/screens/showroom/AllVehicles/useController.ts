import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ActiveRental, RentalStatus} from '../../../components/ActiveRentalCard';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {RentalsStackParamList} from '../../../navigation/types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchRentals} from '../../../store/dataCacheSlice';
import {
  asRecord,
  formatCount,
  formatMoney,
  pickNumber,
  pickString,
} from '../../../utils/apiHelpers';
import type {AllVehiclesController} from './module';

type AllVehiclesNav = NativeStackNavigationProp<
  RentalsStackParamList,
  'AllVehicles'
>;

const IMAGE_TINTS = [
  '#DBEAFE',
  '#D1FAE5',
  '#EDE9FE',
  '#FFE4E6',
  '#FFEDD5',
  '#E0F2FE',
];

function mapRentalStatus(raw: string): RentalStatus {
  const key = raw.trim().toLowerCase();
  if (key.includes('overdue') || key.includes('late')) {
    return 'Overdue';
  }
  if (
    key.includes('pending') ||
    key.includes('reserv') ||
    key.includes('book')
  ) {
    return 'Pending';
  }
  return 'Active';
}

function isBookedRental(rawStatus: string): boolean {
  const key = rawStatus.trim().toLowerCase();
  if (!key) {
    return true;
  }
  if (
    key.includes('complete') ||
    key.includes('return') ||
    key.includes('cancel') ||
    key.includes('close')
  ) {
    return false;
  }
  return true;
}

function formatDateTime(value: string): string {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function rentalProgress(
  startDate: string,
  expectedReturnDate: string,
  status: RentalStatus,
): number {
  if (status === 'Overdue') {
    return 100;
  }
  const start = new Date(startDate).getTime();
  const end = new Date(expectedReturnDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return status === 'Pending' ? 10 : 50;
  }
  const ratio = (Date.now() - start) / (end - start);
  return Math.max(5, Math.min(100, Math.round(ratio * 100)));
}

function mapActiveRental(item: unknown, index: number): ActiveRental | null {
  const row = asRecord(item);
  const statusRaw = pickString(row, ['status'], 'active');
  if (!isBookedRental(statusRaw)) {
    return null;
  }

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
  const startDate = pickString(row, ['start_date', 'pickup_date']);
  const expectedReturnDate = pickString(row, [
    'expected_return_date',
    'end_date',
    'return_date',
  ]);
  const dailyRate = pickNumber(row, ['daily_rate']);
  const finalAmount = pickNumber(row, ['final_amount'], -1);
  const advancePaid = pickNumber(row, ['advance_paid'], -1);
  const amount =
    finalAmount >= 0 ? finalAmount : advancePaid >= 0 ? advancePaid : dailyRate;
  const status = mapRentalStatus(statusRaw);

  return {
    id: String(row.id ?? index),
    rentalId: rentalCode.startsWith('#') ? rentalCode : `#${rentalCode}`,
    customer: customerName,
    vehicle: vehicleLabel,
    location:
      pickString(row, ['pickup_location', 'location']) ||
      pickString(vehicle, ['location'], '—'),
    pickup: formatDateTime(startDate),
    returnDate: formatDateTime(expectedReturnDate),
    amount: formatMoney(amount),
    progress: rentalProgress(startDate, expectedReturnDate, status),
    status,
    imageTint: IMAGE_TINTS[index % IMAGE_TINTS.length],
  };
}

export function useAllVehiclesController(): AllVehiclesController {
  const navigation = useNavigation<AllVehiclesNav>();
  const dispatch = useAppDispatch();
  const rentalsCache = useAppSelector(state => state.dataCache.rentals);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchRentals(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(rentalsCache.meta.fetchedAt, fetchData);

  const bookedRentals = useMemo(() => {
    return rentalsCache.raw
      .map(mapActiveRental)
      .filter((item): item is ActiveRental => item != null);
  }, [rentalsCache.raw]);

  const summary = useMemo(() => {
    if (!bookedRentals.length && rentalsCache.meta.error) {
      return 'Unable to load booked rentals right now';
    }
    if (!bookedRentals.length) {
      return 'No active rentals';
    }
    const active = bookedRentals.filter(item => item.status === 'Active').length;
    const overdue = bookedRentals.filter(
      item => item.status === 'Overdue',
    ).length;
    const pending = bookedRentals.filter(
      item => item.status === 'Pending',
    ).length;
    return `${formatCount(active)} active · ${formatCount(
      pending,
    )} pending · ${formatCount(overdue)} overdue`;
  }, [bookedRentals, rentalsCache.meta.error]);

  const filteredRentals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return bookedRentals;
    }
    return bookedRentals.filter(
      item =>
        item.customer.toLowerCase().includes(query) ||
        item.vehicle.toLowerCase().includes(query) ||
        item.rentalId.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query),
    );
  }, [bookedRentals, searchQuery]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onReturnPress = useCallback(
    (item: ActiveRental) => {
      navigation.navigate('ReturnVehicle', {rentalId: item.id});
    },
    [navigation],
  );

  const onInvoicePress = useCallback(
    (item: ActiveRental) => {
      navigation.navigate('RentalInvoice', {rentalId: item.id});
    },
    [navigation],
  );

  return {
    isLoading:
      rentalsCache.meta.loading && rentalsCache.meta.fetchedAt == null,
    summary,
    searchQuery,
    filteredRentals,
    setSearchQuery,
    onBackPress,
    onReturnPress,
    onInvoicePress,
  };
}
