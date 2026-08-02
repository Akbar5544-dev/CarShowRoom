import {MetricCardData} from '../../../components/MetricCard';

export type UpcomingPickup = {
  id: string;
  name: string;
  vehicle: string;
  when: string;
  rentalId: string;
  iconBg: string;
};

export type RentalsController = {
  isLoading: boolean;
  userName: string;
  dateLabel: string;
  summary: string;
  metrics: MetricCardData[];
  rentalsSeries: number[];
  returnsSeries: number[];
  upcomingPickups: UpcomingPickup[];
  onViewVehiclesPress: () => void;
  onNewRentalPress: () => void;
};
