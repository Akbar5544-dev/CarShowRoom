import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {RentalsStackParamList} from '../../../navigation/types';
import {
  accountingCustomersService,
  vehicleRentalRentalsService,
} from '../../../services';
import {
  fetchCustomers,
  fetchVehicles,
  invalidateCustomers,
  invalidateRentals,
  invalidateVehicles,
} from '../../../store/dataCacheSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {
  asRecord,
  fuelTypeLabel,
  pickNumber,
  pickString,
  todayLabel,
  transmissionLabel,
  unwrapData,
} from '../../../utils/apiHelpers';
import type {
  NewRentalAddon,
  NewRentalController,
  NewRentalForm,
  NewRentalPaymentMethod,
  NewRentalPaymentMethodId,
  NewRentalPromo,
  NewRentalStep,
  NewRentalStepCopy,
  NewRentalStepId,
  NewRentalTerm,
  NewRentalVehicleOption,
} from './module';

type Nav = NativeStackNavigationProp<RentalsStackParamList, 'NewRental'>;

const STEPS: NewRentalStep[] = [
  {id: 0, label: 'Customer', icon: 'customers'},
  {id: 1, label: 'Vehicle', icon: 'vehicles'},
  {id: 2, label: 'Duration', icon: 'calendarField'},
  {id: 3, label: 'Pricing', icon: 'revenue'},
  {id: 4, label: 'Payment', icon: 'creditCard'},
  {id: 5, label: 'Agreement', icon: 'documentFile'},
];

const STEP_COPY: Record<NewRentalStepId, NewRentalStepCopy> = {
  0: {
    eyebrow: 'Customer',
    title: 'Who is renting?',
    nextLabel: 'Continue to Vehicle',
  },
  1: {
    eyebrow: 'Vehicle',
    title: 'Choose a vehicle',
    nextLabel: 'Continue to Duration',
  },
  2: {
    eyebrow: 'Duration',
    title: 'Pickup & Return',
    nextLabel: 'Continue to Pricing',
  },
  3: {
    eyebrow: 'Pricing',
    title: 'Discounts & totals',
    nextLabel: 'Continue to Insurance',
  },
  4: {
    eyebrow: 'Payment',
    title: 'How would you like to pay?',
    nextLabel: 'Continue to Agreement',
  },
  5: {
    eyebrow: 'Agreement',
    title: 'Rental agreement',
    nextLabel: 'Continue to Confirm',
  },
};

const FALLBACK_VEHICLES: NewRentalVehicleOption[] = [
  {
    id: 'demo-bmw-i5',
    title: 'BMW i5 M60 · 2026',
    segment: 'Electric · Executive',
    dailyRate: 180,
    dailyRateLabel: '$180',
    specs: [
      {icon: 'bolt', label: '561 hp'},
      {icon: 'seat', label: '5 seats'},
      {icon: 'steering', label: 'Autopilot'},
    ],
  },
  {
    id: 'demo-eqe',
    title: 'Mercedes EQE 500 · 2026',
    segment: 'Electric · Luxury',
    dailyRate: 165,
    dailyRateLabel: '$165',
    specs: [
      {icon: 'bolt', label: '402 hp'},
      {icon: 'seat', label: '5 seats'},
      {icon: 'steering', label: 'MBUX'},
    ],
  },
  {
    id: 'demo-q7',
    title: 'Audi Q7 TFSI · 2025',
    segment: 'SUV · Family',
    dailyRate: 140,
    dailyRateLabel: '$140',
    specs: [
      {icon: 'bolt', label: '335 hp'},
      {icon: 'seat', label: '7 seats'},
      {icon: 'steering', label: 'Quattro'},
    ],
  },
  {
    id: 'demo-fortuner',
    title: 'Toyota Fortuner · 2025',
    segment: 'SUV · Rugged',
    dailyRate: 95,
    dailyRateLabel: '$95',
    specs: [
      {icon: 'bolt', label: '201 hp'},
      {icon: 'seat', label: '7 seats'},
      {icon: 'steering', label: '4WD'},
    ],
  },
];

const ADDONS: NewRentalAddon[] = [
  {id: 'gps', label: 'GPS Navigation', price: 20},
  {id: 'child-seat', label: 'Child Seat', price: 15},
  {id: 'driver', label: 'Additional Driver', price: 30},
  {id: 'roadside', label: 'Roadside Assistance', price: 15},
];

const PROMOS: NewRentalPromo[] = [
  {code: 'WELCOME10', percent: 10},
  {code: 'LOYALTY5', percent: 5},
  {code: 'VIP25', percent: 25},
];

const PAYMENT_METHODS: NewRentalPaymentMethod[] = [
  {id: 'card', label: 'Credit card', icon: 'creditCard'},
  {id: 'bank', label: 'Bank transfer', icon: 'stepBank'},
  {id: 'cash', label: 'Cash at counter', icon: 'cashNote'},
];

const TERMS: NewRentalTerm[] = [
  {
    title: '1. Vehicle use',
    body: 'Renter agrees to operate the vehicle in accordance with all local traffic laws and to return it in the same condition, ordinary wear and tear excepted.',
  },
  {
    title: '2. Fuel & mileage',
    body: 'Vehicle is provided with a full tank / full charge and must be returned in the same state. Included mileage: 250 km/day; additional km at $0.35.',
  },
  {
    title: '3. Liability',
    body: 'Selected insurance tier caps renter liability as detailed on the Insurance step. Uncovered damage, tolls and traffic fines are charged to the payment method on file.',
  },
  {
    title: '4. Cancellation',
    body: 'Free cancellation up to 24 hours before pickup. Late returns billed hourly.',
  },
];

const INSURANCE_PER_DAY = 12;
const TAX_RATE = 0.18;

function money(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

function parseDateTime(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const match = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?$/i,
  );
  if (match) {
    const [, m, d, y, hh, mi, meridiem] = match;
    let hours = hh ? Number(hh) : 0;
    if (meridiem) {
      const upper = meridiem.toUpperCase();
      if (upper === 'PM' && hours < 12) {
        hours += 12;
      }
      if (upper === 'AM' && hours === 12) {
        hours = 0;
      }
    }
    return new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      hours,
      mi ? Number(mi) : 0,
    );
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIsoDay(value: string): string | undefined {
  const parsed = parseDateTime(value);
  if (!parsed) {
    return undefined;
  }
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const dd = String(parsed.getDate()).padStart(2, '0');
  return `${parsed.getFullYear()}-${mm}-${dd}`;
}

const INITIAL_FORM: NewRentalForm = {
  customerName: '',
  email: '',
  phone: '',
  license: '',
  address: '',
  pickupDate: '',
  returnDate: '',
  pickupLocation: '',
  dropoffLocation: '',
  promoCode: '',
  cardholder: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  signature: '',
};

function mapVehicleOption(item: unknown, index: number): NewRentalVehicleOption {
  const row = asRecord(item);
  const make = pickString(row, ['make'], 'Vehicle');
  const model = pickString(row, ['model'], '');
  const year = pickString(row, ['year']);
  const fuel = fuelTypeLabel(
    pickString(row, ['fuel_type', 'fuel', 'engine_type'], 'Petrol'),
  );
  const transmission = transmissionLabel(
    pickString(row, ['transmission', 'transmission_type'], 'automatic'),
  );
  const category = pickString(row, ['category_name', 'category'], transmission);
  const seats = pickNumber(row, ['seating_capacity', 'seats', 'seat_capacity']);
  const power = pickNumber(row, ['horsepower', 'engine_power', 'power']);
  const dailyRate = pickNumber(row, ['rental_daily_rate', 'daily_rate']);

  return {
    id: String(row.id ?? `vehicle-${index}`),
    title: [make, model].filter(Boolean).join(' ') + (year ? ` · ${year}` : ''),
    segment: [fuel, category].filter(Boolean).join(' · '),
    dailyRate,
    dailyRateLabel: money(dailyRate),
    specs: [
      {icon: 'bolt', label: power > 0 ? `${power} hp` : fuel},
      {icon: 'seat', label: seats > 0 ? `${seats} seats` : '5 seats'},
      {icon: 'steering', label: transmission || 'Auto'},
    ],
  };
}

function isAvailable(item: unknown): boolean {
  const status = pickString(asRecord(item), ['status'], 'available').toLowerCase();
  return !status.includes('maint') && !status.includes('rent');
}

export function useNewRentalController(): NewRentalController {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const userName = useAppSelector(state => state.app.userName);
  const vehiclesCache = useAppSelector(state => state.dataCache.vehicles);
  const rentalsCache = useAppSelector(state => state.dataCache.rentals);
  const customersCache = useAppSelector(state => state.dataCache.customers);

  const [currentStep, setCurrentStep] = useState<NewRentalStepId>(0);
  const [form, setForm] = useState<NewRentalForm>(INITIAL_FORM);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<NewRentalPromo | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<NewRentalPaymentMethodId>('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(
    null,
  );

  const loadVehicles = useCallback(
    (options: {silent?: boolean}) => {
      dispatch(fetchVehicles(options));
    },
    [dispatch],
  );
  const loadCustomers = useCallback(
    (options: {silent?: boolean}) => {
      dispatch(fetchCustomers(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(vehiclesCache.meta.fetchedAt, loadVehicles);
  useSmartFocusFetch(customersCache.meta.fetchedAt, loadCustomers);

  const vehicleOptions = useMemo<NewRentalVehicleOption[]>(() => {
    const rows = vehiclesCache.raw.filter(isAvailable);
    const source = rows.length ? rows : vehiclesCache.raw;
    if (!source.length) {
      return FALLBACK_VEHICLES;
    }
    return source.map(mapVehicleOption);
  }, [vehiclesCache.raw]);

  useEffect(() => {
    setSelectedVehicleId(prev => {
      if (prev && vehicleOptions.some(option => option.id === prev)) {
        return prev;
      }
      return vehicleOptions[0]?.id ?? '';
    });
  }, [vehicleOptions]);

  const selectedVehicle =
    vehicleOptions.find(option => option.id === selectedVehicleId) ??
    vehicleOptions[0] ??
    null;

  const summary = useMemo(() => {
    const rows = rentalsCache.raw.map(asRecord);
    const active = rows.filter(row =>
      pickString(row, ['status'], '').toLowerCase().includes('active'),
    ).length;
    const today = new Date().toISOString().slice(0, 10);
    const dueToday = rows.filter(row =>
      pickString(row, ['expected_return_date', 'return_date']).startsWith(today),
    ).length;
    const overdue = rows.filter(row =>
      pickString(row, ['status'], '').toLowerCase().includes('overdue'),
    ).length;
    return `${active} active rentals · ${dueToday} returns due today · ${overdue} overdue`;
  }, [rentalsCache.raw]);

  const totals = useMemo(() => {
    const pickup = parseDateTime(form.pickupDate);
    const dropoff = parseDateTime(form.returnDate);
    const days =
      pickup && dropoff
        ? Math.max(
            1,
            Math.ceil((dropoff.getTime() - pickup.getTime()) / 86_400_000),
          )
        : 1;
    const base = (selectedVehicle?.dailyRate ?? 0) * days;
    const addonsTotal = ADDONS.filter(addon =>
      selectedAddonIds.includes(addon.id),
    ).reduce((sum, addon) => sum + addon.price, 0);
    const insurance = INSURANCE_PER_DAY * days;
    const gross = base + addonsTotal + insurance;
    const discount = appliedPromo ? (gross * appliedPromo.percent) / 100 : 0;
    const subtotal = gross - discount;
    const tax = subtotal * TAX_RATE;

    return {
      days,
      baseLabel: money(base),
      addonsLabel: money(addonsTotal),
      insuranceLabel: money(insurance),
      discountLabel: `-${money(discount)}`,
      subtotalLabel: money(subtotal),
      taxLabel: money(tax),
      totalLabel: money(subtotal + tax),
      hasDiscount: discount > 0,
    };
  }, [
    appliedPromo,
    form.pickupDate,
    form.returnDate,
    selectedAddonIds,
    selectedVehicle,
  ]);

  const setField = useCallback(
    <K extends keyof NewRentalForm>(key: K, value: NewRentalForm[K]) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const onSelectExistingCustomer = useCallback(() => {
    const list = customersCache.items;
    if (!list.length) {
      showMessage({message: 'No saved customers yet', type: 'info'});
      return;
    }
    const index = list.findIndex(item => item.id === existingCustomerId);
    const next = list[(index + 1) % list.length];
    setExistingCustomerId(next.id);
    setForm(prev => ({
      ...prev,
      customerName: next.name,
      phone: next.phone,
      email: next.email,
      license: next.licenseNo === '—' ? '' : next.licenseNo,
      address: next.address,
      cardholder: next.name,
      signature: next.name,
    }));
  }, [customersCache.items, existingCustomerId]);

  const existingCustomerName = useMemo(() => {
    const match = customersCache.items.find(
      item => item.id === existingCustomerId,
    );
    return match?.name ?? customersCache.items[0]?.name ?? null;
  }, [customersCache.items, existingCustomerId]);

  const onSelectVehicle = useCallback((id: string) => {
    setSelectedVehicleId(id);
  }, []);

  const onToggleAddon = useCallback((id: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  }, []);

  const onApplyPromo = useCallback((code: string) => {
    const match = PROMOS.find(
      promo => promo.code.toLowerCase() === code.trim().toLowerCase(),
    );
    setForm(prev => ({...prev, promoCode: code}));
    setAppliedPromo(match ?? null);
  }, []);

  const onSelectPaymentMethod = useCallback(
    (id: NewRentalPaymentMethodId) => {
      setSelectedPaymentMethodId(id);
    },
    [],
  );

  const onToggleTerms = useCallback(() => {
    setTermsAccepted(prev => !prev);
  }, []);

  const submitRental = useCallback(async () => {
    if (submitting) {
      return;
    }
    if (!form.customerName.trim() || !form.phone.trim()) {
      showMessage({
        message: 'Customer name and phone are required',
        type: 'danger',
      });
      setCurrentStep(0);
      return;
    }
    if (!selectedVehicle) {
      showMessage({message: 'Please select a vehicle', type: 'danger'});
      setCurrentStep(1);
      return;
    }
    const startDate = toIsoDay(form.pickupDate);
    const endDate = toIsoDay(form.returnDate);
    if (!startDate || !endDate) {
      showMessage({
        message: 'Please enter valid pickup and return dates',
        type: 'danger',
      });
      setCurrentStep(2);
      return;
    }
    if (!termsAccepted) {
      showMessage({
        message: 'Please accept the rental agreement to continue',
        type: 'danger',
      });
      return;
    }
    if (!form.signature.trim()) {
      showMessage({message: 'Please sign with the full name', type: 'danger'});
      return;
    }

    setSubmitting(true);
    try {
      let customerId: unknown = existingCustomerId;
      if (!customerId) {
        const customerRes = await accountingCustomersService.createCustomers({
          name: form.customerName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          address: form.address.trim() || undefined,
          license_no: form.license.trim() || undefined,
          customer_type: 'renter',
        });
        customerId = asRecord(unwrapData(customerRes)).id;
      }
      if (!customerId) {
        throw new Error('Customer created but no id was returned');
      }

      await vehicleRentalRentalsService.createRentals({
        vehicle_id: selectedVehicle.id,
        customer_id: customerId,
        start_date: startDate,
        expected_return_date: endDate,
        daily_rate: selectedVehicle.dailyRate,
        pickup_location: form.pickupLocation,
        dropoff_location: form.dropoffLocation,
        payment_method: selectedPaymentMethodId,
        driver_option: 'self',
      });

      dispatch(invalidateRentals());
      dispatch(invalidateVehicles());
      dispatch(invalidateCustomers());
      showMessage({message: 'Rental created successfully', type: 'success'});
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
    dispatch,
    existingCustomerId,
    form,
    navigation,
    selectedPaymentMethodId,
    selectedVehicle,
    submitting,
    termsAccepted,
  ]);

  const onNextPress = useCallback(() => {
    if (currentStep === 5) {
      submitRental();
      return;
    }
    setCurrentStep(step => (step + 1) as NewRentalStepId);
  }, [currentStep, submitRental]);

  const onPreviousPress = useCallback(() => {
    setCurrentStep(step => (step > 0 ? ((step - 1) as NewRentalStepId) : step));
  }, []);

  return {
    userName: userName || 'User',
    dateLabel: todayLabel(),
    summary,
    currentStep,
    steps: STEPS,
    stepCopy: STEP_COPY[currentStep],
    form,
    vehicleOptions,
    selectedVehicleId: selectedVehicle?.id ?? '',
    selectedVehicle,
    addons: ADDONS,
    selectedAddonIds,
    promos: PROMOS,
    appliedPromo,
    paymentMethods: PAYMENT_METHODS,
    selectedPaymentMethodId,
    terms: TERMS,
    termsAccepted,
    existingCustomerName,
    totals,
    submitting,
    setField,
    onSelectExistingCustomer,
    onSelectVehicle,
    onToggleAddon,
    onApplyPromo,
    onSelectPaymentMethod,
    onToggleTerms,
    onNextPress,
    onPreviousPress,
  };
}
