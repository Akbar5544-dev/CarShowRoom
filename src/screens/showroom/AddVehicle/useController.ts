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
  buildFieldErrors,
  clearFieldError,
  createMediaFormData,
  formatCount,
  formatMoney,
  fuelTypeLabel,
  hasFieldErrors,
  mapFuelType,
  mapTransmission,
  mapVehicleStatus,
  parseMoneyInput,
  pickMultipleFromGallery,
  formatMediaSelectionLabel,
  unwrapData,
  unwrapList,
  type FieldErrors,
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
  weekendSurge: false,
  vipDiscount: false,
  taxInclusive: false,
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [specSheet, setSpecSheet] = useState<PickedMedia[]>([]);
  const [insuranceDoc, setInsuranceDoc] = useState<PickedMedia[]>([]);
  const [registrationDoc, setRegistrationDoc] = useState<PickedMedia[]>([]);
  const [images, setImages] = useState<Record<string, PickedMedia[]>>({});

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
      setFieldErrors(prev => clearFieldError(prev, key));
    },
    [],
  );

  const togglePricingFlag = useCallback(
    (key: 'weekendSurge' | 'vipDiscount' | 'taxInclusive') => {
      setForm(prev => ({...prev, [key]: !prev[key]}));
    },
    [],
  );

  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === 5;

  const validateStep = useCallback(
    (step: AddVehicleStepId): boolean => {
      let errors: FieldErrors = {};
      if (step === 0) {
        errors = buildFieldErrors([
          {key: 'make', value: form.make, label: 'Make'},
          {key: 'model', value: form.model, label: 'Model'},
          {key: 'year', value: form.year, label: 'Year'},
        ]);
        if (!errors.year && form.year.trim()) {
          const yearNum = Number(form.year.trim());
          if (
            !Number.isFinite(yearNum) ||
            yearNum < 1900 ||
            yearNum > 2100
          ) {
            errors.year = 'Enter a valid year';
          }
        }
      } else if (step === 2) {
        errors = buildFieldErrors([
          {key: 'dailyRate', value: form.dailyRate, label: 'Daily rate'},
        ]);
      }
      setFieldErrors(errors);
      return !hasFieldErrors(errors);
    },
    [form],
  );

  const imageUploads = useMemo(
    () =>
      IMAGE_SLOTS.map(slot => {
        const slotImages = images[slot.id] ?? [];
        const count = slotImages.length;
        let fileName: string | null = null;
        if (count === 1) {
          fileName = slotImages[0].name;
        } else if (count > 1) {
          fileName = `${count} photos selected`;
        }
        return {
          id: slot.id,
          title: slot.title,
          fileName,
          count,
        };
      }),
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
      {
        label: 'PRICING FLAGS',
        value: [
          form.weekendSurge ? 'Weekend surge 12%' : null,
          form.vipDiscount ? 'VIP discount' : null,
          form.taxInclusive ? 'Tax inclusive' : null,
        ]
          .filter(Boolean)
          .join(' · ') || 'None',
      },
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
      if (form.weekendSurge) {
        formData.append('features[]', 'Weekend surge 12%');
        appendField(formData, 'weekend_surge', 1);
        appendField(formData, 'weekend_surge_percent', 12);
      }
      if (form.vipDiscount) {
        formData.append('features[]', 'VIP discount');
        appendField(formData, 'vip_discount', 1);
      }
      if (form.taxInclusive) {
        formData.append('features[]', 'Tax inclusive');
        appendField(formData, 'tax_inclusive', 1);
      }
      appendField(formData, 'insurance_provider', form.insuranceProvider);
      appendField(formData, 'policy_number', form.policyNumber);
      appendField(formData, 'coverage_type', form.coverageType);
      appendField(formData, 'insurance_expiry', form.insuranceExpiry);
      appendField(formData, 'registration_expiry', form.registrationExpiry);
      appendField(formData, 'ownership', form.ownership);

      if (specSheet.length) {
        appendMediaToFormData(formData, 'spec_sheet', specSheet[0]);
      }

      const created = await vehicleManagementVehiclesService.createVehicles(
        formData,
      );
      const vehicle = asRecord(unwrapData(created));
      const vehicleId = String(vehicle.id ?? '');

      if (vehicleId) {
        const imageEntries = Object.entries(images);
        for (const [, mediaList] of imageEntries) {
          for (const media of mediaList) {
            try {
              await vehicleManagementVehiclesService.uploadImages(
                vehicleId,
                createMediaFormData('image', media),
              );
            } catch {
              // continue
            }
          }
        }
        if (insuranceDoc.length) {
          for (const media of insuranceDoc) {
            try {
              await vehicleManagementVehiclesService.uploadDocuments(
                vehicleId,
                createMediaFormData('document', media, {
                  type: 'insurance',
                }),
              );
            } catch {
              // continue
            }
          }
        }
        if (registrationDoc.length) {
          for (const media of registrationDoc) {
            try {
              await vehicleManagementVehiclesService.uploadDocuments(
                vehicleId,
                createMediaFormData('document', media, {
                  type: 'registration',
                }),
              );
            } catch {
              // continue
            }
          }
        }
        if (specSheet.length > 1) {
          for (const media of specSheet.slice(1)) {
            try {
              await vehicleManagementVehiclesService.uploadDocuments(
                vehicleId,
                createMediaFormData('document', media, {
                  type: 'spec_sheet',
                }),
              );
            } catch {
              // continue
            }
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
      if (!validateStep(0)) {
        setCurrentStep(0);
        return;
      }
      if (!validateStep(2)) {
        setCurrentStep(2);
        return;
      }
      submitVehicle();
      return;
    }
    if (!validateStep(currentStep)) {
      return;
    }
    setFieldErrors({});
    setCurrentStep(prev => (prev + 1) as AddVehicleStepId);
  }, [currentStep, isLastStep, submitVehicle, validateStep]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPreviousPress = useCallback(() => {
    if (currentStep === 0) {
      navigation.goBack();
      return;
    }
    setFieldErrors({});
    setCurrentStep(prev => (prev - 1) as AddVehicleStepId);
  }, [currentStep, navigation]);

  const onStepPress = useCallback((stepId: number) => {
    if (stepId <= currentStep) {
      setFieldErrors({});
      setCurrentStep(stepId as AddVehicleStepId);
    }
  }, [currentStep]);

  const pickMediaList = useCallback(async (label: string) => {
    const media = await pickMultipleFromGallery();
    if (!media.length) {
      return [];
    }
    showMessage({
      message: `${media.length} file${media.length === 1 ? '' : 's'} selected for ${label}`,
      type: 'success',
    });
    return media;
  }, []);

  const onSpecSheetPress = useCallback(async () => {
    const media = await pickMediaList('Spec sheet');
    if (media.length) {
      setSpecSheet(prev => [...prev, ...media]);
    }
  }, [pickMediaList]);

  const onInsuranceDocPress = useCallback(async () => {
    const media = await pickMediaList('Insurance certificate');
    if (media.length) {
      setInsuranceDoc(prev => [...prev, ...media]);
    }
  }, [pickMediaList]);

  const onRegistrationDocPress = useCallback(async () => {
    const media = await pickMediaList('Registration card');
    if (media.length) {
      setRegistrationDoc(prev => [...prev, ...media]);
    }
  }, [pickMediaList]);

  const onImageUploadPress = useCallback(
    async (id: string) => {
      const slot = IMAGE_SLOTS.find(item => item.id === id);
      const picked = await pickMultipleFromGallery();
      if (!picked.length) {
        return;
      }
      setImages(prev => ({
        ...prev,
        [id]: [...(prev[id] ?? []), ...picked],
      }));
      showMessage({
        message: `${picked.length} photo${picked.length === 1 ? '' : 's'} added to ${
          slot?.title ?? 'slot'
        }`,
        type: 'success',
      });
    },
    [],
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
    specSheetName: formatMediaSelectionLabel(specSheet),
    insuranceDocName: formatMediaSelectionLabel(insuranceDoc),
    registrationDocName: formatMediaSelectionLabel(registrationDoc),
    imageUploads,
    categoryOptions: categories,
    setField,
    fieldErrors,
    togglePricingFlag,
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
