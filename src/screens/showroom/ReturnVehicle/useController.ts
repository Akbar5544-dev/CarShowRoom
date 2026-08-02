import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {RentalsStackParamList} from '../../../navigation/types';
import {vehicleRentalRentalsService} from '../../../services';
import {useAppSelector} from '../../../store/hooks';
import {
  asRecord,
  pickNumber,
  pickString,
  todayLabel,
  toIsoDate,
  unwrapData,
} from '../../../utils/apiHelpers';
import {appendMediaToFormData, pickFromGallery, type PickedMedia} from '../../../utils/mediaPicker';
import type {
  ExtraCharge,
  InspectionStat,
  ReturnVehicleController,
} from './module';

type ReturnNav = NativeStackNavigationProp<
  RentalsStackParamList,
  'ReturnVehicle'
>;
type ReturnRoute = RouteProp<RentalsStackParamList, 'ReturnVehicle'>;

const DEFAULT_INSPECTION_STATS: InspectionStat[] = [
  {
    id: 'mileage',
    label: 'Mileage',
    value: '—',
    note: 'Not recorded',
    icon: 'shiftClock',
  },
  {
    id: 'fuel',
    label: 'Fuel level',
    value: '—',
    note: 'Not recorded',
    icon: 'revenue',
  },
  {
    id: 'damage',
    label: 'Damage report',
    value: 'None',
    note: 'No issues logged',
    icon: 'statusOverdue',
  },
  {
    id: 'photos',
    label: 'Inspection photos',
    value: '0',
    note: 'Not uploaded',
    icon: 'camera',
  },
];

const CHARGE_DEFS: {id: string; label: string}[] = [
  {id: 'fuel_charges', label: 'Fuel refill'},
  {id: 'damage_charges', label: 'Damage repair'},
  {id: 'late_charges', label: 'Late return fee'},
  {id: 'cleaning_charges', label: 'Cleaning'},
];

function moneyFixed(value: number): string {
  const num = Number.isFinite(value) ? value : 0;
  return `$${num.toFixed(2)}`;
}

function parseAmount(value: string): number {
  return Number(value.replace(/[^0-9.]/g, '')) || 0;
}

type RentalDetail = {
  id: string;
  rentalId: string;
  customer: string;
  vehicle: string;
  vin: string;
  vehicleTitle: string;
  specs: string;
  rentalTotal: number;
  deposit: number;
};

const EMPTY_DETAIL: RentalDetail = {
  id: '',
  rentalId: '—',
  customer: '—',
  vehicle: '—',
  vin: 'N/A',
  vehicleTitle: '—',
  specs: '—',
  rentalTotal: 0,
  deposit: 0,
};

export function useReturnVehicleController(): ReturnVehicleController {
  const navigation = useNavigation<ReturnNav>();
  const route = useRoute<ReturnRoute>();
  const userName = useAppSelector(state => state.app.userName);
  const rentalId = route.params?.rentalId;

  const [detail, setDetail] = useState<RentalDetail>(EMPTY_DETAIL);
  const [inspectionStats, setInspectionStats] = useState<InspectionStat[]>(
    DEFAULT_INSPECTION_STATS,
  );
  const [charges, setCharges] = useState<ExtraCharge[]>(() =>
    CHARGE_DEFS.map(def => ({...def, amount: '$0'})),
  );
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [inspectionPhotos, setInspectionPhotos] = useState<PickedMedia[]>([]);

  const fetchRental = useCallback(async () => {
    if (!rentalId) {
      return;
    }
    try {
      const response = await vehicleRentalRentalsService.getRentalsById(
        rentalId,
      );
      const row = asRecord(unwrapData(response));
      const customer = asRecord(row.customer);
      const vehicle = asRecord(row.vehicle);
      const customerName =
        pickString(customer, ['name', 'full_name']) ||
        pickString(row, ['customer_name'], 'Customer');
      const vehicleLabel =
        [pickString(vehicle, ['make']), pickString(vehicle, ['model'])]
          .filter(Boolean)
          .join(' ') || pickString(row, ['vehicle_name'], 'Vehicle');
      const rentalCode = pickString(
        row,
        ['rental_no', 'code'],
        `RN-${row.id ?? rentalId}`,
      );
      const dailyRate = pickNumber(row, ['daily_rate']);
      const startDate = pickString(row, ['start_date', 'pickup_date']);
      const returnDate = pickString(row, ['expected_return_date', 'return_date']);
      const start = new Date(startDate).getTime();
      const end = new Date(returnDate).getTime();
      const days =
        Number.isFinite(start) && Number.isFinite(end) && end > start
          ? Math.max(1, Math.round((end - start) / 86400000))
          : 1;

      setDetail({
        id: String(row.id ?? rentalId),
        rentalId: rentalCode.startsWith('#') ? rentalCode : `#${rentalCode}`,
        customer: customerName,
        vehicle: vehicleLabel,
        vin: pickString(vehicle, ['vin', 'registration_no'], 'N/A'),
        vehicleTitle:
          [
            pickString(vehicle, ['make']),
            pickString(vehicle, ['model']),
            pickString(vehicle, ['year']),
          ]
            .filter(Boolean)
            .join(' ') || vehicleLabel,
        specs:
          [
            pickString(vehicle, ['color']),
            pickString(vehicle, ['transmission']),
            pickString(vehicle, ['fuel_type']),
          ]
            .filter(Boolean)
            .join(' · ') || '—',
        rentalTotal: dailyRate * days,
        deposit: pickNumber(row, ['security_deposit']),
      });

      setInspectionStats([
        {
          id: 'mileage',
          label: 'Mileage',
          value: pickString(vehicle, ['mileage', 'odometer'])
            ? `${pickString(vehicle, ['mileage', 'odometer'])} km`
            : '—',
          note: 'Current reading',
          icon: 'shiftClock',
        },
        {
          id: 'fuel',
          label: 'Fuel level',
          value: pickString(vehicle, ['fuel_level'], '—'),
          note: 'At return',
          icon: 'revenue',
        },
        {
          id: 'damage',
          label: 'Damage report',
          value: 'None',
          note: 'No issues logged',
          icon: 'statusOverdue',
        },
        {
          id: 'photos',
          label: 'Inspection photos',
          value: '0',
          note: 'Not uploaded',
          icon: 'camera',
        },
      ]);
      setCharges(CHARGE_DEFS.map(def => ({...def, amount: '$0'})));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load rental'),
        type: 'danger',
      });
    }
  }, [rentalId]);

  useEffect(() => {
    fetchRental();
  }, [fetchRental]);

  const extrasTotal = useMemo(() => {
    return charges.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  }, [charges]);

  const invoice = useMemo(() => {
    const rentalTotal = detail.rentalTotal;
    const depositRefund = detail.deposit;
    const subtotal = rentalTotal + extrasTotal;
    const taxable = Math.max(0, subtotal - depositRefund);
    const tax = taxable * 0.18;
    const amountDue = taxable + tax;

    return {
      rentalTotal: moneyFixed(rentalTotal),
      extras: moneyFixed(extrasTotal),
      subtotal: moneyFixed(subtotal),
      depositRefund: `-${moneyFixed(depositRefund)}`,
      tax: moneyFixed(tax),
      amountDue: moneyFixed(amountDue),
    };
  }, [detail.deposit, detail.rentalTotal, extrasTotal]);

  const setChargeAmount = useCallback((id: string, amount: string) => {
    setCharges(prev =>
      prev.map(item => (item.id === id ? {...item, amount} : item)),
    );
  }, []);

  const onInspectionPhotoPress = useCallback(async () => {
    const media = await pickFromGallery();
    if (!media) {
      return;
    }
    setInspectionPhotos(prev => {
      const next = [...prev, media];
      setInspectionStats(stats =>
        stats.map(stat =>
          stat.id === 'photos'
            ? {
                ...stat,
                value: String(next.length),
                note:
                  next.length === 1
                    ? '1 photo ready'
                    : `${next.length} photos ready`,
              }
            : stat,
        ),
      );
      return next;
    });
    showMessage({message: 'Inspection photo added', type: 'success'});
  }, []);

  const onSaveInspection = useCallback(() => {
    setIsSaveModalVisible(true);
  }, []);
  const onCloseSaveModal = useCallback(() => {
    setIsSaveModalVisible(false);
  }, []);
  const onConfirmSaveInspection = useCallback(() => {
    setIsSaveModalVisible(false);
  }, []);

  const onCompleteReturn = useCallback(async () => {
    if (!rentalId) {
      navigation.navigate('RentalOrders');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('return_date', toIsoDate(new Date().toISOString()) ?? '');
      charges.forEach(charge => {
        formData.append(charge.id, String(parseAmount(charge.amount)));
      });
      inspectionPhotos.forEach((photo, index) => {
        appendMediaToFormData(formData, `photos[${index}]`, photo);
      });

      await vehicleRentalRentalsService.returnRental(rentalId, formData);
      showMessage({message: 'Vehicle returned successfully', type: 'success'});
      navigation.navigate('RentalOrders');
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to complete return'),
        type: 'danger',
      });
    }
  }, [charges, inspectionPhotos, navigation, rentalId]);

  const onChargeComplete = useCallback(() => {
    navigation.navigate('RentalInvoice', {rentalId: detail.id || rentalId || ''});
  }, [detail.id, navigation, rentalId]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    isLoading: false,
    userName: userName || 'User',
    dateLabel: todayLabel(),
    rentalSummary: `Rental ${detail.rentalId} · ${detail.vehicle} · ${detail.customer}`,
    vehicle: {
      vin: detail.vin,
      title: detail.vehicleTitle,
      specs: detail.specs,
    },
    inspectionStats,
    charges,
    invoice,
    setChargeAmount,
    isSaveModalVisible,
    onInspectionPhotoPress,
    onSaveInspection,
    onCloseSaveModal,
    onConfirmSaveInspection,
    onCompleteReturn,
    onChargeComplete,
    onBackPress,
  };
}
