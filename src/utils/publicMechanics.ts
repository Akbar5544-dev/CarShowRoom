import type {AvatarTone} from '../screens/customer/shared/tokens';
import {
  AnyRecord,
  asRecord,
  initialsFromName,
  pickNumber,
  pickString,
  unwrapList,
} from './apiHelpers';
import {resolvePublicMediaUrl} from './publicMedia';

export type PublicMechanic = {
  id: string;
  initials: string;
  tone: AvatarTone;
  name: string;
  specialty: string;
  verified: boolean;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  nearby?: boolean;
  imageUri: string | null;
};

const TONES: AvatarTone[] = ['mech', 'm2', 'm3', 'm4', 'aw', 'cc'];

function toneForId(id: string): AvatarTone {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % TONES.length;
  }
  return TONES[hash];
}

export function mapPublicMechanic(item: unknown): PublicMechanic {
  const row = asRecord(item);
  const id =
    pickString(row, ['slug', 'id'], '') ||
    String(pickNumber(row, ['id']) || '');
  const name =
    pickString(row, ['name', 'display_name', 'shop_name'], '') || 'Mechanic';
  const city = pickString(row, ['city', 'location', 'area'], '');
  const distance = pickNumber(row, ['distance_km', 'distance']);

  return {
    id,
    initials: initialsFromName(name),
    tone: toneForId(id),
    name,
    specialty: pickString(
      row,
      ['specialty', 'speciality', 'specialization', 'skills'],
      'General Repair',
    ),
    verified: Boolean(row.is_verified ?? row.verified),
    rating: pickNumber(row, ['rating_avg', 'rating', 'avg_rating']) || 0,
    reviews: pickNumber(row, ['ratings_count', 'reviews_count', 'reviews']),
    location: city || 'Pakistan',
    phone: pickString(row, ['phone', 'public_phone', 'whatsapp'], ''),
    nearby: distance > 0 && distance <= 30,
    imageUri: resolvePublicMediaUrl(
      pickString(row, ['photo', 'avatar', 'image', 'logo'], ''),
    ),
  };
}

export function mapPublicMechanicList(payload: unknown): PublicMechanic[] {
  return unwrapList(payload).map(mapPublicMechanic);
}

export function mapPublicMechanicFilters(payload: unknown): {
  cities: string[];
  specialties: string[];
} {
  const root = asRecord(
    'data' in asRecord(payload) ? asRecord(payload).data : payload,
  );
  const cities = Array.isArray(root.cities)
    ? root.cities.map(String).filter(Boolean)
    : [];
  const specialties = Array.isArray(root.specialties)
    ? root.specialties.map(String).filter(Boolean)
    : Array.isArray(root.specialities)
      ? root.specialities.map(String).filter(Boolean)
      : [];
  return {cities, specialties};
}
