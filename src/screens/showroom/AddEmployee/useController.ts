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
  buildFieldErrors,
  clearFieldError,
  createMediaFormData,
  hasFieldErrors,
  mapEmploymentType,
  mapGender,
  mapStaffStatus,
  parseMoneyInput,
  pickFromGallery,
  pickMultipleFromGallery,
  toIsoDate,
  unwrapData,
  type FieldErrors,
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
  {id: 0, label: 'Personal'},
  {id: 1, label: 'Employment'},
  {id: 2, label: 'Bank'},
  {id: 3, label: 'Documents'},
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

const ROLE_API_MAP: Record<string, string> = {
  'Rental Agent': 'rental-agent',
  'Fleet Coordinator': 'fleet-manager',
  Mechanic: 'mechanic',
  'Support Lead': 'support',
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState<PickedMedia | null>(null);
  const [documents, setDocuments] = useState<Record<string, PickedMedia[]>>({});

  const setField = useCallback(
    <K extends keyof AddEmployeeForm>(key: K, value: AddEmployeeForm[K]) => {
      setForm(prev => ({...prev, [key]: value}));
      setFieldErrors(prev => clearFieldError(prev, key));
    },
    [],
  );

  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === 3;

  const documentUploads: DocumentUploadItem[] = useMemo(
    () =>
      DOCUMENT_UPLOAD_DEFS.map(item => {
        const files = documents[item.id] ?? [];
        return {
          ...item,
          fileName: files.length === 1 ? files[0].name : null,
          count: files.length > 1 ? files.length : files.length ? 1 : 0,
        };
      }),
    [documents],
  );

  const validateStep = useCallback(
    (step: AddEmployeeStepId): boolean => {
      let errors: FieldErrors = {};
      if (step === 0) {
        const checks: Array<{key: string; value: unknown; label: string}> = [
          {key: 'firstName', value: form.firstName, label: 'First name'},
        ];
        if (form.createLogin) {
          checks.push(
            {key: 'role', value: form.role, label: 'Role'},
            {key: 'password', value: form.password, label: 'Password'},
          );
        }
        errors = buildFieldErrors(checks);
        if (form.createLogin && form.password.trim() && form.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
      }
      setFieldErrors(errors);
      return !hasFieldErrors(errors);
    },
    [form],
  );

  const submitStaff = useCallback(async () => {
    if (submitting) {
      return;
    }
    if (!validateStep(0)) {
      setCurrentStep(0);
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
      if (form.createLogin) {
        formData.append('create_login', '1');
        appendField(formData, 'password', form.password);
        const roleForApi = ROLE_API_MAP[form.role] ?? form.role;
        appendField(formData, 'role', roleForApi);
      }
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
        for (const [type, mediaList] of docEntries) {
          for (const media of mediaList) {
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
  }, [documents, form, navigation, photo, submitting, validateStep]);

  const onNextPress = useCallback(() => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (isLastStep) {
      submitStaff();
      return;
    }
    setFieldErrors({});
    setCurrentStep(prev => (prev + 1) as AddEmployeeStepId);
  }, [currentStep, isLastStep, submitStaff, validateStep]);

  const onPreviousPress = useCallback(() => {
    if (!canGoPrevious) {
      return;
    }
    setFieldErrors({});
    setCurrentStep(prev => (prev - 1) as AddEmployeeStepId);
  }, [canGoPrevious]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onStepPress = useCallback(
    (stepId: number) => {
      if (stepId <= currentStep) {
        setFieldErrors({});
        setCurrentStep(stepId as AddEmployeeStepId);
      }
    },
    [currentStep],
  );

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
      const picked = await pickMultipleFromGallery();
      if (!picked.length) {
        return;
      }
      setDocuments(prev => ({
        ...prev,
        [item.id]: [...(prev[item.id] ?? []), ...picked],
      }));
      showMessage({
        message: `${picked.length} photo${picked.length === 1 ? '' : 's'} added to ${item.title}`,
        type: 'success',
      });
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
      fieldErrors,
      onNextPress,
      onPreviousPress,
      onBackPress,
      onStepPress,
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
      fieldErrors,
      onNextPress,
      onPreviousPress,
      onBackPress,
      onStepPress,
      onUploadPhotoPress,
      onDocumentUploadPress,
    ],
  );
}
