import {
  AnyRecord,
  asRecord,
  pickNumber,
  pickString,
  unwrapData,
  unwrapList,
} from './apiHelpers';
import {resolvePublicMediaUrl} from './publicMedia';

export type PublicAuction = {
  id: string;
  title: string;
  seller: string;
  verified: boolean;
  specs: string;
  currentBid: string;
  bidValue: number;
  bids: number;
  watchers: number;
  timer: string;
  watching: boolean;
  endingSoon?: boolean;
  imageUri: string | null;
  endsAt: string | null;
};

function formatBid(amount: number, currency = 'PKR'): string {
  if (amount <= 0) {
    return `${currency} —`;
  }
  if (amount >= 10000000) {
    return `${currency} ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `${currency} ${Math.round(amount / 100000)} Lakh`;
  }
  return `${currency} ${amount.toLocaleString('en-US')}`;
}

function bidValueLakh(amount: number): number {
  if (amount >= 100000) {
    return Math.round(amount / 100000);
  }
  return amount;
}

function formatTimer(endsAt: string | null): string {
  if (!endsAt) {
    return '--:--:--';
  }
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) {
    return '--:--:--';
  }
  const diff = Math.max(0, end - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function mapPublicAuction(item: unknown): PublicAuction {
  const row = asRecord(item);
  const vehicle = asRecord(row.vehicle);
  const showroom = asRecord(row.showroom ?? row.seller);
  const id =
    pickString(row, ['id', 'slug', 'uuid'], '') ||
    String(pickNumber(row, ['id']) || '');
  const title =
    pickString(row, ['title', 'name'], '') ||
    [
      pickString(vehicle, ['make', 'brand'], ''),
      pickString(vehicle, ['model'], ''),
    ]
      .filter(Boolean)
      .join(' ') ||
    'Auction vehicle';
  const amount = pickNumber(row, [
    'current_bid',
    'highest_bid',
    'starting_bid',
    'bid_amount',
  ]);
  const endsAt = pickString(row, ['ends_at', 'end_at', 'ends_on'], '') || null;
  const endMs = endsAt ? new Date(endsAt).getTime() : NaN;
  const endingSoon =
    !Number.isNaN(endMs) && endMs - Date.now() > 0 && endMs - Date.now() < 3600000;

  return {
    id,
    title,
    seller:
      pickString(showroom, ['display_name', 'name'], '') ||
      pickString(row, ['seller_name'], 'Seller'),
    verified: Boolean(showroom.is_verified ?? row.is_verified),
    specs: [
      pickString(vehicle, ['year', 'model_year'], '') ||
        pickString(row, ['year'], ''),
      (() => {
        const km = pickNumber(vehicle, ['mileage', 'odometer']);
        return km > 0 ? `${km.toLocaleString()} km` : '';
      })(),
    ]
      .filter(Boolean)
      .join(' · '),
    currentBid: formatBid(amount),
    bidValue: bidValueLakh(amount),
    bids: pickNumber(row, ['bids_count', 'bids', 'total_bids']),
    watchers: pickNumber(row, ['watchers_count', 'watchers']),
    timer: formatTimer(endsAt),
    watching: Boolean(row.is_watching ?? row.watching),
    endingSoon,
    imageUri: resolvePublicMediaUrl(
      pickString(row, ['image', 'cover_image', 'thumbnail'], '') ||
        pickString(vehicle, ['image', 'thumbnail'], ''),
    ),
    endsAt,
  };
}

export function mapPublicAuctionList(payload: unknown): PublicAuction[] {
  return unwrapList(payload).map(mapPublicAuction);
}

export function mapPublicAuctionDetail(payload: unknown): PublicAuction {
  return mapPublicAuction(unwrapData(payload));
}

export type PublicBid = {
  id: string;
  name: string;
  time: string;
  amount: string;
};

export function mapPublicBid(item: unknown): PublicBid {
  const row = asRecord(item);
  const user = asRecord(row.user ?? row.bidder);
  const amount = pickNumber(row, ['amount', 'bid_amount', 'price']);
  return {
    id:
      pickString(row, ['id'], '') ||
      String(pickNumber(row, ['id']) || Math.random()),
    name:
      pickString(user, ['name', 'full_name'], '') ||
      pickString(row, ['bidder_name'], 'Bidder'),
    time: pickString(row, ['created_at', 'placed_at'], ''),
    amount: formatBid(amount),
  };
}

export function mapPublicBidList(payload: unknown): PublicBid[] {
  return unwrapList(payload).map(mapPublicBid);
}
