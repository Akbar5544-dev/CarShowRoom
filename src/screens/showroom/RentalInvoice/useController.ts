import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {Linking} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {RentalsStackParamList} from '../../../navigation/types';
import {vehicleRentalRentalsService} from '../../../services';
import {
  asRecord,
  pickNumber,
  pickString,
  titleCase,
  unwrapData,
} from '../../../utils/apiHelpers';
import type {
  InvoiceLineItem,
  InvoiceStatusTone,
  RentalInvoiceController,
} from './module';

type Nav = NativeStackNavigationProp<RentalsStackParamList, 'RentalInvoice'>;
type Route = RouteProp<RentalsStackParamList, 'RentalInvoice'>;

const TAX_RATE = 0.05;

function moneyFixed(value: number): string {
  const num = Number.isFinite(value) ? value : 0;
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateLabel(value: string): string {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatWhen(value: string): string {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const date = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const time = parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date} · ${time}`;
}

function statusToneFrom(raw: string): InvoiceStatusTone {
  const key = raw.toLowerCase();
  if (
    key.includes('paid') ||
    key.includes('settled') ||
    key.includes('complete') ||
    key.includes('completed')
  ) {
    return 'paid';
  }
  if (key.includes('overdue') || key.includes('late')) {
    return 'overdue';
  }
  if (key.includes('active')) {
    return 'active';
  }
  return 'pending';
}

const EMPTY = {
  invoiceId: '—',
  status: 'Pending',
  statusTone: 'pending' as InvoiceStatusTone,
  issuedOn: '—',
  dueOn: '—',
  customerName: '—',
  customerEmail: '—',
  customerPhone: '—',
  customerLicense: '—',
  vehicleTitle: '—',
  vehiclePlate: '—',
  pickupLocation: '—',
  pickupWhen: '—',
  returnLocation: '—',
  returnWhen: '—',
  lineItems: [] as InvoiceLineItem[],
  subtotal: '$0.00',
  taxLabel: 'Tax (5%)',
  tax: '$0.00',
  totalDue: '$0.00',
  paymentMethod: '—',
  paymentStatus: 'Awaiting settlement',
};

export function useRentalInvoiceController(): RentalInvoiceController {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const rentalId = route.params?.rentalId;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(EMPTY);

  const fetchInvoice = useCallback(async () => {
    if (!rentalId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await vehicleRentalRentalsService.getRentalsById(
        rentalId,
      );
      const row = asRecord(unwrapData(response));
      const customerRow = asRecord(row.customer);
      const vehicleRow = asRecord(row.vehicle);

      const customerName =
        pickString(customerRow, ['name', 'full_name']) ||
        pickString(row, ['customer_name'], 'Customer');
      const make = pickString(vehicleRow, ['make']);
      const model = pickString(vehicleRow, ['model']);
      const vehicleTitle =
        [make, model].filter(Boolean).join(' ') ||
        pickString(row, ['vehicle_name'], 'Vehicle');
      const plate = pickString(
        vehicleRow,
        ['registration_no', 'plate_no', 'license_plate'],
        '—',
      );
      const code = pickString(
        row,
        ['rental_no', 'code', 'invoice_no'],
        `RN-${row.id ?? rentalId}`,
      );
      const statusRaw = pickString(row, ['status', 'payment_status'], 'pending');
      const dailyRate = pickNumber(row, ['daily_rate']);
      const startDate = pickString(row, ['start_date', 'pickup_date']);
      const endDate = pickString(row, [
        'expected_return_date',
        'end_date',
        'return_date',
      ]);
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const days =
        Number.isFinite(start) && Number.isFinite(end) && end > start
          ? Math.max(1, Math.round((end - start) / 86400000))
          : 1;
      const rentalTotal =
        pickNumber(row, ['final_amount'], -1) >= 0
          ? pickNumber(row, ['final_amount'])
          : dailyRate * days;
      const insurance = pickNumber(row, [
        'insurance_charges',
        'insurance_amount',
      ]);
      const pickupFee = pickNumber(row, [
        'pickup_fee',
        'airport_fee',
        'extra_charges',
      ]);
      const lineItems: InvoiceLineItem[] = [
        {
          id: 'rental',
          label: `${vehicleTitle} rental`,
          detail:
            dailyRate > 0
              ? `${days} days × ${moneyFixed(dailyRate)}/day`
              : `${days} days`,
          amount: moneyFixed(
            dailyRate > 0 ? dailyRate * days : rentalTotal,
          ),
        },
      ];
      if (insurance > 0) {
        lineItems.push({
          id: 'insurance',
          label: 'Full insurance',
          amount: moneyFixed(insurance),
        });
      }
      if (pickupFee > 0) {
        lineItems.push({
          id: 'pickup-fee',
          label: 'Airport pickup fee',
          amount: moneyFixed(pickupFee),
        });
      }

      const baseRental = dailyRate > 0 ? dailyRate * days : rentalTotal;
      const subtotal = baseRental + insurance + pickupFee;
      const tax = subtotal * TAX_RATE;
      const pickupLocation = pickString(
        row,
        ['pickup_location', 'location'],
        '—',
      );
      const returnLocation = pickString(
        row,
        ['dropoff_location', 'return_location', 'pickup_location'],
        pickupLocation,
      );
      const paymentMethod =
        pickString(row, ['payment_method', 'card_last4'], '') ||
        'Card on file';
      const paymentLabel = paymentMethod.match(/^\d+$/)
        ? `Card •• ${paymentMethod}`
        : titleCase(paymentMethod.replace(/_/g, ' '));

      setData({
        invoiceId: code.startsWith('#') ? code : `#${code}`,
        status: titleCase(statusRaw),
        statusTone: statusToneFrom(statusRaw),
        issuedOn: formatDateLabel(startDate),
        dueOn: formatDateLabel(endDate),
        customerName,
        customerEmail:
          pickString(customerRow, ['email', 'email_address']) || '—',
        customerPhone: pickString(customerRow, ['phone', 'mobile']) || '—',
        customerLicense:
          pickString(customerRow, ['license_no', 'license_number']) || '—',
        vehicleTitle,
        vehiclePlate: plate,
        pickupLocation,
        pickupWhen: formatWhen(startDate),
        returnLocation,
        returnWhen: formatWhen(endDate),
        lineItems,
        subtotal: moneyFixed(subtotal),
        taxLabel: `Tax (${Math.round(TAX_RATE * 100)}%)`,
        tax: moneyFixed(tax),
        totalDue: moneyFixed(subtotal + tax),
        paymentMethod: paymentLabel,
        paymentStatus: statusToneFrom(statusRaw) === 'paid'
          ? 'Settled'
          : 'Awaiting settlement',
      });
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load invoice'),
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }, [rentalId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPrintPress = useCallback(() => {
    const text = [
      `Invoice ${data.invoiceId}`,
      `Status: ${data.status}`,
      '',
      `Customer: ${data.customerName}`,
      `Vehicle: ${data.vehicleTitle} (${data.vehiclePlate})`,
      '',
      ...data.lineItems.map(li => `- ${li.label}: ${li.amount}`),
      '',
      `Subtotal: ${data.subtotal}`,
      `Tax: ${data.tax}`,
      `Total due: ${data.totalDue}`,
    ].join('\n');
    void Linking.openURL(
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
    );
    Alert.alert('Print', 'A printable text preview is opened.');
  }, [data]);

  const onMarkPaidPress = useCallback(() => {
    Alert.alert(
      'Mark as paid',
      'Are you sure you want to mark this invoice as paid?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          style: 'default',
          onPress: async () => {
            try {
              if (rentalId) {
                await vehicleRentalRentalsService.updateRentalsById(rentalId, {
                  status: 'completed',
                });
              }
              setData(prev => ({
                ...prev,
                status: 'Complete',
                statusTone: 'paid',
                paymentStatus: 'Settled',
              }));
              showMessage({message: 'Marked as paid', type: 'success'});
            } catch (error) {
              showMessage({
                message: getApiErrorMessage(error, 'Failed to mark as paid'),
                type: 'danger',
              });
            }
          },
        },
      ],
      {cancelable: true},
    );
  }, [rentalId]);

  const onDownloadPress = useCallback(() => {
    const text = [
      `Invoice ${data.invoiceId}`,
      `Status: ${data.status}`,
      '',
      ...data.lineItems.map(li => `${li.label}: ${li.amount}`),
      '',
      `Total due: ${data.totalDue}`,
    ].join('\n');
    void Linking.openURL(
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
    );
    Alert.alert('Download', 'Invoice text exported.');
  }, [data]);

  const onEmailPress = useCallback(() => {
    Alert.alert(
      'Email to customer',
      `Send invoice to ${data.customerEmail}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Send',
          onPress: () => {
            showMessage({
              message: `Email queued for ${data.customerEmail}`,
              type: 'success',
            });
          },
        },
      ],
      {cancelable: true},
    );
  }, [data.customerEmail, showMessage]);

  return {
    isLoading,
    ...data,
    onBackPress,
    onPrintPress,
    onMarkPaidPress,
    onDownloadPress,
    onEmailPress,
  };
}
