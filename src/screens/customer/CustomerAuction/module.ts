export type AuctionItem = {
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
};

export const AUCTION_CHIPS = [
  'Live',
  'Ending soon',
  'Cars',
  'Watching',
  'Won',
] as const;

export const AUCTIONS: AuctionItem[] = [
  {
    id: 'bmw-220i',
    title: 'BMW 220i M Sport Coupe',
    seller: 'Auto World',
    verified: true,
    specs: '2023 · 8,400 km',
    currentBid: 'PKR 82 Lakh',
    bidValue: 82,
    bids: 18,
    watchers: 64,
    timer: '02:14:36',
    watching: false,
    endingSoon: true,
  },
  {
    id: 'prius',
    title: 'Toyota Prius Hybrid',
    seller: 'Supreme Cars',
    verified: true,
    specs: '2022 · 28,000 km',
    currentBid: 'PKR 68 Lakh',
    bidValue: 68,
    bids: 11,
    watchers: 39,
    timer: '05:42:10',
    watching: false,
  },
  {
    id: 'merc-s500',
    title: 'Mercedes-Benz S 500',
    seller: 'Ali Motors',
    verified: true,
    specs: '2022 · 18,600 km',
    currentBid: 'PKR 1.45 Cr',
    bidValue: 145,
    bids: 27,
    watchers: 102,
    timer: '00:48:22',
    watching: true,
    endingSoon: true,
  },
];

export function auctionById(id: string) {
  return AUCTIONS.find(a => a.id === id) ?? AUCTIONS[0];
}
