import type {IconName} from '../../../assets/iconXml';

export type EditVehicleRouteParams = {
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
};

export type EditVehicleSectionId = 'basic' | 'pricing' | 'insurance' | 'media';

export type EditVehicleForm = {
  brand: string;
  model: string;
  variant: string;
  year: string;
  registration: string;
  vin: string;
  fuelType: string;
  transmission: string;
  seats: string;
  color: string;
  mileage: string;
  category: string;
  description: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  securityDeposit: string;
  overagePerKm: string;
  freeKmPerDay: string;
  insuranceProvider: string;
  policyNumber: string;
  validFrom: string;
  validUntil: string;
  registrationExpiry: string;
  fitnessCertificate: string;
};

export type QuickNavItem = {
  id: EditVehicleSectionId;
  label: string;
  icon: IconName;
};

export type EditVehicleController = {
  plateNo: string;
  vehicleTitle: string;
  subtitle: string;
  imageUri: string | null;
  imageTint: string;
  availableForRent: boolean;
  quickNav: QuickNavItem[];
  activeSection: EditVehicleSectionId;
  form: EditVehicleForm;
  photoUris: string[];
  loading: boolean;
  saving: boolean;
  setField: (key: keyof EditVehicleForm, value: string) => void;
  setAvailableForRent: (value: boolean) => void;
  onBackToInventoryPress: () => void;
  onCancelPress: () => void;
  onSavePress: () => void;
  onQuickNavPress: (id: EditVehicleSectionId) => void;
  onAddPhotoPress: () => void;
  registerSectionOffset: (id: EditVehicleSectionId, offset: number) => void;
  setScrollRef: (ref: {scrollTo: (options: {y: number; animated?: boolean}) => void} | null) => void;
};
