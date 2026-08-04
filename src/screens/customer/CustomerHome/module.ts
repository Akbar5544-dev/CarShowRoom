export const FEED_PRIMARY = '#2563eb';
export const FEED_MUTED = '#6b7280';
export const FEED_BORDER = '#e5e7eb';
export const FEED_BG = '#f9fafb';
export const FEED_LIKE = '#ef4444';

export type FeedChipId = 'All' | 'For Sale' | 'For Rent' | 'Trending' | 'New';

export const FEED_CHIPS: FeedChipId[] = [
  'All',
  'For Sale',
  'For Rent',
  'Trending',
  'New',
];

export type ListingType = 'For Sale' | 'For Rent';

export type FeedPost = {
  id: string;
  sellerInitials: string;
  sellerName: string;
  verified: boolean;
  listingType: ListingType;
  postedAgo: string;
  title: string;
  description: string;
  imageUri: string | null;
  viewsLabel: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  shared?: boolean;
  category?: 'Cars' | 'Showrooms';
  trending?: boolean;
  isNew?: boolean;
  city: string;
  make: string;
  /** Approximate price in PKR Lakh for sale; daily rate for rent ignored in Lakh filter */
  priceLakh: number | null;
};

export type SheetFilters = {
  type: 'All' | ListingType;
  pricePreset: 'Under 30L' | '20–100L' | '100L+' | null;
  priceMin: string;
  priceMax: string;
  city: string | null;
  make: string | null;
  sort: 'Newest' | 'Price ↑' | 'Popular';
};

export const DEFAULT_SHEET_FILTERS: SheetFilters = {
  type: 'All',
  pricePreset: null,
  priceMin: '',
  priceMax: '',
  city: null,
  make: null,
  sort: 'Newest',
};

export type ActiveFilterChip = {
  key: string;
  label: string;
};

export type SidebarItemId =
  | 'profile'
  | 'settings'
  | 'saved'
  | 'liked'
  | 'shared'
  | 'logout';

export type CustomerHomeController = {
  search: string;
  setSearch: (value: string) => void;
  activeChip: FeedChipId;
  onChipPress: (chip: FeedChipId) => void;
  hasNotifications: boolean;
  isLoading: boolean;
  posts: FeedPost[];
  activeFilters: ActiveFilterChip[];
  filterCount: number;
  filterSheetVisible: boolean;
  draftFilters: SheetFilters;
  draftResultCount: number;
  sidebarVisible: boolean;
  sidebarActiveItem: Exclude<SidebarItemId, 'logout'>;
  userName: string;
  userEmail: string;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  onDraftChange: (next: SheetFilters) => void;
  onRemoveActiveFilter: (key: string) => void;
  onProfilePress: () => void;
  onCloseSidebar: () => void;
  onSidebarItemPress: (id: SidebarItemId) => void;
  onNotificationsPress: () => void;
  onMessagesPress: () => void;
  onPostPress: (post: FeedPost) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onShare: (post: FeedPost) => void;
};
