import type {
  VehicleInventoryItem,
  VehicleInventoryStatus,
} from '../components/VehicleInventoryCard';
import type {EditVehicleForm, EditVehicleRouteParams} from '../screens/showroom/EditVehicle/module';
import {colors as defaultColors} from '../theme';
import {
  asRecord,
  formatMoney,
  fuelTypeLabel,
  mapFuelType,
  mapTransmission,
  mapVehicleStatus,
  parseMoneyInput,
  pickNumber,
  pickString,
  transmissionLabel,
  type AnyRecord,
} from './apiHelpers';

const IMAGE_TINTS = [
  '#DBEAFE',
  '#E0F2FE',
  '#EDE9FE',
  '#D1FAE5',
  '#FFEDD5',
  '#FFE4E6',
];

function inventoryStatusMeta(raw: string): {
  label: VehicleInventoryStatus;
  bg: string;
  color: string;
} {
  const key = raw.trim().toLowerCase();
  if (key.includes('maint') || key.includes('service') || key.includes('repair')) {
    return {
      label: 'Maintenance',
      bg: defaultColors.badgeOverdueBg,
      color: defaultColors.error,
    };
  }
  if (key.includes('rent') || key.includes('reserv') || key.includes('book')) {
    return {
      label: 'Rented',
      bg: 'rgba(59,130,246,0.14)',
      color: defaultColors.actionBlue,
    };
  }
  return {
    label: 'Available',
    bg: defaultColors.badgeActiveBg,
    color: defaultColors.successBright,
  };
}

function formatMileageShort(km: number): string {
  if (km > 0) {
    return `${Math.round(km).toLocaleString('en-US')}k`;
  }
  return '—';
}

function formatRangeLabel(row: AnyRecord): string {
  const battery = pickNumber(row, [
    'battery_capacity',
    'battery_kwh',
    'battery_capacity_kwh',
  ]);
  if (battery > 0) {
    return `${battery} kWh`;
  }
  const mileage = pickNumber(row, ['mileage', 'odometer', 'odometer_reading']);
  if (mileage > 0) {
    return formatMileageShort(mileage);
  }
  return '—';
}

/** Map API vehicle → inventory card used across Vehicles + Rentals screens */
export function mapInventoryVehicle(
  item: unknown,
  index: number,
): VehicleInventoryItem {
  const row = asRecord(item);
  const make = pickString(row, ['make'], 'Vehicle');
  const model = pickString(row, ['model'], 'Model');
  const year = pickString(row, ['year']);
  const status = inventoryStatusMeta(pickString(row, ['status'], 'available'));
  const seats = pickNumber(row, ['seating_capacity', 'seats', 'seat_capacity']);
  const fuel =
    pickString(row, ['fuel_type', 'fuel', 'engine_type'], 'Petrol') || 'Petrol';
  const transmission =
    transmissionLabel(
      pickString(row, ['transmission', 'transmission_type'], 'automatic'),
    ) || 'Auto';
  const dailyRate = pickNumber(row, ['rental_daily_rate', 'daily_rate']);
  const askingPrice = pickNumber(row, [
    'asking_price',
    'purchase_price',
    'sale_price',
    'price',
  ]);

  return {
    id: String(row.id ?? index),
    make,
    model,
    year,
    plateNo: pickString(
      row,
      ['registration_no', 'plate_no', 'license_plate', 'vin'],
      '—',
    ),
    status: status.label,
    statusBg: status.bg,
    statusColor: status.color,
    imageUri: pickVehicleImageUri(row),
    imageTint: IMAGE_TINTS[index % IMAGE_TINTS.length],
    fuelType: fuelTypeLabel(fuel),
    transmission,
    seats: seats > 0 ? String(seats) : '—',
    rangeLabel: formatRangeLabel(row),
    dailyRate: formatMoney(dailyRate),
    askingPrice: askingPrice > 0 ? String(askingPrice) : undefined,
    isPublished: Boolean(
      row.is_published ?? row.published ?? row.isPublished,
    ),
  };
}

export function isVehicleAvailable(item: VehicleInventoryItem): boolean {
  return item.status === 'Available';
}

export function pickVehicleImageUri(row: AnyRecord): string | null {
  const direct = pickString(row, [
    'image_url',
    'thumbnail_url',
    'primary_image_url',
    'photo_url',
  ]);
  if (direct) {
    return direct;
  }

  const images = row.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = asRecord(images[0]);
    return (
      pickString(first, ['url', 'image_url', 'path']) ||
      (typeof images[0] === 'string' ? images[0] : null)
    );
  }

  return null;
}

export function mapApiVehicleToEditForm(
  row: AnyRecord,
  fallback: EditVehicleRouteParams,
): EditVehicleForm {
  const daily = pickNumber(row, ['rental_daily_rate', 'daily_rate']);
  const mileage = pickNumber(row, ['mileage', 'odometer', 'odometer_reading']);

  return {
    brand: pickString(row, ['make'], fallback.make || ''),
    model: pickString(row, ['model'], fallback.model || ''),
    variant: pickString(row, ['variant', 'trim'], ''),
    year: pickString(row, ['year'], fallback.year || ''),
    registration: pickString(
      row,
      ['registration_no', 'plate_no', 'license_plate'],
      fallback.plateNo || '',
    ),
    vin: pickString(row, ['vin', 'chassis_no'], ''),
    fuelType: fuelTypeLabel(
      pickString(row, ['fuel_type', 'fuel', 'engine_type'], fallback.fuelType),
    ),
    transmission: transmissionLabel(
      pickString(row, ['transmission', 'transmission_type'], fallback.transmission),
    ),
    seats: (() => {
      const seats =
        pickNumber(row, ['seating_capacity', 'seats', 'seat_capacity']) ||
        Number(fallback.seats) ||
        0;
      return seats > 0 ? String(seats) : '';
    })(),
    color: pickString(row, ['color'], ''),
    mileage: mileage > 0 ? String(Math.round(mileage)) : '',
    category: pickString(row, ['category_name', 'category'], ''),
    description: pickString(row, ['description'], ''),
    dailyRate:
      daily > 0 ? String(daily) : stripMoney(fallback.dailyRate) || '',
    weeklyRate: (() => {
      const weekly = pickNumber(row, ['weekly_rate']);
      if (weekly > 0) {
        return String(weekly);
      }
      return daily > 0 ? String(daily * 6) : '';
    })(),
    monthlyRate: (() => {
      const monthly = pickNumber(row, ['monthly_rate']);
      if (monthly > 0) {
        return String(monthly);
      }
      return daily > 0 ? String(daily * 20) : '';
    })(),
    securityDeposit: (() => {
      const deposit = pickNumber(row, ['security_deposit']);
      return deposit > 0 ? String(deposit) : '';
    })(),
    overagePerKm: (() => {
      const overage = pickNumber(row, ['extra_km_charge', 'overage_per_km']);
      return overage > 0 ? String(overage) : '';
    })(),
    freeKmPerDay: (() => {
      const freeKm = pickNumber(row, ['free_km_per_day', 'included_km']);
      return freeKm > 0 ? String(freeKm) : '';
    })(),
    insuranceProvider: pickString(row, ['insurance_provider'], ''),
    policyNumber: pickString(row, ['policy_number'], ''),
    validFrom: pickString(row, ['insurance_start', 'valid_from'], ''),
    validUntil: pickString(row, ['insurance_expiry', 'valid_until'], ''),
    registrationExpiry: pickString(row, ['registration_expiry'], ''),
    fitnessCertificate: pickString(row, ['fitness_certificate_expiry'], ''),
  };
}

function stripMoney(value: string) {
  return value.replace(/[^0-9.]/g, '');
}

function appendField(
  formData: FormData,
  key: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  formData.append(key, String(value));
}

export function buildVehicleUpdateFormData(
  form: EditVehicleForm,
  availableForRent: boolean,
): FormData {
  const formData = new FormData();
  appendField(formData, 'make', form.brand);
  appendField(formData, 'model', form.model);
  appendField(formData, 'variant', form.variant);
  appendField(formData, 'year', form.year);
  appendField(formData, 'registration_no', form.registration);
  appendField(formData, 'vin', form.vin);
  appendField(formData, 'fuel_type', mapFuelType(form.fuelType));
  appendField(formData, 'transmission', mapTransmission(form.transmission));
  appendField(formData, 'seating_capacity', form.seats);
  appendField(formData, 'color', form.color);
  appendField(formData, 'mileage', form.mileage);
  appendField(formData, 'category_name', form.category);
  appendField(formData, 'description', form.description);
  appendField(formData, 'rental_daily_rate', parseMoneyInput(form.dailyRate));
  appendField(formData, 'weekly_rate', parseMoneyInput(form.weeklyRate));
  appendField(formData, 'monthly_rate', parseMoneyInput(form.monthlyRate));
  appendField(formData, 'security_deposit', parseMoneyInput(form.securityDeposit));
  appendField(formData, 'extra_km_charge', parseMoneyInput(form.overagePerKm));
  appendField(formData, 'free_km_per_day', parseMoneyInput(form.freeKmPerDay));
  appendField(formData, 'insurance_provider', form.insuranceProvider);
  appendField(formData, 'policy_number', form.policyNumber);
  appendField(formData, 'insurance_start', form.validFrom);
  appendField(formData, 'insurance_expiry', form.validUntil);
  appendField(formData, 'registration_expiry', form.registrationExpiry);
  appendField(formData, 'fitness_certificate_expiry', form.fitnessCertificate);
  appendField(
    formData,
    'status',
    mapVehicleStatus(availableForRent ? 'Available' : 'Inactive'),
  );
  appendField(formData, 'usage_type', 'both');
  return formData;
}

export function mapRentalCustomer(row: AnyRecord, index: number) {
  const license = pickString(row, ['license_no', 'license_number']);
  const trips = pickNumber(row, ['trips_count', 'rental_count']);
  return {
    id: String(row.id ?? index),
    code: pickString(row, ['customer_code', 'code'], `C-${row.id ?? index}`),
    name: pickString(row, ['name', 'full_name'], 'Customer'),
    phone: pickString(row, ['phone', 'mobile'], ''),
    email: pickString(row, ['email', 'email_address'], ''),
    address: pickString(row, ['address', 'street_address', 'city'], ''),
    licenseNo: license || '—',
    licenseInfo: [license, trips > 0 ? `${trips} trips` : null]
      .filter(Boolean)
      .join(' · '),
    tier: 'Gold' as const,
  };
}

export function parseRentalDateTime(value: string): string | undefined {
  const datePart = value.split(',')[0]?.trim() ?? value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }
  const us = datePart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const [, m, d, y] = us;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const parsed = new Date(datePart);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return undefined;
}

export function rentalDurationDays(start: string, end: string): number {
  const startDate = parseRentalDateTime(start);
  const endDate = parseRentalDateTime(end);
  if (!startDate || !endDate) {
    return 1;
  }
  const ms =
    new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
}

export function formatApiDate(value: string): string {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMileageLabel(km: number): string {
  if (km > 0) {
    return `${Math.round(km).toLocaleString('en-US')} km`;
  }
  return '—';
}

export function vehicleDailyRateLabel(row: AnyRecord, fallback = ''): string {
  const daily = pickNumber(row, ['rental_daily_rate', 'daily_rate']);
  return daily > 0 ? formatMoney(daily) : fallback;
}
