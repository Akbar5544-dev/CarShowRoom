import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {StaffStackParamList} from '../../../navigation/types';
import {staffManagementStaffService} from '../../../services';
import {
  appendMediaToFormData,
  asRecord,
  createMediaFormData,
  mapEmploymentType,
  mapGender,
  mapStaffStatus,
  parseMoneyInput,
  pickFromGallery,
  toIsoDate,
  unwrapData,
  type PickedMedia,
} from '../../../utils';
import type {
  AddEmployeeController,
  AddEmployeeForm,
  AddEmployeeStep,
  AddEmployeeStepId,
} from './module';
import type {DocumentUploadItem} from '../../../components/DocumentUploadGrid';

type Nav = NativeStackNavigationProp<StaffStackParamList, 'AddEmployee'>;

const STEPS: AddEmployeeStep[] = [
  {
    id: 0,
    label: 'Personal Information',
    icon: 'stepPerson',
    activeIcon: 'stepPersonActive',
  },
  {
    id: 1,
    label: 'Employment Details',
    icon: 'stepEmployment',
    activeIcon: 'stepEmploymentActive',
  },
  {
    id: 2,
    label: 'Bank Details',
    icon: 'stepBank',
    activeIcon: 'stepBankActive',
  },
  {
    id: 3,
    label: 'Upload Documents',
    icon: 'stepDocuments',
    activeIcon: 'stepDocumentsActive',
  },
];

const DOCUMENT_UPLOAD_DEFS = [
  {id: 'national-id', title: 'National ID copy'},
  {id: 'driving-license', title: 'Driving license'},
  {id: 'employment-contract', title: 'Employment contract'},
  {id: 'educational', title: 'Educational certificates'},
  {id: 'bank-details', title: 'Bank details'},
  {id: 'other', title: 'Other documents'},
];

const INITIAL_FORM: AddEmployeeForm = {
  employeeCode: '',
  nationalId: '',
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  city: '',
  emergencyContact: '',
  address: '',
  createLogin: true,
  role: '',
  password: '',
  designation: '',
  department: '',
  joiningDate: '',
  employmentType: '',
  basicSalary: '',
  allowances: '',
  employmentStatus: '',
  bankName: '',
  accountTitle: '',
  accountNumber: '',
  iban: '',
};

function appendField(
  formData: FormData,
  key: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  formData.append(key, String(value));
}

export function useAddEmployeeController(): AddEmployeeController {
  const navigation = useNavigation<Nav>();
  const [currentStep, setCurrentStep] = useState<AddEmployeeStepId>(0);
  const [form, setForm] = useState<AddEmployeeForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState<PickedMedia | null>(null);
  const [documents, setDocuments] = useState<Record<string, PickedMedia>>({});

  const setField = useCallback(
    <K extends keyof AddEmployeeForm>(key: K, value: AddEmployeeForm[K]) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === 3;

  const documentUploads: DocumentUploadItem[] = useMemo(
    () =>
      DOCUMENT_UPLOAD_DEFS.map(item => ({
        ...item,
        fileName: documents[item.id]?.name ?? null,
      })),
    [documents],
  );

  const submitStaff = useCallback(async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      appendField(formData, 'first_name', form.firstName);
      appendField(formData, 'last_name', form.lastName);
      appendField(formData, 'gender', mapGender(form.gender));
      appendField(formData, 'dob', toIsoDate(form.dateOfBirth));
      appendField(formData, 'national_id', form.nationalId);
      appendField(formData, 'phone', form.phone);
      appendField(formData, 'email', form.email);
      appendField(formData, 'address', form.address);
      appendField(formData, 'city', form.city);
      appendField(formData, 'emergency_contact', form.emergencyContact);
      appendField(formData, 'designation', form.designation);
      appendField(formData, 'department', form.department);
      appendField(formData, 'joining_date', toIsoDate(form.joiningDate));
      appendField(
        formData,
        'employment_type',
        mapEmploymentType(form.employmentType),
      );
      appendField(formData, 'basic_salary', parseMoneyInput(form.basicSalary));
      appendField(formData, 'allowances', parseMoneyInput(form.allowances));
      appendField(formData, 'bank_name', form.bankName);
      appendField(
        formData,
        'bank_account',
        form.accountNumber || form.iban,
      );
      appendField(
        formData,
        'status',
        mapStaffStatus(form.employmentStatus) || 'active',
      );
      if (photo) {
        appendMediaToFormData(formData, 'photo', photo);
      }

      const created = await staffManagementStaffService.createStaff(formData);
      const staff = asRecord(unwrapData(created));
      const staffIdRaw = staff.id ?? staff.staff_id;
      const staffId =
        staffIdRaw != null && staffIdRaw !== ''
          ? String(staffIdRaw)
          : '';

      if (staffId) {
        if (photo) {
          try {
            await staffManagementStaffService.uploadPhoto(
              staffId,
              createMediaFormData('photo', photo),
            );
          } catch {
            // Staff created; photo may already be on create payload
          }
        }
        const docEntries = Object.entries(documents);
        for (const [type, media] of docEntries) {
          try {
            await staffManagementStaffService.uploadDocuments(
              staffId,
              createMediaFormData('document', media, {type}),
            );
          } catch {
            // Continue remaining docs if one fails
          }
        }
      }

      showMessage({
        message: 'Employee added successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to add employee'),
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  }, [documents, form, navigation, photo, submitting]);

  const onNextPress = useCallback(() => {
    if (isLastStep) {
      submitStaff();
      return;
    }
    setCurrentStep(prev => (prev + 1) as AddEmployeeStepId);
  }, [isLastStep, submitStaff]);

  const onPreviousPress = useCallback(() => {
    if (!canGoPrevious) {
      return;
    }
    setCurrentStep(prev => (prev - 1) as AddEmployeeStepId);
  }, [canGoPrevious]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSaveDraftPress = useCallback(() => {}, []);

  const onUploadPhotoPress = useCallback(async () => {
    const media = await pickFromGallery();
    if (!media) {
      return;
    }
    setPhoto(media);
    showMessage({message: 'Photo selected', type: 'success'});
  }, []);

  const onDocumentUploadPress = useCallback(
    async (item: DocumentUploadItem) => {
      const media = await pickFromGallery();
      if (!media) {
        return;
      }
      setDocuments(prev => ({...prev, [item.id]: media}));
      showMessage({message: `${item.title} selected`, type: 'success'});
    },
    [],
  );

  return useMemo(
    () => ({
      userName: 'Ali',
      dateLabel: 'Mon, Jul 13',
      currentStep,
      steps: STEPS,
      form,
      photoUri: photo?.uri ?? null,
      documentUploads,
      canGoPrevious,
      isLastStep,
      submitting,
      setField,
      onNextPress,
      onPreviousPress,
      onBackPress,
      onCancelPress,
      onSaveDraftPress,
      onUploadPhotoPress,
      onDocumentUploadPress,
    }),
    [
      currentStep,
      form,
      photo?.uri,
      documentUploads,
      canGoPrevious,
      isLastStep,
      submitting,
      setField,
      onNextPress,
      onPreviousPress,
      onBackPress,
      onCancelPress,
      onSaveDraftPress,
      onUploadPhotoPress,
      onDocumentUploadPress,
    ],
  );
}
