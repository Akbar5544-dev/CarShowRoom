import type {AvatarTone} from '../shared/tokens';

export type Showroom = {
  id: string;
  initials: string;
  tone: AvatarTone;
  name: string;
  verified: boolean;
  subtitle: string;
  following: boolean;
  description: string;
  followersLabel: string;
  rating: number;
  vehicles: number;
  nearby?: boolean;
  topRated?: boolean;
  phone: string;
  hours: string;
  instagram: string;
};

export const SHOWROOM_CHIPS = [
  'All',
  'Verified',
  'Nearby',
  'Top Rated',
  'Following',
] as const;

export const SHOWROOMS: Showroom[] = [
  {
    id: 'supreme-cars',
    initials: 'SC',
    tone: 'sc',
    name: 'Supreme Cars',
    verified: true,
    subtitle: 'Car Dealership · Lahore',
    following: true,
    description:
      'Trusted multi-brand showroom with walk-in ready inventory and verified paperwork.',
    followersLabel: '1.2k',
    rating: 4.8,
    vehicles: 24,
    nearby: true,
    topRated: true,
    phone: '03217245824',
    hours: '10:00 AM – 9:00 PM',
    instagram: '@Supremecars',
  },
  {
    id: 'auto-world',
    initials: 'AW',
    tone: 'aw',
    name: 'Auto World',
    verified: true,
    subtitle: 'Car Dealership · DHA Phase 5',
    following: false,
    description:
      'Modern dealership specializing in hybrid and premium vehicles.',
    followersLabel: '8.2k',
    rating: 4.9,
    vehicles: 36,
    nearby: true,
    topRated: true,
    phone: '03001234567',
    hours: '10:00 AM – 8:00 PM',
    instagram: '@Autoworld',
  },
  {
    id: 'city-cars',
    initials: 'CC',
    tone: 'cc',
    name: 'City Cars Lahore',
    verified: false,
    subtitle: 'Car Dealership · Johar Town',
    following: false,
    description: 'Affordable city cars with flexible deals for first buyers.',
    followersLabel: '3.8k',
    rating: 4.3,
    vehicles: 18,
    nearby: false,
    phone: '03009876543',
    hours: '11:00 AM – 9:00 PM',
    instagram: '@Citycars',
  },
  {
    id: 'ali-motors',
    initials: 'AM',
    tone: 'am',
    name: 'Ali Motors',
    verified: true,
    subtitle: 'Car Dealership · Gulberg III',
    following: true,
    description: 'Family-run showroom for certified used cars.',
    followersLabel: '5.1k',
    rating: 4.7,
    vehicles: 22,
    nearby: true,
    topRated: true,
    phone: '03111222333',
    hours: '10:00 AM – 9:00 PM',
    instagram: '@Alimotors',
  },
];

export type InventoryItem = {
  id: string;
  showroomId: string;
  title: string;
  tag: 'For Sale' | 'For Rent';
  meta: string;
  price: string;
  year: string;
  mileage: string;
  transmission: string;
  fuel: string;
  description: string;
};

export const INVENTORY: InventoryItem[] = [
  {
    id: 'prius-hybrid',
    showroomId: 'supreme-cars',
    title: 'Toyota Prius Hybrid',
    tag: 'For Sale',
    meta: '2022 · 28,000 km',
    price: 'PKR 72 Lakh',
    year: '2022',
    mileage: '28,000 km',
    transmission: 'Automatic',
    fuel: 'Hybrid',
    description:
      'Premium condition hybrid hatchback with original documents and immediate delivery from Supreme Cars showroom.',
  },
  {
    id: 'city-aspire',
    showroomId: 'supreme-cars',
    title: 'Honda City Aspire',
    tag: 'For Rent',
    meta: '2023 · 12,400 km',
    price: 'PKR 8.5k/day',
    year: '2023',
    mileage: '12,400 km',
    transmission: 'Automatic',
    fuel: 'Petrol',
    description: 'Clean Honda City Aspire available for daily rental.',
  },
  {
    id: 'bmw-220i',
    showroomId: 'auto-world',
    title: 'BMW 220i M Sport Coupe',
    tag: 'For Sale',
    meta: '2023 · 8,400 km',
    price: 'PKR 89.5 Lakh',
    year: '2023',
    mileage: '8,400 km',
    transmission: 'Automatic',
    fuel: 'Petrol',
    description: 'Premium condition BMW coupe from Auto World.',
  },
];

export function showroomById(id: string) {
  return SHOWROOMS.find(s => s.id === id) ?? SHOWROOMS[0];
}

export function inventoryForShowroom(showroomId: string) {
  return INVENTORY.filter(i => i.showroomId === showroomId);
}

export function productById(id: string) {
  return INVENTORY.find(i => i.id === id) ?? INVENTORY[0];
}
