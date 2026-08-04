import {DepartmentItem} from '../../../components/DepartmentDonut';
import {FleetUsageMonth} from '../../../components/FleetUsageChart';
import {MetricCardData} from '../../../components/MetricCard';
import {VehicleInventoryItem} from '../../../components/VehicleInventoryCard';

export type VehiclesController = {
  userName: string;
  dateLabel: string;
  summary: string;
  metrics: MetricCardData[];
  fleetUsage: FleetUsageMonth[];
  categories: DepartmentItem[];
  categoryTotal: number;
  isLoading: boolean;
  onAuctionPress: () => void;
  onVehiclesPress: () => void;
};

export type VehicleListController = {
  summary: string;
  searchQuery: string;
  filteredVehicles: VehicleInventoryItem[];
  isLoading: boolean;
  setSearchQuery: (text: string) => void;
  onBackPress: () => void;
  onFilterPress: () => void;
  onAuctionPress: () => void;
  onAddVehiclePress: () => void;
  onViewVehiclePress: (item: VehicleInventoryItem) => void;
  onPostVehiclePress: (item: VehicleInventoryItem) => void;
  onAuctionVehiclePress: (item: VehicleInventoryItem) => void;
  onItemPress: (item: VehicleInventoryItem) => void;
};
