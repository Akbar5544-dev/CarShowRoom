import type {AvatarTone} from '../shared/tokens';

export type Mechanic = {
  id: string;
  initials: string;
  tone: AvatarTone;
  name: string;
  verified: boolean;
  specialty: string;
  location: string;
  rating: number;
  jobs: number;
  nearby?: boolean;
  phone: string;
};

export const MECHANIC_CHIPS = [
  'All',
  'Nearby',
  'Top Rated',
  'AC / Hybrid',
  'Body Work',
] as const;

export const MECHANICS: Mechanic[] = [
  {
    id: 'imran',
    initials: 'IA',
    tone: 'mech',
    name: 'Imran Auto Care',
    verified: true,
    specialty: 'Engine · Hybrid · Diagnostics',
    location: 'Gulberg III, Lahore',
    rating: 4.9,
    jobs: 186,
    nearby: true,
    phone: '03001234567',
  },
  {
    id: 'raza',
    initials: 'RK',
    tone: 'm2',
    name: 'Raza Khan Workshop',
    verified: true,
    specialty: 'AC · Electrical · Battery',
    location: 'Johar Town, Lahore',
    rating: 4.6,
    jobs: 124,
    nearby: true,
    phone: '03009876543',
  },
  {
    id: 'bilal',
    initials: 'BA',
    tone: 'm3',
    name: 'Bilal Auto Experts',
    verified: false,
    specialty: 'Body work · Paint · Denting',
    location: 'DHA Phase 5, Lahore',
    rating: 4.4,
    jobs: 98,
    nearby: false,
    phone: '03111222333',
  },
  {
    id: 'saeed',
    initials: 'SM',
    tone: 'm4',
    name: 'Saeed Motors Care',
    verified: true,
    specialty: 'Oil change · Brakes · Suspension',
    location: 'Model Town, Lahore',
    rating: 4.8,
    jobs: 210,
    nearby: true,
    phone: '03221234567',
  },
];
