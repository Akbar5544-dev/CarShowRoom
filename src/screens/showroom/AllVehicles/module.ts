import type {ActiveRental} from '../../../components/ActiveRentalCard';

export type AllVehiclesController = {
  isLoading: boolean;
  summary: string;
  searchQuery: string;
  filteredRentals: ActiveRental[];
  setSearchQuery: (text: string) => void;
  onBackPress: () => void;
  onReturnPress: (item: ActiveRental) => void;
  onInvoicePress: (item: ActiveRental) => void;
};
