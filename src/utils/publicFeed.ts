import type {FeedPost, ListingType} from '../screens/customer/CustomerHome/module';
import {
  AnyRecord,
  asRecord,
  initialsFromName,
  pickNumber,
  pickString,
  unwrapData,
} from './apiHelpers';
import {
  formatRelativeTime,
  resolvePublicMediaUrl,
} from './publicMedia';

function listingTypeFromRow(row: AnyRecord): ListingType {
  const usage = pickString(
    row,
    ['usage', 'listing_type', 'type', 'availability'],
    '',
  ).toLowerCase();
  if (usage.includes('rent')) {
    return 'For Rent';
  }
  return 'For Sale';
}

function priceLakhFromRow(row: AnyRecord): number | null {
  const lakh = pickNumber(row, ['price_lakh', 'price_in_lakh']);
  if (lakh > 0) {
    return lakh;
  }
  const price = pickNumber(row, [
    'sale_price',
    'price',
    'asking_price',
    'current_bid',
  ]);
  if (price >= 100000) {
    return Math.round((price / 100000) * 10) / 10;
  }
  if (price > 0 && price < 1000) {
    return price;
  }
  return null;
}

function imageFromRow(row: AnyRecord): string | null {
  const media = row.media ?? row.images ?? row.photos;
  if (Array.isArray(media) && media.length) {
    const first = asRecord(media[0]);
    return resolvePublicMediaUrl(
      pickString(first, ['url', 'path', 'image', 'src'], '') ||
        (typeof media[0] === 'string' ? media[0] : ''),
    );
  }
  return resolvePublicMediaUrl(
    pickString(row, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo'], ''),
  );
}

/** Map /public/feed or /public/vehicles item → FeedPost */
export function mapPublicFeedPost(item: unknown): FeedPost {
  const row = asRecord(item);
  const showroom = asRecord(row.showroom ?? row.seller ?? row.owner);
  const name =
    pickString(showroom, ['display_name', 'name'], '') ||
    pickString(row, ['seller_name', 'showroom_name'], 'Showroom');
  const id =
    pickString(row, ['id', 'uuid', 'slug'], '') ||
    String(pickNumber(row, ['id']) || '');

  const year = pickString(row, ['year', 'model_year'], '');
  const mileage = pickString(row, ['mileage', 'odometer', 'km'], '');
  const fuel = pickString(row, ['fuel_type', 'fuel'], '');
  const transmission = pickString(row, ['transmission'], '');
  const make = pickString(row, ['make', 'brand'], '');
  const model = pickString(row, ['model', 'title', 'name'], 'Vehicle');
  const title =
    pickString(row, ['title', 'name'], '') ||
    [make, model].filter(Boolean).join(' ') ||
    'Vehicle';

  const specs = [year, mileage ? `${mileage} km` : '', transmission, fuel]
    .filter(Boolean)
    .join(' · ');
  const priceLabel =
    pickString(row, ['price_label', 'formatted_price'], '') ||
    (priceLakhFromRow(row) != null
      ? `PKR ${priceLakhFromRow(row)} Lakh`
      : pickNumber(row, ['daily_rate', 'rent_per_day']) > 0
        ? `PKR ${pickNumber(row, ['daily_rate', 'rent_per_day']).toLocaleString()}/day`
        : '');

  const description =
    pickString(row, ['description', 'short_description'], '') ||
    [specs, priceLabel].filter(Boolean).join('. ');

  const likes = pickNumber(row, ['likes_count', 'likes', 'like_count']);
  const views = pickNumber(row, ['views_count', 'views', 'view_count']);

  return {
    id,
    sellerInitials: initialsFromName(name),
    sellerName: name,
    verified: Boolean(
      row.is_verified ?? showroom.is_verified ?? row.verified,
    ),
    listingType: listingTypeFromRow(row),
    postedAgo: formatRelativeTime(
      pickString(row, ['posted_at', 'published_at', 'created_at'], ''),
    ),
    title,
    description,
    imageUri: imageFromRow(row),
    viewsLabel:
      views >= 1000
        ? `${(views / 1000).toFixed(1).replace(/\.0$/, '')}k`
        : views > 0
          ? String(views)
          : '0',
    likes,
    liked: Boolean(row.is_liked ?? row.liked),
    saved: Boolean(row.is_saved ?? row.saved),
    shared: Boolean(row.is_shared ?? row.shared),
    category: 'Cars',
    trending: Boolean(row.is_trending ?? row.trending),
    isNew: Boolean(row.is_new ?? row.new),
    city: pickString(row, ['city'], '') || pickString(showroom, ['city'], ''),
    make: make || pickString(row, ['brand'], ''),
    priceLakh: priceLakhFromRow(row),
  };
}

export function mapPublicFeedList(payload: unknown): FeedPost[] {
  const data = unwrapData(payload);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(asRecord(data).data)
      ? asRecord(data).data
      : [];
  return (list as unknown[]).map(mapPublicFeedPost);
}
