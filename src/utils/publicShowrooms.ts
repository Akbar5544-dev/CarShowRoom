import type {AvatarTone} from '../screens/customer/shared/tokens';
import type {Showroom} from '../screens/customer/CustomerShowrooms/module';
import {
  AnyRecord,
  asRecord,
  initialsFromName,
  pickNumber,
  pickString,
  unwrapData,
  unwrapList,
} from './apiHelpers';
import {
  formatFollowers,
  resolvePublicMediaUrl,
} from './publicMedia';

const TONES: AvatarTone[] = ['sc', 'aw', 'am', 'cc', 'mech', 'm2', 'm3', 'm4'];

function toneForId(id: string): AvatarTone {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % TONES.length;
  }
  return TONES[hash];
}

function formatHours(raw: unknown): string {
  if (!raw) {
    return 'Hours not listed';
  }
  if (typeof raw === 'string') {
    return raw;
  }
  const record = asRecord(raw);
  const today = pickString(record, ['today', 'weekdays', 'mon_fri'], '');
  if (today) {
    return today;
  }
  return 'Hours not listed';
}

export type PublicShowroom = Showroom & {
  slug: string;
  showroomId: string;
  logoUri: string | null;
  coverUri: string | null;
  distanceKm: number | null;
};

export function mapPublicShowroom(item: unknown): PublicShowroom {
  const row = asRecord(item);
  const nested = asRecord(row.showroom);
  const id =
    pickString(row, ['slug', 'id'], '') ||
    String(pickNumber(row, ['id']) || '');
  const name =
    pickString(row, ['display_name', 'name'], '') ||
    pickString(nested, ['name'], 'Showroom');
  const city =
    pickString(row, ['city'], '') || pickString(nested, ['city'], '');
  const followers = pickNumber(row, ['followers_count', 'followers']);
  const rating = pickNumber(row, ['rating_avg', 'rating', 'avg_rating']);
  const vehicles = pickNumber(nested, [
    'published_vehicles_count',
    'vehicles_count',
  ]);
  const distance = pickNumber(row, ['distance_km', 'distance']);
  const verified = Boolean(row.is_verified ?? nested.is_verified);
  const following = Boolean(row.is_following ?? row.following);
  const phone =
    pickString(row, ['public_phone', 'phone'], '') ||
    pickString(nested, ['phone'], '');

  return {
    id,
    slug: pickString(row, ['slug'], id),
    showroomId: String(
      pickNumber(row, ['showroom_id', 'id']) ||
        pickNumber(nested, ['id']) ||
        id,
    ),
    initials: initialsFromName(name),
    tone: toneForId(id),
    name,
    verified,
    subtitle: city ? `Car Dealership · ${city}` : 'Car Dealership',
    following,
    description:
      pickString(row, ['about', 'description'], '') ||
      'Showroom listing on CarShowRoom.',
    followersLabel: formatFollowers(followers),
    rating: rating > 0 ? Math.round(rating * 10) / 10 : 0,
    vehicles,
    nearby: distance > 0 && distance <= 50,
    topRated: rating >= 4.5,
    phone,
    hours: formatHours(row.opening_hours),
    instagram: pickString(row, ['instagram'], ''),
    logoUri: resolvePublicMediaUrl(
      pickString(row, ['logo'], '') || pickString(nested, ['logo'], ''),
    ),
    coverUri: resolvePublicMediaUrl(
      pickString(row, ['cover_image', 'cover'], ''),
    ),
    distanceKm: distance > 0 ? distance : null,
  };
}

export function mapPublicShowroomList(payload: unknown): PublicShowroom[] {
  return unwrapList(payload).map(mapPublicShowroom);
}

export function mapPublicShowroomDetail(payload: unknown): PublicShowroom {
  return mapPublicShowroom(unwrapData(payload));
}
