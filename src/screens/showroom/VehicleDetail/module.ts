import type {IconName} from '../../../assets/iconXml';
import type {VehicleInventoryItem} from '../../../components/VehicleInventoryCard';

export type VehicleDetailTabId =
  | 'overview'
  | 'maintenance'
  | 'rental-history'
  | 'documents'
  | 'insurance'
  | 'photos'
  | 'service-history'
  | 'activity'
  | 'calendar';

export type VehicleDetailRouteParams = {
  vehicleId: string;
  make: string;
  model: string;
  year: string;
  plateNo: string;
  fuelType: string;
  transmission: string;
  seats: string;
  mileageLabel: string;
  dailyRate: string;
  imageUri: string | null;
  imageTint: string;
  status?: string;
  statusBg?: string;
  statusColor?: string;
};

export type SpecItem = {label: string; value: string};
export type FeaturePill = {icon: IconName; label: string};
export type OverviewTone = 'green' | 'blue' | 'amber' | 'purple';
export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  icon: IconName;
  tone: OverviewTone;
};
export type StatCard = {
  label: string;
  value: string;
  icon: IconName;
  tone: OverviewTone;
};
export type MaintenanceRow = {
  id: string;
  date: string;
  type: string;
  garage: string;
  odometer: string;
  cost: string;
};
export type RentalRow = {id: string; start: string; end: string; days: string};
export type DocumentItem = {
  id: string;
  title: string;
  meta: string;
};
export type ServiceItem = {
  id: string;
  date: string;
  title: string;
  details: string;
  cost: string;
};
export type CalendarDayStatus = 'available' | 'booked' | 'reserved' | 'maintenance';
export type CalendarLegendItem = {color: string; label: string};
export type ClaimItem = {
  id: string;
  title: string;
  status: string;
  amount: string;
};

export type VehicleDetailController = {
  vehicle: VehicleDetailRouteParams & {title: string; description: string; rating: string};
  tabs: {id: VehicleDetailTabId; label: string}[];
  activeTab: VehicleDetailTabId;
  specs: SpecItem[];
  featurePills: FeaturePill[];
  activities: ActivityItem[];
  quickStats: StatCard[];
  purchaseSummary: SpecItem[];
  maintenanceStats: StatCard[];
  maintenanceRows: MaintenanceRow[];
  rentalStats: StatCard[];
  rentalRows: RentalRow[];
  documents: DocumentItem[];
  insurancePolicy: {
    provider: string;
    status: string;
    fields: SpecItem[];
  };
  claims: ClaimItem[];
  serviceItems: ServiceItem[];
  activityFeed: ActivityItem[];
  calendarLegend: CalendarLegendItem[];
  calendarMonthDate: Date;
  calendarScheduleRows: CalendarDayStatus[][];
  isCalendarPickerVisible: boolean;
  isUploadModalVisible: boolean;
  uploadFileName: string | null;
  isUploadSubmitting: boolean;
  setActiveTab: (tab: VehicleDetailTabId) => void;
  onBackPress: () => void;
  onRentNowPress: () => void;
  onEditPress: () => void;
  onUploadDocumentPress: () => void;
  onCloseUploadModal: () => void;
  onPickUploadDocument: () => void;
  onConfirmUploadPress: () => void;
  onNewRentalPress: () => void;
  onNewServicePress: () => void;
  onPrevCalendarMonth: () => void;
  onNextCalendarMonth: () => void;
  onOpenCalendarPicker: () => void;
  onCloseCalendarPicker: () => void;
  onCalendarMonthChange: (date: Date) => void;
};

export type {VehicleInventoryItem};
