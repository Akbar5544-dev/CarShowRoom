import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {IconName} from '../assets/iconXml';
import type {VehicleInventoryItem} from '../components/VehicleInventoryCard';
import type {ActivityLogItem} from '../screens/showroom/ActivityLog/module';
import {
  accountingCustomersService,
  auditLogsService,
  dashboardService,
  vehicleManagementVehiclesService,
  vehicleRentalRentalsService,
} from '../services';
import type {AppColors} from '../theme';
import {
  asRecord,
  formatCount,
  formatMoney,
  initialsFromName,
  pickNumber,
  pickString,
  titleCase,
  unwrapData,
  unwrapList,
} from '../utils/apiHelpers';
import {mapInventoryVehicle, mapRentalCustomer} from '../utils/vehicleMappers';

export type CachedFleet = {
  available: number;
  booked: number;
  service: number;
  total: number;
};

export type CachedHomeOrder = {
  id: string;
  initials: string;
  name: string;
  detail: string;
  status: 'Active' | 'Pending' | 'Overdue';
};

export type CachedActivityItem = {
  id: string;
  message: string;
  time: string;
  icon: IconName;
};

export type CachedDashboard = {
  totalVehicles: number;
  onRent: number;
  overdue: number;
  available: number;
  monthProfit: number;
  todaysExpenses: number | null;
  totalStaff: number;
};

export type CachedCustomer = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  licenseNo: string;
  licenseInfo: string;
  tier: 'Gold' | 'Platinum' | 'Silver';
};

type SectionMeta = {
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
};

export type DataCacheState = {
  home: {
    fleet: CachedFleet;
    dashboard: CachedDashboard;
    revenueTotal: string;
    revenueGrowth: string;
    orders: CachedHomeOrder[];
    activities: CachedActivityItem[];
    meta: SectionMeta;
  };
  activityLogs: {
    items: ActivityLogItem[];
    summary: string;
    meta: SectionMeta;
  };
  vehicles: {
    raw: unknown[];
    inventory: VehicleInventoryItem[];
    meta: SectionMeta;
  };
  rentals: {
    raw: unknown[];
    meta: SectionMeta;
  };
  customers: {
    items: CachedCustomer[];
    meta: SectionMeta;
  };
};

export type CacheFetchOptions = {
  silent?: boolean;
  force?: boolean;
};

const emptySection = (): SectionMeta => ({
  loading: false,
  error: null,
  fetchedAt: null,
});

const initialState: DataCacheState = {
  home: {
    fleet: {available: 0, booked: 0, service: 0, total: 0},
    dashboard: {
      totalVehicles: 0,
      onRent: 0,
      overdue: 0,
      available: 0,
      monthProfit: 0,
      todaysExpenses: null,
      totalStaff: 0,
    },
    revenueTotal: '$0',
    revenueGrowth: '—',
    orders: [],
    activities: [],
    meta: emptySection(),
  },
  activityLogs: {
    items: [],
    summary: 'Audit trail across all user actions · last 30 days',
    meta: emptySection(),
  },
  vehicles: {
    raw: [],
    inventory: [],
    meta: emptySection(),
  },
  rentals: {
    raw: [],
    meta: emptySection(),
  },
  customers: {
    items: [],
    meta: emptySection(),
  },
};

function mapOrders(rentals: unknown[]): CachedHomeOrder[] {
  return rentals.slice(0, 6).map((item, index) => {
    const row = asRecord(item);
    const customer = asRecord(row.customer);
    const vehicle = asRecord(row.vehicle);
    const name =
      pickString(customer, ['name', 'full_name']) ||
      pickString(row, ['customer_name', 'customer']) ||
      'Customer';
    const vehicleLabel =
      [pickString(vehicle, ['make']), pickString(vehicle, ['model'])]
        .filter(Boolean)
        .join(' ') ||
      pickString(row, ['vehicle_name', 'vehicle']) ||
      'Vehicle';
    const code =
      pickString(row, ['rental_no', 'code', 'id'], `#${index + 1}`) ||
      `#${row.id}`;
    const statusRaw = pickString(row, ['status'], 'active');
    const status = titleCase(statusRaw) as CachedHomeOrder['status'];
    return {
      id: String(row.id ?? index),
      initials: initialsFromName(name),
      name,
      detail: `${code} · ${vehicleLabel}`,
      status:
        status === 'Active' || status === 'Pending' || status === 'Overdue'
          ? status
          : statusRaw.toLowerCase() === 'overdue'
            ? 'Overdue'
            : statusRaw.toLowerCase() === 'pending'
              ? 'Pending'
              : 'Active',
    };
  });
}

function mapActivityPreview(logs: unknown[]): CachedActivityItem[] {
  const icons: IconName[] = [
    'activityCheck',
    'activityKey',
    'activityDollar',
    'activityWrench',
  ];
  return logs.slice(0, 8).map((item, index) => {
    const row = asRecord(item);
    return {
      id: String(row.id ?? index),
      message:
        pickString(row, ['description', 'message', 'action', 'event']) ||
        'Activity update',
      time: pickString(row, ['created_at', 'time', 'date'], ''),
      icon: icons[index % icons.length],
    };
  });
}

function timeAgoFrom(value: string): string {
  if (!value) {
    return '';
  }
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return value;
  }
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapActivityLogItem(
  row: Record<string, unknown>,
  index: number,
): ActivityLogItem {
  const record = asRecord(row);
  const actor = asRecord(record.user ?? record.actor);
  return {
    id: String(record.id ?? index),
    userName: pickString(
      actor,
      ['name', 'full_name'],
      pickString(record, ['user_name'], 'System'),
    ),
    action: pickString(record, ['description', 'action', 'event'], 'Activity update'),
    timeAgo: timeAgoFrom(pickString(record, ['created_at', 'timestamp'], '')),
    ip: pickString(record, ['ip_address', 'ip'], '—'),
  };
}

export const fetchHomeData = createAsyncThunk(
  'dataCache/fetchHomeData',
  async (_options: CacheFetchOptions | void) => {
    const [dashboardResponse, rentalsResponse, activitiesResponse] =
      await Promise.all([
        dashboardService.getDashboard(),
        vehicleRentalRentalsService.listRentals({per_page: 8}),
        auditLogsService.listAuditLogs({per_page: 8}),
      ]);

    return {
      dashboard: asRecord(unwrapData(dashboardResponse)),
      rentals: unwrapList(rentalsResponse),
      activities: unwrapList(activitiesResponse),
    };
  },
);

export const fetchActivityLogs = createAsyncThunk(
  'dataCache/fetchActivityLogs',
  async (_options: CacheFetchOptions | void) => {
    const response = await auditLogsService.listAuditLogs({per_page: 50});
    return unwrapList(response);
  },
);

export const fetchVehicles = createAsyncThunk(
  'dataCache/fetchVehicles',
  async (_options: CacheFetchOptions | void) => {
    const response = await vehicleManagementVehiclesService.listVehicles({
      per_page: 100,
    });
    return unwrapList(response);
  },
);

export const fetchRentals = createAsyncThunk(
  'dataCache/fetchRentals',
  async (_options: CacheFetchOptions | void) => {
    const response = await vehicleRentalRentalsService.listRentals({
      per_page: 100,
    });
    return unwrapList(response);
  },
);

export const fetchCustomers = createAsyncThunk(
  'dataCache/fetchCustomers',
  async (_options: CacheFetchOptions | void) => {
    const response = await accountingCustomersService.listCustomers({
      per_page: 50,
      customer_type: 'renter',
    });
    return unwrapList(response);
  },
);

/** Build metric display values from cached dashboard + theme colors */
export function buildHomeMetricValues(
  dashboard: CachedDashboard,
  colors: AppColors,
) {
  return [
    {
      id: 'vehicles',
      label: 'Total Vehicles',
      value: formatCount(dashboard.totalVehicles),
      change: '',
      positive: true,
      background: colors.metricBlue,
      icon: 'vehicles' as const,
    },
    {
      id: 'rentals',
      label: 'Active Rentals',
      value: formatCount(dashboard.onRent),
      change: '',
      positive: true,
      background: colors.metricGreen,
      icon: 'rentals' as const,
    },
    {
      id: 'revenue',
      label: "Month's Profit",
      value: formatMoney(dashboard.monthProfit),
      change: '',
      positive: true,
      background: colors.metricOrange,
      icon: 'revenue' as const,
    },
    {
      id: 'customers',
      label: 'Total Staff',
      value: formatCount(dashboard.totalStaff),
      change: '',
      positive: true,
      background: colors.metricPurple,
      icon: 'customers' as const,
    },
  ];
}

export function buildHomeStatusItems(
  dashboard: CachedDashboard,
  colors: AppColors,
) {
  return [
    {label: 'Available', count: dashboard.available, color: colors.statusAvailable},
    {label: 'Rented', count: dashboard.onRent, color: colors.statusRented},
    {label: 'Reserved', count: 0, color: colors.statusReserved},
    {label: 'Maintenance', count: 0, color: colors.statusMaintenance},
    {label: 'Overdue', count: dashboard.overdue, color: colors.statusInactive},
  ];
}

export function mapActivitiesWithTheme(
  items: CachedActivityItem[],
  colors: AppColors,
) {
  const backgrounds = [
    colors.activityReturn,
    colors.activityBook,
    colors.activityPay,
    colors.activityService,
  ];
  return items.map((item, index) => ({
    ...item,
    background: backgrounds[index % backgrounds.length],
  }));
}

function applyListPending(
  meta: SectionMeta,
  options: CacheFetchOptions | void,
) {
  const silent = options?.silent ?? false;
  if (!silent && meta.fetchedAt == null) {
    meta.loading = true;
  }
  meta.error = null;
}

const dataCacheSlice = createSlice({
  name: 'dataCache',
  initialState,
  reducers: {
    invalidateVehicles(state) {
      state.vehicles.meta.fetchedAt = null;
    },
    invalidateRentals(state) {
      state.rentals.meta.fetchedAt = null;
    },
    invalidateCustomers(state) {
      state.customers.meta.fetchedAt = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHomeData.pending, (state, action) => {
        applyListPending(state.home.meta, action.meta.arg);
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        const dashboard = action.payload.dashboard;
        const totalVehicles = pickNumber(dashboard, ['total_vehicles_in_stock']);
        const onRent = pickNumber(dashboard, ['cars_on_rent']);
        const overdue = pickNumber(dashboard, ['overdue_rentals']);
        const available = Math.max(totalVehicles - onRent, 0);
        const monthProfit = pickNumber(dashboard, ['this_month_profit']);
        const todaysExpenses = dashboard.todays_expenses;
        const totalStaff = pickNumber(dashboard, ['total_staff']);

        state.home.fleet = {
          available,
          booked: onRent,
          service: 0,
          total: totalVehicles,
        };
        state.home.dashboard = {
          totalVehicles,
          onRent,
          overdue,
          available,
          monthProfit,
          todaysExpenses:
            todaysExpenses == null ? null : Number(todaysExpenses) || 0,
          totalStaff,
        };
        state.home.revenueTotal = formatMoney(monthProfit);
        state.home.revenueGrowth =
          todaysExpenses != null
            ? `Exp ${formatMoney(Number(todaysExpenses))}`
            : '—';
        state.home.orders = mapOrders(action.payload.rentals);
        state.home.activities = mapActivityPreview(action.payload.activities);
        state.home.meta.loading = false;
        state.home.meta.fetchedAt = Date.now();

        // Seed rentals cache from home preview when empty / stale
        if (
          state.rentals.meta.fetchedAt == null ||
          action.payload.rentals.length >= state.rentals.raw.length
        ) {
          // Only seed if we don't have a fuller list yet
          if (state.rentals.raw.length < action.payload.rentals.length) {
            state.rentals.raw = action.payload.rentals;
            state.rentals.meta.fetchedAt = Date.now();
          }
        }
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.home.meta.loading = false;
        state.home.meta.error =
          action.error.message ?? 'Failed to load home data';
      })
      .addCase(fetchActivityLogs.pending, (state, action) => {
        applyListPending(state.activityLogs.meta, action.meta.arg);
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        const mapped = action.payload.map((row, index) =>
          mapActivityLogItem(asRecord(row), index),
        );
        state.activityLogs.items = mapped;
        state.activityLogs.summary = `${mapped.length} events · audit trail across all user actions`;
        state.activityLogs.meta.loading = false;
        state.activityLogs.meta.fetchedAt = Date.now();
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.activityLogs.meta.loading = false;
        state.activityLogs.meta.error =
          action.error.message ?? 'Failed to load activity log';
        state.activityLogs.summary = 'Unable to load activity log right now';
      })
      .addCase(fetchVehicles.pending, (state, action) => {
        applyListPending(state.vehicles.meta, action.meta.arg);
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehicles.raw = action.payload;
        state.vehicles.inventory = action.payload.map((item, index) =>
          mapInventoryVehicle(item, index),
        );
        state.vehicles.meta.loading = false;
        state.vehicles.meta.fetchedAt = Date.now();
        state.vehicles.meta.error = null;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.vehicles.meta.loading = false;
        state.vehicles.meta.error =
          action.error.message ?? 'Failed to load vehicles';
      })
      .addCase(fetchRentals.pending, (state, action) => {
        applyListPending(state.rentals.meta, action.meta.arg);
      })
      .addCase(fetchRentals.fulfilled, (state, action) => {
        state.rentals.raw = action.payload;
        state.rentals.meta.loading = false;
        state.rentals.meta.fetchedAt = Date.now();
        state.rentals.meta.error = null;
        // Keep home orders in sync when full list loads
        state.home.orders = mapOrders(action.payload);
      })
      .addCase(fetchRentals.rejected, (state, action) => {
        state.rentals.meta.loading = false;
        state.rentals.meta.error =
          action.error.message ?? 'Failed to load rentals';
      })
      .addCase(fetchCustomers.pending, (state, action) => {
        applyListPending(state.customers.meta, action.meta.arg);
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers.items = action.payload.map((item, index) =>
          mapRentalCustomer(asRecord(item), index),
        );
        state.customers.meta.loading = false;
        state.customers.meta.fetchedAt = Date.now();
        state.customers.meta.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customers.meta.loading = false;
        state.customers.meta.error =
          action.error.message ?? 'Failed to load customers';
      });
  },
});

export const {invalidateVehicles, invalidateRentals, invalidateCustomers} =
  dataCacheSlice.actions;

export default dataCacheSlice.reducer;
