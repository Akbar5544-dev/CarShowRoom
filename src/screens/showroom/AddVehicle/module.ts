import {VehicleWizardStep} from '../../../components/VehicleWizardStepper';

export type AddVehicleStepId = 0 | 1 | 2 | 3 | 4 | 5;

export type AddVehicleForm = {
  vehicleCode: string;
  registrationPlate: string;
  make: string;
  model: string;
  year: string;
  category: string;
  branch: string;
  status: string;
  description: string;
  engineType: string;
  horsepower: string;
  transmission: string;
  driveType: string;
  fuelType: string;
  batteryTank: string;
  seats: string;
  doors: string;
  mileage: string;
  color: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  securityDeposit: string;
  extraKmCharge: string;
  lateReturnFee: string;
  insuranceProvider: string;
  policyNumber: string;
  coverageType: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  ownership: string;
};

export type ReviewField = {
  label: string;
  value: string;
};

export type AddVehicleController = {
  summary: string;
  currentStep: AddVehicleStepId;
  steps: VehicleWizardStep[];
  stepTitle: string;
  stepDescription?: string;
  form: AddVehicleForm;
  canGoPrevious: boolean;
  isLastStep: boolean;
  submitting: boolean;
  reviewFields: ReviewField[];
  specSheetName: string | null;
  insuranceDocName: string | null;
  registrationDocName: string | null;
  imageUploads: {id: string; title: string; fileName: string | null}[];
  categoryOptions: string[];
  setField: <K extends keyof AddVehicleForm>(
    key: K,
    value: AddVehicleForm[K],
  ) => void;
  onNextPress: () => void;
  onPreviousPress: () => void;
  onBackPress: () => void;
  onStepPress: (stepId: number) => void;
  onSpecSheetPress: () => void;
  onInsuranceDocPress: () => void;
  onRegistrationDocPress: () => void;
  onImageUploadPress: (id: string) => void;
};
