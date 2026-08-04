import type {IconName} from '../../../assets/iconXml';
import type {RentalVehicleSummary} from '../../../components/RentalVehicleSummaryCard';
import type {RentalWizardStep} from '../../../components/RentalWizardStepper';

export type RentalVehicleStepId = 0 | 1 | 2;

export type RentalCustomerTier = 'Gold' | 'Platinum' | 'Silver';

export type RentalCustomer = {
  id: string;
  code: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseInfo: string;
  tier: RentalCustomerTier;
};

export type RentalAddon = {
  id: string;
  title: string;
  description: string;
  dailyRate: string;
};

export type RentalInsuranceOption = {
  id: string;
  title: string;
  description: string;
  dailyRate: string;
  popular?: boolean;
};

export type RentalPaymentMethod = {
  id: 'card' | 'cash' | 'bank';
  label: string;
  icon: IconName;
};

export type RentalReviewField = {
  label: string;
  value: string;
};

export type RentalVehicleForm = {
  pickupDateTime: string;
  returnDateTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  cardNumber: string;
  cardholder: string;
  cardExpiry: string;
  cardCvc: string;
  internalNotes: string;
};

export type RentalVehicleController = {
  vehicle: RentalVehicleSummary;
  vehicleYear: string;
  vehiclePlateNo: string;
  currentStep: RentalVehicleStepId;
  steps: RentalWizardStep[];
  stepTitle: string;
  stepDescription?: string;
  form: RentalVehicleForm;
  customerSearch: string;
  customers: RentalCustomer[];
  filteredCustomers: RentalCustomer[];
  selectedCustomerId: string | null;
  addons: RentalAddon[];
  selectedAddonIds: string[];
  selectedAddons: RentalAddon[];
  insuranceOptions: RentalInsuranceOption[];
  selectedInsuranceId: string;
  selectedInsuranceTitle: string;
  paymentMethods: RentalPaymentMethod[];
  selectedPaymentMethodId: RentalPaymentMethod['id'];
  paymentMethodLabel: string;
  dailyRateValue: number;
  durationDays: number;
  baseRentalLine: string;
  baseRentalTotal: string;
  addonsTotal: string;
  insuranceLine: string;
  insuranceTotal: string;
  taxTotal: string;
  grandTotal: string;
  reviewFields: RentalReviewField[];
  canGoPrevious: boolean;
  isLastStep: boolean;
  submitting: boolean;
  setCustomerSearch: (value: string) => void;
  setField: <K extends keyof RentalVehicleForm>(
    key: K,
    value: RentalVehicleForm[K],
  ) => void;
  onSelectCustomer: (customerId: string) => void;
  onToggleAddon: (addonId: string) => void;
  onSelectInsurance: (insuranceId: string) => void;
  onSelectPaymentMethod: (methodId: RentalPaymentMethod['id']) => void;
  onBackPress: () => void;
  onPreviousPress: () => void;
  onNextPress: () => void;
};

export type RentalVehicleRouteParams = {
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
  horsepower?: string;
  color?: string;
};
