import {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MetricCardData} from '../../../components/MetricCard';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {RentalsStackParamList} from '../../../navigation/types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchRentals} from '../../../store/dataCacheSlice';
import {useThemeColors, type AppColors} from '../../../theme';
import {
  asRecord,
  formatMoney,
  pickNumber,
  pickString,
  todayLabel,
} from '../../../utils/apiHelpers';
import type {RentalsController, UpcomingPickup} from './module';

type RentalsNav = NativeStackNavigationProp<
  RentalsStackParamList,
  'RentalsList'
>;

const RENTALS_SERIES = [
  12, 14, 18, 16, 20, 22, 19, 24, 26, 23, 28, 25, 30, 27, 32, 29, 34, 31, 36,
  33, 38, 35, 40, 37, 42, 39, 44, 41, 46, 43,
];

const RETURNS_SERIES = [
  8, 10, 12, 11, 14, 13, 15, 16, 14, 17, 18, 16, 19, 18, 21, 20, 22, 21, 24,
  23, 25, 24, 27, 26, 28, 27, 30, 29, 31, 30,
];

function pickupIconBg(c: AppColors) {
  return [c.activityBook, c.activityPay, c.activityService];
}

function buildMetrics(
  colors: AppColors,
  activeCount: number,
  dueTodayCount: number,
  lateCount: number,
  revenue: number,
): MetricCardData[] {
  return [
    {
      id: 'active',
      label: 'Active Rentals',
      value: String(activeCount),
      change: '',
      positive: true,
      backgroundColor: colors.metricBlue,
      icon: 'rentals',
      iconBg: colors.actionTint12,
      sparklineColor: colors.actionBlue,
      sparklinePoints: RENTALS_SERIES.slice(0, 8),
    },
    {
      id: 'due',
      label: 'Due Today',
      value: String(dueTodayCount),
      change: '',
      positive: true,
      backgroundColor: colors.metricOrange,
      icon: 'shiftClock',
      iconBg: 'rgba(245,158,11,0.14)',
      sparklineColor: colors.late,
      sparklinePoints: RETURNS_SERIES.slice(0, 8),
    },
    {
      id: 'late',
      label: 'Late Returns',
      value: String(lateCount),
      change: '',
      positive: lateCount === 0,
      backgroundColor: colors.metricGreen,
      icon: 'statusOverdue',
      iconBg: 'rgba(32,180,107,0.12)',
      sparklineColor: colors.successBright,
      sparklinePoints: [18, 16, 14, 12, 10, 8, 7, 5],
    },
    {
      id: 'revenue',
      label: 'Rental Revenue',
      value: formatMoney(revenue),
      change: '',
      positive: true,
      backgroundColor: colors.metricPurple,
      icon: 'revenue',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: colors.deptSales,
      sparklinePoints: [8, 11, 13, 12, 16, 18, 20, 24],
    },
  ];
}

function formatWhen(dateValue: string): string {
  if (!dateValue) {
    return '—';
  }
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }
  const todayIso = new Date().toDateString();
  const label = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const time = parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return parsed.toDateString() === todayIso ? `Today · ${time}` : `${label} · ${time}`;
}

export function useRentalsController(): RentalsController {
  const colors = useThemeColors();
  const navigation = useNavigation<RentalsNav>();
  const dispatch = useAppDispatch();
  const userName = useAppSelector(state => state.app.userName);
  const rentalsCache = useAppSelector(state => state.dataCache.rentals);

  const fetchData = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchRentals(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(rentalsCache.meta.fetchedAt, fetchData);

  const derived = useMemo(() => {
    const rentals = rentalsCache.raw.map(item => asRecord(item));
    const todayIso = new Date().toISOString().slice(0, 10);

    let activeCount = 0;
    let dueTodayCount = 0;
    let lateCount = 0;
    let revenue = 0;

    rentals.forEach(row => {
      const status = pickString(row, ['status'], 'active').toLowerCase();
      const returnDate = pickString(row, [
        'expected_return_date',
        'return_date',
      ]);
      const startDate = pickString(row, ['start_date', 'pickup_date']);
      const dailyRate = pickNumber(row, ['daily_rate']);
      const advancePaid = pickNumber(row, ['advance_paid'], -1);

      if (status.includes('overdue') || status.includes('late')) {
        lateCount += 1;
      } else if (status.includes('active')) {
        activeCount += 1;
      }

      if (returnDate && returnDate.slice(0, 10) === todayIso) {
        dueTodayCount += 1;
      }

      if (advancePaid >= 0) {
        revenue += advancePaid;
      } else if (dailyRate > 0) {
        const start = new Date(startDate).getTime();
        const end = new Date(returnDate).getTime();
        const days =
          Number.isFinite(start) && Number.isFinite(end) && end > start
            ? Math.max(1, Math.round((end - start) / 86400000))
            : 1;
        revenue += dailyRate * days;
      }
    });

    const upcoming: UpcomingPickup[] = rentals
      .filter(row => {
        const status = pickString(row, ['status'], '').toLowerCase();
        return status.includes('pending') || status.includes('reserved');
      })
      .slice(0, 3)
      .map((row, index) => {
        const customer = asRecord(row.customer);
        const vehicle = asRecord(row.vehicle);
        const name =
          pickString(customer, ['name', 'full_name']) ||
          pickString(row, ['customer_name'], 'Customer');
        const vehicleLabel =
          [pickString(vehicle, ['make']), pickString(vehicle, ['model'])]
            .filter(Boolean)
            .join(' ') || pickString(row, ['vehicle_name'], 'Vehicle');
        const rentalCode = pickString(
          row,
          ['rental_no', 'code'],
          `RN-${row.id ?? index}`,
        );
        return {
          id: String(row.id ?? index),
          name,
          vehicle: vehicleLabel,
          when: formatWhen(pickString(row, ['start_date', 'pickup_date'])),
          rentalId: rentalCode.startsWith('#') ? rentalCode : `#${rentalCode}`,
          iconBg: pickupIconBg(colors)[index % 3],
        };
      });

    return {
      metrics: buildMetrics(colors, activeCount, dueTodayCount, lateCount, revenue),
      summary: `${activeCount} active rentals · ${dueTodayCount} returns due today · ${lateCount} overdue`,
      upcomingPickups: upcoming,
    };
  }, [colors, rentalsCache.raw]);

  const onViewVehiclesPress = useCallback(() => {
    navigation.navigate('AllVehicles');
  }, [navigation]);

  const onNewRentalPress = useCallback(() => {
    navigation.navigate('NewRental');
  }, [navigation]);

  return {
    isLoading:
      rentalsCache.meta.loading && rentalsCache.meta.fetchedAt == null,
    userName: userName || 'User',
    dateLabel: todayLabel(),
    summary: derived.summary,
    metrics: derived.metrics,
    rentalsSeries: RENTALS_SERIES,
    returnsSeries: RETURNS_SERIES,
    upcomingPickups: derived.upcomingPickups,
    onViewVehiclesPress,
    onNewRentalPress,
  };
}
