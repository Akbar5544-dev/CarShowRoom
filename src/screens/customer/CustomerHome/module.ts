import type {IconName} from '../../../assets/iconXml';

export type ListingBadgeTone = 'sale' | 'rent' | 'new' | 'reserved';

export type ListingBadge = {
  label: string;
  tone: ListingBadgeTone;
};

export type ListingSpec = {
  icon: IconName;
  label: string;
};

export type CarListing = {
  id: string;
  title: string;
  subtitle: string;
  imageUri: string | null;
  imageTint: string;
  badges: ListingBadge[];
  specs: ListingSpec[];
  showroomName: string;
  showroomVerified: boolean;
  locationLabel: string;
  price: string;
  priceSuffix?: string;
};

export type CustomerHomeController = {
  userName: string;
  dateLabel: string;
  hasNotifications: boolean;
  saleListings: CarListing[];
  rentalListings: CarListing[];
  onNotificationsPress: () => void;
  onSettingsPress: () => void;
  onListingPress: (listing: CarListing) => void;
  onSeeAllSalePress: () => void;
  onSeeAllRentalPress: () => void;
};
