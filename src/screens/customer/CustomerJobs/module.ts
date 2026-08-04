import type {AvatarTone} from '../shared/tokens';

export type JobItem = {
  id: string;
  initials: string;
  tone: AvatarTone;
  title: string;
  company: string;
  verified: boolean;
  role: string;
  type: 'Full-time' | 'Part-time';
  location: string;
  pay: string;
  description: string;
  posted: string;
  applicants: number;
  applied: boolean;
};

export const JOB_CHIPS = [
  'All',
  'Full-time',
  'Part-time',
  'Sales',
  'Mechanic',
] as const;

export const JOBS: JobItem[] = [
  {
    id: 'sales-advisor',
    initials: 'CC',
    tone: 'cc',
    title: 'Sales Advisor',
    company: 'City Cars Lahore',
    verified: true,
    role: 'Car Sales',
    type: 'Full-time',
    location: 'Lahore',
    pay: 'PKR 60–80k',
    description:
      'Customers ko cars dikhana, test drives arrange karna, aur deals close karna.',
    posted: 'Posted 1 day ago',
    applicants: 24,
    applied: false,
  },
  {
    id: 'showroom-manager',
    initials: 'SC',
    tone: 'sc',
    title: 'Showroom Manager',
    company: 'Supreme Cars',
    verified: true,
    role: 'Management',
    type: 'Full-time',
    location: 'Lahore',
    pay: 'PKR 120–150k',
    description:
      'Poori showroom operations handle karna — staff, inventory aur sales targets.',
    posted: 'Posted 2 days ago',
    applicants: 11,
    applied: false,
  },
  {
    id: 'auto-mechanic',
    initials: 'IA',
    tone: 'j3',
    title: 'Auto Mechanic',
    company: 'Imran Auto Care',
    verified: true,
    role: 'Workshop / Repair',
    type: 'Full-time',
    location: 'Gulberg',
    pay: 'PKR 45–70k',
    description:
      'Cars ki engine, brakes, AC aur diagnostics ka kaam handle karna.',
    posted: 'Posted 3 days ago',
    applicants: 38,
    applied: true,
  },
  {
    id: 'support-pt',
    initials: 'AW',
    tone: 'j4',
    title: 'Customer Support (Part-time)',
    company: 'Auto World',
    verified: true,
    role: 'Customer Support',
    type: 'Part-time',
    location: 'DHA Phase 5',
    pay: 'PKR 25–35k',
    description: 'Calls / messages handle karna aur customers ko guide karna.',
    posted: 'Posted 5 days ago',
    applicants: 16,
    applied: false,
  },
];

export function jobById(id: string) {
  return JOBS.find(j => j.id === id) ?? JOBS[0];
}
