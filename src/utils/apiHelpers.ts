import {colors} from '../theme';
/** Shared helpers for mapping flexible Laravel API payloads into UI models. */

export type AnyRecord = Record<string, any>;

export function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' ? (value as AnyRecord) : {};
}

/** Unwrap `{ message, data }` or return raw payload. */
export function unwrapData<T = any>(payload: unknown): T {
  const root = asRecord(payload);
  if ('data' in root) {
    return root.data as T;
  }
  return payload as T;
}

/**
 * Normalize paginated / array list responses into a plain array.
 * Supports:
 * - { data: [...] }
 * - { data: { data: [...] } }
 * - { data: { roles: [...] } }
 * - [...]
 */
export function unwrapList<T = AnyRecord>(payload: unknown): T[] {
  const data = unwrapData(payload);
  if (Array.isArray(data)) {
    return data as T[];
  }
  const record = asRecord(data);
  if (Array.isArray(record.data)) {
    return record.data as T[];
  }
  const nested = asRecord(record.data);
  if (Array.isArray(nested.data)) {
    return nested.data as T[];
  }
  for (const key of [
    'roles',
    'permissions',
    'items',
    'results',
    'staff',
    'employees',
    'users',
    'rentals',
    'vehicles',
    'customers',
  ]) {
    const value = record[key] ?? nested[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }
  if (Array.isArray(record.items)) {
    return record.items as T[];
  }
  return [];
}

/** Count permission entries from catalog or flat list payloads */
export function countPermissionEntries(payload: unknown): number {
  const list = unwrapList(payload);
  if (list.length) {
    return list.length;
  }
  const root = asRecord(unwrapData(payload));
  if (Array.isArray(root.permissions)) {
    return root.permissions.length;
  }
  let total = 0;
  Object.values(root).forEach(value => {
    if (Array.isArray(value)) {
      total += value.length;
    }
  });
  return total;
}

/** Users assigned to a role row from flexible API shapes */
export function extractAssignedUsers(row: AnyRecord): unknown[] {
  for (const key of ['users', 'assigned_users', 'staff', 'members']) {
    if (Array.isArray(row[key])) {
      return row[key];
    }
  }
  return [];
}

export function unwrapMeta(payload: unknown): {
  total: number;
  currentPage: number;
  perPage: number;
} {
  const data = asRecord(unwrapData(payload));
  return {
    total: Number(data.total ?? unwrapList(payload).length) || 0,
    currentPage: Number(data.current_page ?? 1) || 1,
    perPage: Number(data.per_page ?? 10) || 10,
  };
}

export function pickString(
  source: AnyRecord,
  keys: string[],
  fallback = '',
): string {
  for (const key of keys) {
    const value = source[key];
    if (value != null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return fallback;
}

export function pickNumber(source: AnyRecord, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = source[key];
    if (value == null || value === '') {
      continue;
    }
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return num;
    }
  }
  return fallback;
}

export function formatMoney(
  value: number | string | null | undefined,
  currency = '$',
): string {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) {
    return `${currency}0`;
  }
  if (Math.abs(num) >= 1000) {
    const compact = num / 1000;
    const digits = Math.abs(compact) >= 10 ? 0 : 1;
    return `${currency}${compact.toFixed(digits)}K`;
  }
  return `${currency}${num.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}

export function formatCount(value: number | string | null | undefined): string {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num.toLocaleString() : '0';
}

export function initialsFromName(name: string, fallback = 'NA'): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return fallback;
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function titleCase(value: string): string {
  if (!value) {
    return '';
  }
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function todayLabel(date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function toIsoDate(input: string): string | undefined {
  const value = input.trim();
  if (!value) {
    return undefined;
  }
  // already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  // mm/dd/yyyy
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const [, m, d, y] = us;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return undefined;
}

export function parseMoneyInput(value: string): number | undefined {
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (!cleaned) {
    return undefined;
  }
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : undefined;
}

export function avatarColorFromId(id: string | number): string {
  const palette = [
    colors.actionBlue,
    '#8B5CF6',
    '#20B46B',
    '#F59E0B',
    '#EF4444',
    '#0EA5E9',
  ];
  const raw = String(id);
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash + raw.charCodeAt(i) * (i + 1)) % palette.length;
  }
  return palette[hash];
}

export function mapEmploymentType(uiValue: string): string | undefined {
  const key = uiValue.trim().toLowerCase();
  const map: Record<string, string> = {
    'full-time': 'permanent',
    fulltime: 'permanent',
    permanent: 'permanent',
    'part-time': 'part-time',
    parttime: 'part-time',
    contract: 'contract',
    intern: 'daily-wage',
    'daily-wage': 'daily-wage',
  };
  return map[key] ?? (key || undefined);
}

export function mapGender(uiValue: string): string | undefined {
  const key = uiValue.trim().toLowerCase();
  if (key === 'male' || key === 'female') {
    return key;
  }
  if (key === 'other' || key === 'others') {
    return 'other';
  }
  return undefined;
}

export function mapStaffStatus(uiValue: string): string | undefined {
  const key = uiValue.trim().toLowerCase();
  if (key.includes('active') || key.includes('probation')) {
    return 'active';
  }
  if (key.includes('leave') || key.includes('inactive')) {
    return 'inactive';
  }
  if (key.includes('terminat')) {
    return 'terminated';
  }
  return undefined;
}

/** API accepts lowercase: petrol, diesel, electric, hybrid */
export function mapFuelType(uiValue: string): string | undefined {
  const key = uiValue.trim().toLowerCase();
  const map: Record<string, string> = {
    petrol: 'petrol',
    diesel: 'diesel',
    hybrid: 'hybrid',
    electric: 'electric',
  };
  if (map[key]) {
    return map[key];
  }
  if (key.includes('diesel')) {
    return 'diesel';
  }
  if (key.includes('hybrid')) {
    return 'hybrid';
  }
  if (key.includes('elect')) {
    return 'electric';
  }
  if (key.includes('petrol') || key.includes('gas')) {
    return 'petrol';
  }
  return key || undefined;
}

/** API uses automatic/manual/cvt (not Auto) */
export function mapTransmission(uiValue: string): string | undefined {
  const key = uiValue.trim().toLowerCase();
  const map: Record<string, string> = {
    auto: 'automatic',
    automatic: 'automatic',
    manual: 'manual',
    cvt: 'cvt',
  };
  return map[key] ?? (key || undefined);
}

export function mapVehicleStatus(uiValue: string): string | undefined {
  const key = uiValue.trim().toLowerCase();
  if (key.includes('maint') || key.includes('service')) {
    return 'maintenance';
  }
  if (key.includes('reserv') || key.includes('rent') || key.includes('book')) {
    return 'reserved';
  }
  if (key.includes('sold') || key.includes('inactive')) {
    return 'inactive';
  }
  return 'available';
}

export function fuelTypeLabel(apiValue: string): string {
  const key = apiValue.trim().toLowerCase();
  const map: Record<string, string> = {
    petrol: 'Petrol',
    diesel: 'Diesel',
    hybrid: 'Hybrid',
    electric: 'Electric',
  };
  return map[key] ?? apiValue;
}

export function transmissionLabel(apiValue: string): string {
  const key = apiValue.trim().toLowerCase();
  const map: Record<string, string> = {
    automatic: 'Auto',
    manual: 'Manual',
    cvt: 'CVT',
  };
  return map[key] ?? apiValue;
}
