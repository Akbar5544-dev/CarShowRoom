import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {RentalWizardStep} from '../../../components/RentalWizardStepper';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {vehicleRentalRentalsService} from '../../../services';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {
  fetchCustomers,
  invalidateRentals,
  invalidateVehicles,
} from '../../../store/dataCacheSlice';
import {
  formatMoney,
  parseRentalDateTime,
  rentalDurationDays,
} from '../../../utils';
import type {
  RentalCustomer,
  RentalPaymentMethod,
  RentalReviewField,
  RentalVehicleController,
  RentalVehicleForm,
  RentalVehicleRouteParams,
  RentalVehicleStepId,
} from './module';

type Nav = NativeStackNavigationProp<VehiclesStackParamList, 'RentalVehicle'>;
type Route = RouteProp<VehiclesStackParamList, 'RentalVehicle'>;

const STEPS: RentalWizardStep[] = [
  {id: 0, label: 'Add-ons', icon: 'gift'},
  {id: 1, label: 'Insurance', icon: 'documentFile'},
  {id: 2, label: 'Confirm', icon: 'activityCheck'},
];

const STEP_TITLES = ['Add-ons', 'Insurance', 'Review & Confirm'];

const STEP_DESCRIPTIONS = [
  'Optional extras to enhance the trip.',
  'Pick a coverage level for this trip.',
  'Please verify the details before finalizing.',
];

function defaultRentalDates() {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 1);
  const toIso = (date: Date) => date.toISOString().slice(0, 10);
  return {
    pickupDateTime: toIso(start),
    returnDateTime: toIso(end),
  };
}

const MOCK_CUSTOMERS_FALLBACK: RentalCustomer[] = [
  {
    id: '1',
    code: 'C-0421',
    name: 'Ayesha Khan',
    phone: '+92 300 441 2290',
    licenseNo: 'LHR-9931',
    licenseInfo: 'PK-DL-88210 · 12 trips',
    tier: 'Gold',
  },
  {
    id: '2',
    code: 'C-0387',
    name: 'Daniel Weiss',
    phone: '+49 151 882 4410',
    licenseNo: 'DE-B-99221',
    licenseInfo: 'DE-B-99221 · 28 trips',
    tier: 'Platinum',
  },
  {
    id: '3',
    code: 'C-0512',
    name: 'Sara Ahmed',
    phone: '+971 50 221 8890',
    licenseNo: 'AE-DL-44102',
    licenseInfo: 'AE-DL-44102 · 6 trips',
    tier: 'Silver',
  },
  {
    id: '4',
    code: 'C-0299',
    name: 'Omar Farid',
    phone: '+92 321 990 1122',
    licenseNo: 'PK-DL-77102',
    licenseInfo: 'PK-DL-77102 · 19 trips',
    tier: 'Gold',
  },
];

const ADDONS = [
  {
    id: 'gps',
    title: 'GPS Navigation',
    description: 'Turn-by-turn premium routing',
    dailyRate: '$8',
  },
  {
    id: 'child-seat',
    title: 'Child Seat',
    description: 'ISOFIX certified, 0-4 yrs',
    dailyRate: '$6',
  },
  {
    id: 'driver',
    title: 'Additional Driver',
    description: 'Add a second licensed driver',
    dailyRate: '$12',
  },
  {
    id: 'roadside',
    title: 'Roadside Assistance',
    description: '24/7 nationwide response',
    dailyRate: '$5',
  },
  {
    id: 'wifi',
    title: 'In-car Wi-Fi',
    description: '5G hotspot, 20GB / day',
    dailyRate: '$4',
  },
  {
    id: 'chauffeur',
    title: 'Chauffeur Service',
    description: 'Uniformed professional driver',
    dailyRate: '$40',
  },
];

const INSURANCE_OPTIONS = [
  {
    id: 'basic',
    title: 'Basic Cover',
    description: 'Third-party liability',
    dailyRate: '$15',
  },
  {
    id: 'standard',
    title: 'Standard Cover',
    description: 'Collision + theft protection',
    dailyRate: '$30',
    popular: true,
  },
  {
    id: 'zero',
    title: 'Zero-Excess',
    description: 'Full cover, no deductible',
    dailyRate: '$55',
  },
];

const PAYMENT_METHODS = [
  {id: 'card' as const, label: 'Credit / Debit Card', icon: 'stepBank' as const},
  {id: 'cash' as const, label: 'Cash', icon: 'activityDollar' as const},
  {id: 'bank' as const, label: 'Bank Transfer', icon: 'building' as const},
];

const INITIAL_FORM: RentalVehicleForm = {
  ...defaultRentalDates(),
  pickupLocation: '',
  dropoffLocation: '',
  cardNumber: '',
  cardholder: '',
  cardExpiry: '',
  cardCvc: '',
  internalNotes: '',
};

const TAX_RATE = 0.18;

function parseDailyRate(value: string): number {
  const num = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

export function customerTierStyle(tier: RentalCustomer['tier']) {
  switch (tier) {
    case 'Platinum':
      return {bg: 'rgba(139,92,246,0.12)', color: '#7C3AED'};
    case 'Silver':
      return {bg: 'rgba(100,116,139,0.12)', color: '#64748B'};
    default:
      return {bg: 'rgba(245,158,11,0.14)', color: '#D97706'};
  }
}

export function useRentalVehicleController(): RentalVehicleController {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const params = route.params as RentalVehicleRouteParams;
  const dispatch = useAppDispatch();
  const customersCache = useAppSelector(state => state.dataCache.customers);

  const [currentStep, setCurrentStep] = useState<RentalVehicleStepId>(0);
  const [form, setForm] = useState<RentalVehicleForm>(INITIAL_FORM);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState('standard');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<RentalPaymentMethod['id']>('card');

  const fetchCustomersData = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchCustomers(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(customersCache.meta.fetchedAt, fetchCustomersData);

  const customers = useMemo<RentalCustomer[]>(() => {
    if (customersCache.items.length) {
      return customersCache.items;
    }
    return MOCK_CUSTOMERS_FALLBACK;
  }, [customersCache.items]);

  useEffect(() => {
    if (!selectedCustomerId && customers[0]) {
      setSelectedCustomerId(customers[0].id);
      setForm(prev => ({...prev, cardholder: customers[0].name}));
    }
  }, [customers, selectedCustomerId]);

  const durationDays = useMemo(
    () => rentalDurationDays(form.pickupDateTime, form.returnDateTime),
    [form.pickupDateTime, form.returnDateTime],
  );
  const dailyRateValue = parseDailyRate(params.dailyRate);

  const vehicle = useMemo(
    () => ({
      title: [params.make, params.model].filter(Boolean).join(' '),
      subtitle: [
        params.color || 'Alpine White',
        params.horsepower ? `${params.horsepower} hp` : null,
        params.fuelType,
        params.plateNo ? `Reg ${params.plateNo}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      fuelType: params.fuelType,
      transmission: params.transmission,
      seats: params.seats,
      mileageLabel: params.mileageLabel,
      rating: '4.9',
      dailyRate: params.dailyRate,
      durationLabel: `${durationDays} days selected`,
      imageUri: params.imageUri,
      imageTint: params.imageTint,
    }),
    [durationDays, params],
  );

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    if (!query) {
      return customers;
    }
    return customers.filter(
      customer =>
        customer.name.toLowerCase().includes(query) ||
        customer.code.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query),
    );
  }, [customerSearch, customers]);

  const selectedCustomer = useMemo(
    () => customers.find(customer => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  const selectedInsurance = useMemo(
    () =>
      INSURANCE_OPTIONS.find(option => option.id === selectedInsuranceId) ??
      INSURANCE_OPTIONS[1],
    [selectedInsuranceId],
  );

  const selectedAddons = useMemo(
    () => ADDONS.filter(addon => selectedAddonIds.includes(addon.id)),
    [selectedAddonIds],
  );

  const baseRentalAmount = dailyRateValue * durationDays;
  const addonsAmount = selectedAddons.reduce(
    (sum, addon) => sum + parseDailyRate(addon.dailyRate) * durationDays,
    0,
  );
  const insuranceAmount =
    parseDailyRate(selectedInsurance.dailyRate) * durationDays;
  const subtotal = baseRentalAmount + addonsAmount + insuranceAmount;
  const taxAmount = Math.round(subtotal * TAX_RATE);
  const totalAmount = subtotal + taxAmount;

  const baseRentalLine = `Base rental (${durationDays}d × ${formatMoney(dailyRateValue)})`;
  const baseRentalTotal = formatMoney(baseRentalAmount);
  const addonsTotal = formatMoney(addonsAmount);
  const insuranceLine = `Insurance (${selectedInsurance.title.replace(' Cover', '')})`;
  const insuranceTotal = formatMoney(insuranceAmount);
  const taxTotal = formatMoney(taxAmount);
  const grandTotal = formatMoney(totalAmount);

  const paymentMethodLabel = useMemo(() => {
    switch (selectedPaymentMethodId) {
      case 'cash':
        return 'CASH';
      case 'bank':
        return 'BANK TRANSFER';
      default:
        return 'CARD';
    }
  }, [selectedPaymentMethodId]);

  const reviewFields = useMemo<RentalReviewField[]>(
    () => [
      {
        label: 'Customer',
        value: selectedCustomer
          ? `${selectedCustomer.name} · ${selectedCustomer.code}`
          : '—',
      },
      {
        label: 'License',
        value: selectedCustomer?.licenseNo ?? '—',
      },
      {
        label: 'Pickup',
        value: `${form.pickupDateTime}\n${form.pickupLocation}`,
      },
      {
        label: 'Return',
        value: `${form.returnDateTime}\n${form.dropoffLocation}`,
      },
      {
        label: 'Duration',
        value: `${durationDays} days`,
      },
      {
        label: 'Vehicle',
        value: `${params.make} ${params.model} · ${params.plateNo}`,
      },
      {
        label: 'Insurance',
        value: selectedInsurance.title,
      },
      {
        label: 'Payment',
        value: paymentMethodLabel,
      },
    ],
    [
      durationDays,
      form.dropoffLocation,
      form.pickupDateTime,
      form.pickupLocation,
      form.returnDateTime,
      params.make,
      params.model,
      params.plateNo,
      paymentMethodLabel,
      selectedCustomer,
      selectedInsurance.title,
    ],
  );

  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === 2;

  const setField = useCallback(
    <K extends keyof RentalVehicleForm>(key: K, value: RentalVehicleForm[K]) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const onSelectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = customers.find(item => item.id === customerId);
    if (customer) {
      setForm(prev => ({...prev, cardholder: customer.name}));
    }
  }, [customers]);

  const onToggleAddon = useCallback((addonId: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId],
    );
  }, []);

  const onSelectInsurance = useCallback((insuranceId: string) => {
    setSelectedInsuranceId(insuranceId);
  }, []);

  const onSelectPaymentMethod = useCallback(
    (methodId: RentalPaymentMethod['id']) => {
      setSelectedPaymentMethodId(methodId);
    },
    [],
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPreviousPress = useCallback(() => {
    if (currentStep === 0) {
      navigation.goBack();
      return;
    }
    setCurrentStep(prev => (prev - 1) as RentalVehicleStepId);
  }, [currentStep, navigation]);

  const submitRental = useCallback(async () => {
    if (submitting) {
      return;
    }
    if (!selectedCustomerId) {
      showMessage({
        message: 'No customer available for this rental',
        type: 'warning',
      });
      return;
    }
    if (!params.vehicleId) {
      showMessage({message: 'Vehicle is missing', type: 'danger'});
      return;
    }

    const startDate =
      parseRentalDateTime(form.pickupDateTime) ||
      parseRentalDateTime(defaultRentalDates().pickupDateTime);
    const endDate =
      parseRentalDateTime(form.returnDateTime) ||
      parseRentalDateTime(defaultRentalDates().returnDateTime);
    if (!startDate || !endDate) {
      showMessage({
        message: 'Could not resolve rental dates',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    try {
      const rentalPayload: Record<string, unknown> = {
        vehicle_id: params.vehicleId,
        customer_id: selectedCustomerId,
        start_date: startDate,
        expected_return_date: endDate,
        daily_rate: dailyRateValue,
        pickup_location: form.pickupLocation,
        dropoff_location: form.dropoffLocation,
        driver_option: 'self',
        payment_method: selectedPaymentMethodId,
        notes: form.internalNotes.trim() || undefined,
        insurance_plan: selectedInsuranceId,
        addons: selectedAddonIds,
      };

      await vehicleRentalRentalsService.createRentals(rentalPayload);
      dispatch(invalidateRentals());
      dispatch(invalidateVehicles());
      showMessage({
        message: 'Rental booking created successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to create rental'),
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    dailyRateValue,
    dispatch,
    form.dropoffLocation,
    form.internalNotes,
    form.pickupDateTime,
    form.pickupLocation,
    form.returnDateTime,
    navigation,
    params.vehicleId,
    selectedAddonIds,
    selectedCustomerId,
    selectedInsuranceId,
    selectedPaymentMethodId,
    submitting,
  ]);

  const onNextPress = useCallback(() => {
    if (isLastStep) {
      if (!selectedCustomerId) {
        showMessage({
          message: 'No customer available for this rental',
          type: 'warning',
        });
        return;
      }
      if (!params.vehicleId) {
        showMessage({message: 'Vehicle is missing', type: 'danger'});
        return;
      }
      const startDate =
        parseRentalDateTime(form.pickupDateTime) ||
        parseRentalDateTime(defaultRentalDates().pickupDateTime);
      const endDate =
        parseRentalDateTime(form.returnDateTime) ||
        parseRentalDateTime(defaultRentalDates().returnDateTime);
      if (!startDate || !endDate) {
        showMessage({
          message: 'Could not resolve rental dates',
          type: 'warning',
        });
        return;
      }
      if (!(dailyRateValue > 0)) {
        showMessage({
          message: 'Daily rate is required for this vehicle',
          type: 'danger',
        });
        return;
      }
      submitRental();
      return;
    }

    setCurrentStep(prev => (prev + 1) as RentalVehicleStepId);
  }, [
    dailyRateValue,
    form.pickupDateTime,
    form.returnDateTime,
    isLastStep,
    params.vehicleId,
    selectedCustomerId,
    submitRental,
  ]);

  return {
    vehicle,
    vehicleYear: params.year,
    vehiclePlateNo: params.plateNo,
    currentStep,
    steps: STEPS,
    stepTitle: STEP_TITLES[currentStep],
    stepDescription: STEP_DESCRIPTIONS[currentStep],
    form,
    customerSearch,
    customers,
    filteredCustomers,
    selectedCustomerId,
    addons: ADDONS,
    selectedAddonIds,
    selectedAddons,
    insuranceOptions: INSURANCE_OPTIONS,
    selectedInsuranceId,
    selectedInsuranceTitle: selectedInsurance.title,
    paymentMethods: PAYMENT_METHODS,
    selectedPaymentMethodId,
    paymentMethodLabel,
    dailyRateValue,
    durationDays,
    baseRentalLine,
    baseRentalTotal,
    addonsTotal,
    insuranceLine,
    insuranceTotal,
    taxTotal,
    grandTotal,
    reviewFields,
    canGoPrevious,
    isLastStep,
    submitting,
    setCustomerSearch,
    setField,
    onSelectCustomer,
    onToggleAddon,
    onSelectInsurance,
    onSelectPaymentMethod,
    onBackPress,
    onPreviousPress,
    onNextPress,
  };
}
