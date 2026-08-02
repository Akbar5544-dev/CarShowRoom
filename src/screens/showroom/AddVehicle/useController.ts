import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {VehicleWizardStep} from '../../../components/VehicleWizardStepper';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {
  vehicleManagementCategoriesService,
  vehicleManagementVehiclesService,
} from '../../../services';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchVehicles, invalidateVehicles} from '../../../store/dataCacheSlice';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import {
  appendMediaToFormData,
  asRecord,
  createMediaFormData,
  formatCount,
  formatMoney,
  fuelTypeLabel,
  mapFuelType,
  mapTransmission,
  mapVehicleStatus,
  parseMoneyInput,
  pickFromGallery,
  unwrapData,
  unwrapList,
  type PickedMedia,
} from '../../../utils';
import type {
  AddVehicleController,
  AddVehicleForm,
  AddVehicleStepId,
} from './module';

type Nav = NativeStackNavigationProp<VehiclesStackParamList, 'AddVehicle'>;

const STEPS: VehicleWizardStep[] = [
  {id: 0, label: 'Basic Info'},
  {id: 1, label: 'Technical'},
  {id: 2, label: 'Pricing'},
  {id: 3, label: 'Insurance'},
  {id: 4, label: 'Images'},
  {id: 5, label: 'Review'},
];

const STEP_TITLES = [
  'Basic Vehicle Information',
  'Technical Specifications',
  'Rental Pricing & Deposit',
  'Insurance & Legal Records',
  'Vehicle Images & Documents',
  'Review & Publish',
];

const STEP_DESCRIPTIONS: Record<number, string | undefined> = {
  4: 'Add showroom images, inspection photos and supporting documents.',
  5: 'Confirm the vehicle profile before adding it to active inventory.',
};

const CATEGORIES = ['Executive', 'Luxury', 'SUV', 'Sedan', 'Sports', 'Electric'];
const IMAGE_SLOTS = [
  {id: 'front', title: 'Front exterior'},
  {id: 'rear', title: 'Rear exterior'},
  {id: 'interior', title: 'Interior cockpit'},
  {id: 'dashboard', title: 'Dashboard odometer'},
  {id: 'damage', title: 'Damage marks'},
  {id: 'gallery', title: 'Gallery images'},
];

const INITIAL_FORM: AddVehicleForm = {
  vehicleCode: '',
  registrationPlate: '',
  make: '',
  model: '',
  year: '',
  category: '',
  branch: '',
  status: '',
  description: '',
  engineType: '',
  horsepower: '',
  transmission: '',
  driveType: '',
  fuelType: '',
  batteryTank: '',
  seats: '',
  doors: '',
  mileage: '',
  color: '',
  dailyRate: '',
  weeklyRate: '',
  monthlyRate: '',
  securityDeposit: '',
  extraKmCharge: '',
  lateReturnFee: '',
  insuranceProvider: '',
  policyNumber: '',
  coverageType: '',
  insuranceExpiry: '',
  registrationExpiry: '',
  ownership: '',
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

export function useAddVehicleController(): AddVehicleController {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const vehiclesCache = useAppSelector(state => state.dataCache.vehicles);
  const [currentStep, setCurrentStep] = useState<AddVehicleStepId>(0);
  const [form, setForm] = useState<AddVehicleForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [specSheet, setSpecSheet] = useState<PickedMedia | null>(null);
  const [insuranceDoc, setInsuranceDoc] = useState<PickedMedia | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<PickedMedia | null>(null);
  const [images, setImages] = useState<Record<string, PickedMedia>>({});

  const fetchVehiclesData = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchVehicles(options));
    },
    [dispatch],
  );
  useSmartFocusFetch(vehiclesCache.meta.fetchedAt, fetchVehiclesData);

  const summary = useMemo(() => {
    const total = vehiclesCache.inventory.length;
    const available = vehiclesCache.inventory.filter(
      item => item.status === 'Available',
    ).length;
    const cats = new Set(
      vehiclesCache.inventory.map(item => item.make).filter(Boolean),
    ).size;
    return `${formatCount(total || 0)} vehicles across ${
      cats || 1
    } categories · ${formatCount(available)} available now`;
  }, [vehiclesCache.inventory]);

  useEffect(() => {
    vehicleManagementCategoriesService
      .listCategories({per_page: 20})
      .then(res => {
        const names = unwrapList(res)
          .map(item => {
            const row = asRecord(item);
            return String(row.name ?? row.title ?? '').trim();
          })
          .filter(Boolean);
        if (names.length) {
          setCategories(names);
        }
      })
      .catch(() => {});
  }, []);

  const setField = useCallback(
    <K extends keyof AddVehicleForm>(key: K, value: AddVehicleForm[K]) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === 5;

  const imageUploads = useMemo(
    () =>
      IMAGE_SLOTS.map(slot => ({
        id: slot.id,
        title: slot.title,
        fileName: images[slot.id]?.name ?? null,
      })),
    [images],
  );

  const reviewFields = useMemo(
    () => [
      {
        label: 'VEHICLE',
        value: `${form.make} ${form.model}`.trim(),
      },
      {
        label: 'CLASS',
        value: `${form.category} ${fuelTypeLabel(form.fuelType)}`.trim(),
      },
      {label: 'PLATE', value: form.registrationPlate},
      {label: 'DAILY RATE', value: form.dailyRate},
      {label: 'DEPOSIT', value: form.securityDeposit},
      {label: 'INSURANCE', value: form.coverageType},
    ],
    [form],
  );

  const submitVehicle = useCallback(async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      appendField(formData, 'stock_no', form.vehicleCode);
      appendField(formData, 'registration_no', form.registrationPlate);
      appendField(formData, 'make', form.make);
      appendField(formData, 'model', form.model);
      appendField(formData, 'year', form.year);
      appendField(formData, 'category_name', form.category);
      appendField(formData, 'branch', form.branch);
      appendField(formData, 'status', mapVehicleStatus(form.status));
      appendField(formData, 'usage_type', 'both');
      appendField(formData, 'condition', 'used');
      appendField(formData, 'description', form.description);
      appendField(formData, 'engine_type', form.engineType);
      appendField(formData, 'horsepower', form.horsepower);
      appendField(formData, 'transmission', mapTransmission(form.transmission));
      appendField(formData, 'drive_type', form.driveType);
      appendField(formData, 'fuel_type', mapFuelType(form.fuelType));
      appendField(formData, 'battery_capacity', form.batteryTank);
      appendField(formData, 'seating_capacity', form.seats);
      appendField(formData, 'doors', form.doors);
      appendField(formData, 'mileage', form.mileage);
      appendField(formData, 'color', form.color);
      appendField(
        formData,
        'rental_daily_rate',
        parseMoneyInput(form.dailyRate),
      );
      appendField(formData, 'weekly_rate', parseMoneyInput(form.weeklyRate));
      appendField(formData, 'monthly_rate', parseMoneyInput(form.monthlyRate));
      appendField(
        formData,
        'security_deposit',
        parseMoneyInput(form.securityDeposit),
      );
      appendField(
        formData,
        'extra_km_charge',
        parseMoneyInput(form.extraKmCharge),
      );
      appendField(
        formData,
        'late_return_fee',
        parseMoneyInput(form.lateReturnFee),
      );
      appendField(formData, 'insurance_provider', form.insuranceProvider);
      appendField(formData, 'policy_number', form.policyNumber);
      appendField(formData, 'coverage_type', form.coverageType);
      appendField(formData, 'insurance_expiry', form.insuranceExpiry);
      appendField(formData, 'registration_expiry', form.registrationExpiry);
      appendField(formData, 'ownership', form.ownership);

      if (specSheet) {
        appendMediaToFormData(formData, 'spec_sheet', specSheet);
      }

      const created = await vehicleManagementVehiclesService.createVehicles(
        formData,
      );
      const vehicle = asRecord(unwrapData(created));
      const vehicleId = String(vehicle.id ?? '');

      if (vehicleId) {
        const imageEntries = Object.entries(images);
        for (const [, media] of imageEntries) {
          try {
            await vehicleManagementVehiclesService.uploadImages(
              vehicleId,
              createMediaFormData('image', media),
            );
          } catch {
            // continue
          }
        }
        if (insuranceDoc) {
          try {
            await vehicleManagementVehiclesService.uploadDocuments(
              vehicleId,
              createMediaFormData('document', insuranceDoc, {
                type: 'insurance',
              }),
            );
          } catch {
            // continue
          }
        }
        if (registrationDoc) {
          try {
            await vehicleManagementVehiclesService.uploadDocuments(
              vehicleId,
              createMediaFormData('document', registrationDoc, {
                type: 'registration',
              }),
            );
          } catch {
            // continue
          }
        }
      }

      showMessage({message: 'Vehicle added successfully', type: 'success'});
      dispatch(invalidateVehicles());
      navigation.navigate('VehicleList');
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to add vehicle'),
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    dispatch,
    form,
    images,
    insuranceDoc,
    navigation,
    registrationDoc,
    specSheet,
    submitting,
  ]);

  const onNextPress = useCallback(() => {
    if (isLastStep) {
      submitVehicle();
      return;
    }
    setCurrentStep(prev => (prev + 1) as AddVehicleStepId);
  }, [isLastStep, submitVehicle]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPreviousPress = useCallback(() => {
    if (currentStep === 0) {
      navigation.goBack();
      return;
    }
    setCurrentStep(prev => (prev - 1) as AddVehicleStepId);
  }, [currentStep, navigation]);

  const onStepPress = useCallback((stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId as AddVehicleStepId);
    }
  }, [currentStep]);

  const pickMedia = useCallback(async (label: string) => {
    const media = await pickFromGallery();
    if (!media) {
      return null;
    }
    showMessage({message: `${label} selected`, type: 'success'});
    return media;
  }, []);

  const onSpecSheetPress = useCallback(async () => {
    const media = await pickMedia('Spec sheet');
    if (media) {
      setSpecSheet(media);
    }
  }, [pickMedia]);

  const onInsuranceDocPress = useCallback(async () => {
    const media = await pickMedia('Insurance certificate');
    if (media) {
      setInsuranceDoc(media);
    }
  }, [pickMedia]);

  const onRegistrationDocPress = useCallback(async () => {
    const media = await pickMedia('Registration card');
    if (media) {
      setRegistrationDoc(media);
    }
  }, [pickMedia]);

  const onImageUploadPress = useCallback(
    async (id: string) => {
      const slot = IMAGE_SLOTS.find(item => item.id === id);
      const media = await pickMedia(slot?.title ?? 'Image');
      if (media) {
        setImages(prev => ({...prev, [id]: media}));
      }
    },
    [pickMedia],
  );

  return {
    summary,
    currentStep,
    steps: STEPS,
    stepTitle: STEP_TITLES[currentStep],
    stepDescription: STEP_DESCRIPTIONS[currentStep],
    form,
    canGoPrevious,
    isLastStep,
    submitting,
    reviewFields,
    specSheetName: specSheet?.name ?? null,
    insuranceDocName: insuranceDoc?.name ?? null,
    registrationDocName: registrationDoc?.name ?? null,
    imageUploads,
    categoryOptions: categories,
    setField,
    onNextPress,
    onPreviousPress,
    onBackPress,
    onStepPress,
    onSpecSheetPress,
    onInsuranceDocPress,
    onRegistrationDocPress,
    onImageUploadPress,
  };
}
