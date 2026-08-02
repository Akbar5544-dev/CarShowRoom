import {ActiveRental} from '../components/ActiveRentalCard';
import {colors} from '../theme';

export type RentalDetail = ActiveRental & {
  vin: string;
  vehicleTitle: string;
  specs: string;
  rentalTotal: number;
  deposit: number;
  extras: {id: string; label: string; amount: number}[];
};

export const ACTIVE_RENTALS: ActiveRental[] = [
  {
    id: '1',
    rentalId: '#RN-10284',
    customer: 'Ayesha Khan',
    vehicle: 'BMW i5 M60',
    location: 'Lahore Airport',
    pickup: 'Nov 20, 09:30',
    returnDate: 'Nov 24, 18:00',
    amount: '$840',
    progress: 60,
    status: 'Active',
    imageTint: '#DBEAFE',
  },
  {
    id: '2',
    rentalId: '#RN-10283',
    customer: 'Daniel Weiss',
    vehicle: 'Tesla Model S',
    location: 'DHA Phase 5',
    pickup: 'Nov 19, 11:00',
    returnDate: 'Nov 22, 12:00',
    amount: '$1,120',
    progress: 80,
    status: 'Active',
    imageTint: '#D1FAE5',
  },
  {
    id: '3',
    rentalId: '#RN-10282',
    customer: 'Sara Ahmed',
    vehicle: 'Range Rover Sport',
    location: 'Gulberg III',
    pickup: 'Nov 18, 15:00',
    returnDate: 'Nov 25, 15:00',
    amount: '$2,240',
    progress: 45,
    status: 'Active',
    imageTint: '#EDE9FE',
  },
  {
    id: '4',
    rentalId: '#RN-10281',
    customer: 'Omar Farid',
    vehicle: 'Mercedes S-Class',
    location: 'Airport Terminal',
    pickup: 'Nov 17, 08:00',
    returnDate: 'Nov 19, 20:00',
    amount: '$520',
    progress: 100,
    status: 'Overdue',
    imageTint: '#FFE4E6',
  },
];

const DETAILS: Record<string, Omit<RentalDetail, keyof ActiveRental>> = {
  '1': {
    vin: 'VIN · WBA7Y2C50KG614211',
    vehicleTitle: 'BMW i5 M60 · 2026',
    specs: 'Sonic Blue Metallic · Automatic · Electric',
    rentalTotal: 840,
    deposit: 300,
    extras: [
      {id: 'fuel', label: 'Fuel refill', amount: 45},
      {id: 'bumper', label: 'Bumper repair', amount: 180},
      {id: 'late', label: 'Late return fee', amount: 0},
      {id: 'cleaning', label: 'Cleaning', amount: 25},
    ],
  },
  '2': {
    vin: 'VIN · 5YJSA1E26MF123456',
    vehicleTitle: 'Tesla Model S · 2025',
    specs: 'Pearl White · Automatic · Electric',
    rentalTotal: 1120,
    deposit: 400,
    extras: [
      {id: 'fuel', label: 'Charging fee', amount: 35},
      {id: 'bumper', label: 'Bumper repair', amount: 0},
      {id: 'late', label: 'Late return fee', amount: 0},
      {id: 'cleaning', label: 'Cleaning', amount: 20},
    ],
  },
  '3': {
    vin: 'VIN · SALWA2RE5JA123789',
    vehicleTitle: 'Range Rover Sport · 2025',
    specs: 'Santorini Black · Automatic · Petrol',
    rentalTotal: 2240,
    deposit: 600,
    extras: [
      {id: 'fuel', label: 'Fuel refill', amount: 80},
      {id: 'bumper', label: 'Bumper repair', amount: 0},
      {id: 'late', label: 'Late return fee', amount: 0},
      {id: 'cleaning', label: 'Cleaning', amount: 40},
    ],
  },
  '4': {
    vin: 'VIN · WDD2221611A123456',
    vehicleTitle: 'Mercedes S-Class · 2024',
    specs: 'Obsidian Black · Automatic · Petrol',
    rentalTotal: 520,
    deposit: 250,
    extras: [
      {id: 'fuel', label: 'Fuel refill', amount: 55},
      {id: 'bumper', label: 'Bumper repair', amount: 120},
      {id: 'late', label: 'Late return fee', amount: 75},
      {id: 'cleaning', label: 'Cleaning', amount: 25},
    ],
  },
};

export function findRentalById(rentalId?: string): RentalDetail {
  const byId =
    ACTIVE_RENTALS.find(
      item => item.id === rentalId || item.rentalId === rentalId,
    ) ?? ACTIVE_RENTALS[0];
  const detail = DETAILS[byId.id] ?? DETAILS['1'];
  return {...byId, ...detail};
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function buildInvoice(detail: RentalDetail) {
  const extrasTotal = detail.extras.reduce((sum, item) => sum + item.amount, 0);
  const subtotal = detail.rentalTotal + extrasTotal;
  const taxable = Math.max(0, subtotal - detail.deposit);
  const tax = taxable * 0.18;
  const amountDue = taxable + tax;

  return {
    rentalTotal: formatMoney(detail.rentalTotal),
    extras: formatMoney(extrasTotal),
    subtotal: formatMoney(subtotal),
    depositRefund: `-$${detail.deposit.toFixed(2)}`,
    tax: formatMoney(tax),
    amountDue: formatMoney(amountDue),
    lineItems: [
      {id: 'rental', label: 'Rental period', amount: formatMoney(detail.rentalTotal)},
      ...detail.extras
        .filter(item => item.amount > 0)
        .map(item => ({
          id: item.id,
          label: item.label,
          amount: formatMoney(item.amount),
        })),
    ],
  };
}

export const UPCOMING_PICKUPS = [
  {
    id: '1',
    name: 'Lina Park',
    vehicle: 'Porsche Taycan',
    when: 'Today · 16:00',
    rentalId: '#RN-10290',
    iconBg: colors.activityBook,
  },
  {
    id: '2',
    name: 'Ahmad Raza',
    vehicle: 'Audi RS e-tron',
    when: 'Tomorrow · 09:00',
    rentalId: '#RN-10291',
    iconBg: colors.activityPay,
  },
  {
    id: '3',
    name: 'Emma Robinson',
    vehicle: 'BMW X7',
    when: 'Nov 22 · 14:30',
    rentalId: '#RN-10292',
    iconBg: colors.activityService,
  },
];
