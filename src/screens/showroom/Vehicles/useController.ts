import {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DepartmentItem} from '../../../components/DepartmentDonut';
import {FleetUsageMonth} from '../../../components/FleetUsageChart';
import {MetricCardData} from '../../../components/MetricCard';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchVehicles} from '../../../store/dataCacheSlice';
import {useThemeColors, type AppColors} from '../../../theme';
import {
  AnyRecord,
  asRecord,
  formatCount,
  formatMoney,
  pickNumber,
  pickString,
  todayLabel,
} from '../../../utils/apiHelpers';
import type {VehiclesController} from './module';

type VehiclesNav = NativeStackNavigationProp<
  VehiclesStackParamList,
  'VehiclesMain'
>;

const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'A', 'S', 'O', 'N', 'D'];

const CATEGORY_COLORS: Record<string, string> = {
  luxury: '#8B5CF6',
  suv: '#3B82F6',
  sedan: '#20B46B',
  sports: '#EF4444',
  electric: '#F59E0B',
  van: '#14B8A6',
};

const CATEGORY_PALETTE = [
  '#8B5CF6',
  '#3B82F6',
  '#20B46B',
  '#EF4444',
  '#F59E0B',
  '#14B8A6',
];

function metricBase(c: AppColors): Omit<MetricCardData, 'value'>[] {
  return [
    {
      id: 'total',
      label: 'Total Vehicles',
      change: '4.2%',
      positive: true,
      backgroundColor: c.metricBlue,
      icon: 'vehicles',
      iconBg: c.actionTint1,
      sparklineColor: c.actionBlue,
      sparklinePoints: [0.35, 0.42, 0.48, 0.52, 0.58, 0.62],
    },
    {
      id: 'available',
      label: 'Available',
      change: '2.1%',
      positive: true,
      backgroundColor: c.metricGreen,
      icon: 'statusActive',
      iconBg: 'rgba(32,180,107,0.1)',
      sparklineColor: c.successBright,
      sparklinePoints: [0.28, 0.34, 0.36, 0.4, 0.43, 0.45],
    },
    {
      id: 'maintenance',
      label: 'In Maintenance',
      change: '3%',
      positive: false,
      backgroundColor: c.metricOrange,
      icon: 'activityWrench',
      iconBg: 'rgba(245,158,11,0.12)',
      sparklineColor: c.late,
      sparklinePoints: [0.22, 0.2, 0.18, 0.16, 0.14, 0.12],
    },
    {
      id: 'fleet-value',
      label: 'Fleet Value',
      change: '6.4%',
      positive: true,
      backgroundColor: c.metricPurple,
      icon: 'revenue',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: c.deptSales,
      sparklinePoints: [0.4, 0.46, 0.5, 0.58, 0.64, 0.72],
    },
  ];
}

function formatFleetValue(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}K`;
  }
  return formatMoney(amount);
}

function statusBucket(raw: string): 'available' | 'rented' | 'maintenance' | 'other' {
  const key = raw.trim().toLowerCase();
  if (key.includes('maint') || key.includes('service') || key.includes('repair')) {
    return 'maintenance';
  }
  if (key.includes('rent') || key.includes('book')) {
    return 'rented';
  }
  if (key.includes('avail') || key.includes('active') || key.includes('ready')) {
    return 'available';
  }
  return 'other';
}

function categoryColor(label: string, index: number): string {
  const key = label.trim().toLowerCase();
  return CATEGORY_COLORS[key] ?? CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

function buildCategories(rows: AnyRecord[]): {
  items: DepartmentItem[];
  total: number;
} {
  const counts = new Map<string, number>();
  rows.forEach(item => {
    const row = asRecord(item);
    const category = asRecord(row.category);
    const label =
      pickString(category, ['name', 'title']) ||
      pickString(row, ['category_name', 'category'], 'Other');
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  const items = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], index) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      count,
      color: categoryColor(label, index),
    }));

  return {items, total: rows.length};
}

function buildFleetUsage(
  total: number,
  rented: number,
  maintenance: number,
): FleetUsageMonth[] {
  const now = new Date();
  const utilized = total ? Math.round(((rented + maintenance) / total) * 100) : 0;

  return Array.from({length: 6}, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const drift = (index - 2.5) * 4;
    return {
      label: MONTH_LABELS[month.getMonth()],
      value: Math.min(100, Math.max(0, utilized + drift)),
    };
  });
}

export function useVehiclesController(): VehiclesController {
  const colors = useThemeColors();
  const navigation = useNavigation<VehiclesNav>();
  const dispatch = useAppDispatch();
  const userName = useAppSelector(state => state.app.userName);
  const vehiclesCache = useAppSelector(state => state.dataCache.vehicles);

  const fetchData = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchVehicles(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(vehiclesCache.meta.fetchedAt, fetchData);

  const derived = useMemo(() => {
    const rows = vehiclesCache.raw.map(item => asRecord(item));
    let available = 0;
    let maintenance = 0;
    let rented = 0;
    let fleetValue = 0;

    rows.forEach(row => {
      const bucket = statusBucket(pickString(row, ['status'], 'available'));
      if (bucket === 'available') {
        available += 1;
      } else if (bucket === 'maintenance') {
        maintenance += 1;
      } else if (bucket === 'rented') {
        rented += 1;
      } else {
        available += 1;
      }
      fleetValue += pickNumber(row, [
        'market_value',
        'purchase_price',
        'value',
        'price',
      ]);
    });

    const total = rows.length;
    const categoryData = buildCategories(rows);
    const bases = metricBase(colors);

    return {
      metrics: [
        {...bases[0], value: formatCount(total)},
        {...bases[1], value: formatCount(available)},
        {...bases[2], value: formatCount(maintenance)},
        {...bases[3], value: formatFleetValue(fleetValue)},
      ] as MetricCardData[],
      fleetUsage: buildFleetUsage(total, rented, maintenance),
      categories: categoryData.items,
      categoryTotal: categoryData.total,
      summary: `${formatCount(total)} vehicles across ${
        categoryData.items.length || 1
      } categories · ${formatCount(available)} available now`,
    };
  }, [colors, vehiclesCache.raw]);

  const onAuctionPress = useCallback(() => {}, []);

  const onVehiclesPress = useCallback(() => {
    navigation.navigate('VehicleList');
  }, [navigation]);

  return {
    userName: userName || 'User',
    dateLabel: todayLabel(),
    summary: derived.summary,
    metrics: derived.metrics,
    fleetUsage: derived.fleetUsage,
    categories: derived.categories,
    categoryTotal: derived.categoryTotal,
    isLoading:
      vehiclesCache.meta.loading && vehiclesCache.meta.fetchedAt == null,
    onAuctionPress,
    onVehiclesPress,
  };
}
