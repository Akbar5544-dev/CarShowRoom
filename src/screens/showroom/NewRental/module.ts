import {IconName} from '../../../assets/iconXml';

export type NewRentalStepId = 0 | 1 | 2 | 3 | 4 | 5;

export type NewRentalStep = {
  id: NewRentalStepId;
  label: string;
  icon: IconName;
};

export type NewRentalStepCopy = {
  eyebrow: string;
  title: string;
  nextLabel: string;
};

export type NewRentalVehicleSpec = {
  icon: IconName;
  label: string;
};

export type NewRentalVehicleOption = {
  id: string;
  title: string;
  segment: string;
  dailyRate: number;
  dailyRateLabel: string;
  specs: NewRentalVehicleSpec[];
};

export type NewRentalAddon = {
  id: string;
  label: string;
  price: number;
};

export type NewRentalPromo = {
  code: string;
  percent: number;
};

export type NewRentalPaymentMethodId = 'card' | 'bank' | 'cash';

export type NewRentalPaymentMethod = {
  id: NewRentalPaymentMethodId;
  label: string;
  icon: IconName;
};

export type NewRentalTerm = {
  title: string;
  body: string;
};

export type NewRentalForm = {
  customerName: string;
  email: string;
  phone: string;
  license: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  promoCode: string;
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  signature: string;
};

export type NewRentalTotals = {
  days: number;
  baseLabel: string;
  addonsLabel: string;
  insuranceLabel: string;
  discountLabel: string;
  subtotalLabel: string;
  taxLabel: string;
  totalLabel: string;
  hasDiscount: boolean;
};

export type NewRentalController = {
  userName: string;
  dateLabel: string;
  summary: string;
  currentStep: NewRentalStepId;
  steps: NewRentalStep[];
  stepCopy: NewRentalStepCopy;
  form: NewRentalForm;
  vehicleOptions: NewRentalVehicleOption[];
  selectedVehicleId: string;
  selectedVehicle: NewRentalVehicleOption | null;
  addons: NewRentalAddon[];
  selectedAddonIds: string[];
  promos: NewRentalPromo[];
  appliedPromo: NewRentalPromo | null;
  paymentMethods: NewRentalPaymentMethod[];
  selectedPaymentMethodId: NewRentalPaymentMethodId;
  terms: NewRentalTerm[];
  termsAccepted: boolean;
  existingCustomerName: string | null;
  totals: NewRentalTotals;
  submitting: boolean;
  setField: <K extends keyof NewRentalForm>(
    key: K,
    value: NewRentalForm[K],
  ) => void;
  fieldErrors: Partial<Record<keyof NewRentalForm | 'vehicle' | 'terms', string>>;
  onSelectExistingCustomer: () => void;
  onSelectVehicle: (id: string) => void;
  onToggleAddon: (id: string) => void;
  onApplyPromo: (code: string) => void;
  onSelectPaymentMethod: (id: NewRentalPaymentMethodId) => void;
  onToggleTerms: () => void;
  onNextPress: () => void;
  onPreviousPress: () => void;
};
