import {IconName} from '../../../assets/iconXml';

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  background: string;
  icon: IconName;
};

export type StatusItem = {
  label: string;
  count: number;
  color: string;
};

export type OrderStatus = 'Active' | 'Pending' | 'Overdue';

export type Order = {
  id: string;
  initials: string;
  name: string;
  detail: string;
  status: OrderStatus;
};

export type ActivityItem = {
  id: string;
  message: string;
  time: string;
  icon: IconName;
  background: string;
};

export type FleetGlance = {
  available: number;
  booked: number;
  service: number;
  total: number;
};

export type HomeControllerState = {
  userName: string;
  dateLabel: string;
  fleet: FleetGlance;
  metrics: MetricCard[];
  statusItems: StatusItem[];
  revenueTotal: string;
  revenueGrowth: string;
  revenuePeriod: 'D' | 'W' | 'M';
  revenueBars: number[];
  orders: Order[];
  activities: ActivityItem[];
  setRevenuePeriod: (period: 'D' | 'W' | 'M') => void;
  onSettingsPress: () => void;
};

export type HomeController = HomeControllerState;
