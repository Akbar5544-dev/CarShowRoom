import {DocumentUploadItem} from '../../../components/DocumentUploadGrid';
import {IconName} from '../../../assets/iconXml';

export type AddEmployeeStepId = 0 | 1 | 2 | 3;

export type AddEmployeeStep = {
  id: AddEmployeeStepId;
  label: string;
  icon: IconName;
  activeIcon?: IconName;
};

export type AddEmployeeForm = {
  employeeCode: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  city: string;
  emergencyContact: string;
  address: string;
  createLogin: boolean;
  role: string;
  password: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentType: string;
  basicSalary: string;
  allowances: string;
  employmentStatus: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
};

export type AddEmployeeControllerState = {
  userName: string;
  dateLabel: string;
  currentStep: AddEmployeeStepId;
  steps: AddEmployeeStep[];
  form: AddEmployeeForm;
  photoUri: string | null;
  documentUploads: DocumentUploadItem[];
  canGoPrevious: boolean;
  isLastStep: boolean;
  submitting: boolean;
  setField: <K extends keyof AddEmployeeForm>(
    key: K,
    value: AddEmployeeForm[K],
  ) => void;
  onNextPress: () => void;
  onPreviousPress: () => void;
  onBackPress: () => void;
  onCancelPress: () => void;
  onSaveDraftPress: () => void;
  onUploadPhotoPress: () => void;
  onDocumentUploadPress: (item: DocumentUploadItem) => void;
};

export type AddEmployeeController = AddEmployeeControllerState;
