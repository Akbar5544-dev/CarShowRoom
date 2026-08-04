import {useEffect, useMemo, useState} from 'react';
import {
  vehicleManagementMaintenanceService,
  vehicleManagementVehiclesService,
} from '../../../services';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchRentals} from '../../../store/dataCacheSlice';
import {
  asRecord,
  formatApiDate,
  formatMileageLabel,
  formatMoney,
  fuelTypeLabel,
  pickNumber,
  pickString,
  pickVehicleImageUri,
  transmissionLabel,
  unwrapData,
  unwrapList,
} from '../../../utils';
import type {
  ActivityItem,
  DocumentItem,
  MaintenanceRow,
  RentalRow,
  SpecItem,
} from './module';

type VehicleDetailApiState = {
  description: string;
  specs: SpecItem[];
  rentalRows: RentalRow[];
  maintenanceRows: MaintenanceRow[];
  documents: DocumentItem[];
  activities: ActivityItem[];
  totalRentals: string;
  totalRevenue: string;
  servicesDone: string;
  insuranceExpiry: string;
  imageUri: string | null;
};

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Returned by Ayesha Khan · $2,480',
    time: '2h ago',
    icon: 'activityCheck',
    tone: 'green',
    actionTab: 'rental-history',
  },
  {
    id: '2',
    title: 'Scheduled service completed at BMW Garage',
    time: '5d ago',
    icon: 'activityWrench',
    tone: 'amber',
    actionTab: 'maintenance',
  },
];

function mapMaintenanceRow(item: unknown, index: number): MaintenanceRow {
  const row = asRecord(item);
  return {
    id: String(row.id ?? index),
    date: formatApiDate(pickString(row, ['service_date', 'date', 'created_at'])),
    type: pickString(row, ['service_type', 'type', 'title'], 'Service'),
    garage: pickString(row, ['garage', 'provider', 'workshop'], '—'),
    odometer: formatMileageLabel(
      pickNumber(row, ['odometer', 'mileage', 'odometer_reading']),
    ),
    cost: formatMoney(pickNumber(row, ['cost', 'amount'])),
  };
}

function mapRentalRow(item: unknown, index: number): RentalRow {
  const row = asRecord(item);
  const customer = asRecord(row.customer);
  const start = pickString(row, ['start_date', 'pickup_date']);
  const end = pickString(row, [
    'expected_return_date',
    'return_date',
    'actual_return_date',
  ]);
  const startMs = start ? new Date(start).getTime() : NaN;
  const endMs = end ? new Date(end).getTime() : NaN;
  const days =
    Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs
      ? String(Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24))))
      : '—';

  return {
    id: String(row.id ?? index),
    customer: pickString(
      customer,
      ['name', 'full_name', 'customer_name'],
      pickString(row, ['customer_name'], 'Customer'),
    ),
    start: formatApiDate(start),
    end: formatApiDate(end),
    days,
  };
}

function mapDocument(item: unknown, index: number): DocumentItem {
  const row = asRecord(item);
  return {
    id: String(row.id ?? index),
    title: pickString(row, ['title', 'name', 'type'], 'Document'),
    meta: pickString(row, ['mime_type', 'file_name', 'description'], 'Uploaded document'),
  };
}

function matchesVehicleId(item: unknown, vehicleId: string): boolean {
  const row = asRecord(item);
  const nested = asRecord(row.vehicle);
  const id = String(row.vehicle_id ?? nested.id ?? '');
  return id === String(vehicleId);
}

export function useVehicleDetailApi(
  vehicleId: string,
  fallback: {
    make: string;
    model: string;
    year: string;
    plateNo: string;
    fuelType: string;
    transmission: string;
    seats: string;
    mileageLabel: string;
    imageUri: string | null;
  },
): VehicleDetailApiState {
  const dispatch = useAppDispatch();
  const rentalsCache = useAppSelector(state => state.dataCache.rentals);
  const vehiclesCache = useAppSelector(state => state.dataCache.vehicles);

  const cachedVehicleRaw = useMemo(() => {
    return vehiclesCache.raw.find(item => {
      const row = asRecord(item);
      return String(row.id) === String(vehicleId);
    });
  }, [vehicleId, vehiclesCache.raw]);

  const cachedVehicleRentals = useMemo(() => {
    return rentalsCache.raw.filter(item => matchesVehicleId(item, vehicleId));
  }, [rentalsCache.raw, vehicleId]);

  const [state, setState] = useState<VehicleDetailApiState>({
    description:
      'A refined, luxury electric executive sedan combining 601 hp of instant torque with silent Bavarian craftsmanship.',
    specs: [
      {label: 'Brand', value: fallback.make || 'BMW'},
      {label: 'Model', value: fallback.model || 'i5 M60'},
      {label: 'Variant', value: 'xDrive Sedan'},
      {label: 'Registration', value: fallback.plateNo || 'LEA-2251'},
      {label: 'Engine', value: 'Dual Motor 601 hp'},
      {label: 'Fuel', value: fallback.fuelType || 'Electric'},
      {label: 'Transmission', value: fallback.transmission || 'Automatic'},
      {label: 'Drive', value: 'AWD'},
      {label: 'Mileage', value: fallback.mileageLabel || '12,400 km'},
      {label: 'Color', value: 'Alpine White'},
      {label: 'Seats', value: fallback.seats},
      {label: 'Doors', value: '4'},
    ],
    rentalRows: [],
    maintenanceRows: [],
    documents: [],
    activities: DEFAULT_ACTIVITIES,
    totalRentals: '0',
    totalRevenue: '$0',
    servicesDone: '0',
    insuranceExpiry: '—',
    imageUri: fallback.imageUri,
  });

  useEffect(() => {
    if (!vehicleId) {
      return;
    }
    // Prefer shared rentals list — no duplicate listRentals call
    if (rentalsCache.meta.fetchedAt == null) {
      dispatch(fetchRentals({silent: true}));
    }
  }, [dispatch, rentalsCache.meta.fetchedAt, vehicleId]);

  useEffect(() => {
    if (!vehicleId) {
      return;
    }
    let mounted = true;

    (async () => {
      try {
        const [vehicleRes, maintenanceRes] = await Promise.all([
          vehicleManagementVehiclesService.getVehiclesById(vehicleId),
          vehicleManagementMaintenanceService
            .getVehiclesByIdMaintenance(vehicleId)
            .catch(() => ({data: []})),
        ]);

        if (!mounted) {
          return;
        }

        const vehicle = asRecord(unwrapData(vehicleRes));
        const rentalsSource =
          cachedVehicleRentals.length > 0
            ? cachedVehicleRentals
            : [];
        const rentals = rentalsSource.map(mapRentalRow);
        const maintenance = unwrapList(maintenanceRes).map(mapMaintenanceRow);
        const docs = (
          Array.isArray(vehicle.documents) ? vehicle.documents : []
        ).map(mapDocument);

        const mileage = pickNumber(vehicle, [
          'mileage',
          'odometer',
          'odometer_reading',
        ]);
        const totalRevenue = rentalsSource.reduce((sum: number, item) => {
          const rentalRow = asRecord(item);
          return (
            sum + pickNumber(rentalRow, ['total_amount', 'amount', 'daily_rate'])
          );
        }, 0);

        const rentalActivities: ActivityItem[] = (() => {
          if (!rentalsSource.length) {
            return [];
          }
          const latest = asRecord(rentalsSource[0]);
          const customer = asRecord(latest.customer);
          const latestName = pickString(
            customer,
            ['name', 'full_name'],
            pickString(latest, ['customer_name'], 'Customer'),
          );
          const count = rentalsSource.length;
          return [
            {
              id: `rental-summary-${vehicleId}`,
              title:
                count === 1
                  ? `Rental by ${latestName} · ${formatMoney(pickNumber(latest, ['total_amount', 'daily_rate']))}`
                  : `${count} rentals · Latest by ${latestName}`,
              time: formatApiDate(
                pickString(latest, ['start_date', 'created_at']),
              ),
              icon: 'activityDollar' as const,
              tone: 'blue' as const,
              actionTab: 'rental-history' as const,
            },
          ];
        })();

        const maintenanceActivity: ActivityItem[] =
          maintenance.length > 0
            ? [
                {
                  id: `maintenance-summary-${vehicleId}`,
                  title: `${maintenance.length} maintenance record${
                    maintenance.length === 1 ? '' : 's'
                  } · Latest: ${maintenance[0].type}`,
                  time: maintenance[0].date,
                  icon: 'activityWrench' as const,
                  tone: 'amber' as const,
                  actionTab: 'maintenance' as const,
                },
              ]
            : [];

        setState({
          description: pickString(
            vehicle,
            ['description'],
            'A refined, luxury electric executive sedan combining 601 hp of instant torque with silent Bavarian craftsmanship.',
          ),
          specs: [
            {label: 'Brand', value: pickString(vehicle, ['make'], fallback.make)},
            {label: 'Model', value: pickString(vehicle, ['model'], fallback.model)},
            {
              label: 'Variant',
              value: pickString(vehicle, ['variant', 'trim'], 'xDrive Sedan'),
            },
            {
              label: 'Registration',
              value: pickString(
                vehicle,
                ['registration_no', 'plate_no'],
                fallback.plateNo,
              ),
            },
            {label: 'Engine', value: pickString(vehicle, ['engine_type'], '—')},
            {
              label: 'Fuel',
              value: fuelTypeLabel(
                pickString(vehicle, ['fuel_type', 'fuel'], fallback.fuelType),
              ),
            },
            {
              label: 'Transmission',
              value: transmissionLabel(
                pickString(vehicle, ['transmission'], fallback.transmission),
              ),
            },
            {label: 'Drive', value: pickString(vehicle, ['drive_type'], 'AWD')},
            {
              label: 'Mileage',
              value:
                mileage > 0
                  ? formatMileageLabel(mileage)
                  : fallback.mileageLabel,
            },
            {
              label: 'Color',
              value: pickString(vehicle, ['color'], 'Alpine White'),
            },
            {
              label: 'Seats',
              value: String(
                pickNumber(vehicle, ['seating_capacity', 'seats']) ||
                  fallback.seats ||
                  '5',
              ),
            },
            {
              label: 'Doors',
              value: String(pickNumber(vehicle, ['doors'], 4) || 4),
            },
          ],
          rentalRows: rentals,
          maintenanceRows: maintenance,
          documents: docs,
          activities:
            rentalActivities.length || maintenanceActivity.length
              ? [...rentalActivities, ...maintenanceActivity]
              : DEFAULT_ACTIVITIES,
          totalRentals: String(rentals.length),
          totalRevenue: formatMoney(totalRevenue),
          servicesDone: String(maintenance.length),
          insuranceExpiry: formatApiDate(
            pickString(vehicle, ['insurance_expiry', 'registration_expiry']),
          ),
          imageUri: pickVehicleImageUri(vehicle) ?? fallback.imageUri,
        });
      } catch {
        // Prefer inventory cache if detail fetch fails
        if (cachedVehicleRaw && mounted) {
          const vehicle = asRecord(cachedVehicleRaw);
          setState(prev => ({
            ...prev,
            imageUri: pickVehicleImageUri(vehicle) ?? prev.imageUri,
            description: pickString(vehicle, ['description'], prev.description),
          }));
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [
    cachedVehicleRaw,
    cachedVehicleRentals,
    fallback.fuelType,
    fallback.imageUri,
    fallback.make,
    fallback.mileageLabel,
    fallback.model,
    fallback.plateNo,
    fallback.seats,
    fallback.transmission,
    vehicleId,
  ]);

  return state;
}
