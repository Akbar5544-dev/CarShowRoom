import {useCallback, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {vehicleManagementVehiclesService} from '../../../services';
import {createMediaFormData, pickFromGallery} from '../../../utils/mediaPicker';
import type {
  CalendarDayStatus,
  VehicleDetailController,
  VehicleDetailRouteParams,
  VehicleDetailTabId,
} from './module';
import {useVehicleDetailApi} from './useVehicleDetailApi';

type Nav = NativeStackNavigationProp<VehiclesStackParamList, 'VehicleDetail'>;
type Route = RouteProp<VehiclesStackParamList, 'VehicleDetail'>;

const TABS: {id: VehicleDetailTabId; label: string}[] = [
  {id: 'overview', label: 'Overview'},
  {id: 'maintenance', label: 'Maintenance'},
  {id: 'rental-history', label: 'Rental History'},
  {id: 'documents', label: 'Documents'},
  {id: 'insurance', label: 'Insurance'},
  {id: 'photos', label: 'Photos'},
  {id: 'service-history', label: 'Service History'},
  {id: 'activity', label: 'Activity'},
  {id: 'calendar', label: 'Calendar'},
];

const CALENDAR_SCHEDULE_ROWS: CalendarDayStatus[][] = [
  [
    'available', 'available', 'booked', 'booked', 'booked', 'reserved', 'reserved',
    'available', 'available', 'booked', 'booked', 'maintenance', 'maintenance', 'available',
    'available', 'booked', 'booked', 'reserved', 'reserved', 'available', 'available',
    'booked', 'booked', 'booked', 'available', 'available', 'reserved', 'booked', 'available', 'available',
  ],
  [
    'booked', 'booked', 'booked', 'available', 'available', 'available', 'booked',
    'booked', 'reserved', 'reserved', 'available', 'available', 'booked', 'booked',
    'maintenance', 'maintenance', 'available', 'available', 'booked', 'booked', 'booked',
    'reserved', 'available', 'available', 'booked', 'booked', 'available', 'available', 'reserved', 'booked',
  ],
  [
    'available', 'booked', 'booked', 'booked', 'reserved', 'available', 'available',
    'booked', 'booked', 'available', 'available', 'booked', 'reserved', 'reserved',
    'available', 'booked', 'booked', 'booked', 'available', 'maintenance', 'available',
    'available', 'booked', 'reserved', 'reserved', 'available', 'booked', 'booked', 'available', 'available',
  ],
  [
    'reserved', 'reserved', 'available', 'available', 'booked', 'booked', 'booked',
    'available', 'available', 'reserved', 'booked', 'booked', 'available', 'available',
    'booked', 'booked', 'reserved', 'available', 'available', 'booked', 'booked',
    'available', 'maintenance', 'maintenance', 'available', 'booked', 'booked', 'reserved', 'available', 'available',
  ],
  [
    'booked', 'booked', 'available', 'available', 'available', 'reserved', 'booked',
    'booked', 'booked', 'booked', 'available', 'available', 'maintenance', 'available',
    'booked', 'reserved', 'reserved', 'booked', 'booked', 'available', 'available',
    'booked', 'booked', 'available', 'available', 'reserved', 'booked', 'booked', 'booked', 'available',
  ],
  [
    'available', 'available', 'available', 'booked', 'booked', 'booked', 'reserved',
    'available', 'booked', 'booked', 'booked', 'available', 'available', 'reserved',
    'booked', 'booked', 'available', 'available', 'maintenance', 'booked', 'booked',
    'reserved', 'available', 'booked', 'booked', 'available', 'available', 'booked', 'reserved', 'available',
  ],
];

export function useVehicleDetailController(): VehicleDetailController {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const params = route.params;

  const [activeTab, setActiveTab] = useState<VehicleDetailTabId>('overview');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadMedia, setUploadMedia] = useState<Awaited<ReturnType<typeof pickFromGallery>>>(null);
  const [isUploadSubmitting, setIsUploadSubmitting] = useState(false);
  const [calendarMonthDate, setCalendarMonthDate] = useState(
    () => new Date(2026, 6, 1),
  );
  const [isCalendarPickerVisible, setIsCalendarPickerVisible] = useState(false);

  const apiData = useVehicleDetailApi(params.vehicleId, {
    make: params.make,
    model: params.model,
    year: params.year,
    plateNo: params.plateNo,
    fuelType: params.fuelType,
    transmission: params.transmission,
    seats: params.seats,
    mileageLabel: params.mileageLabel,
    imageUri: params.imageUri,
  });

  const vehicle = useMemo(
    () => ({
      ...params,
      imageUri: apiData.imageUri ?? params.imageUri,
      title: params.model?.includes('xDrive')
        ? params.model
        : `${params.model || 'i5 M60'} xDrive`,
      description: apiData.description,
      rating: '4.9',
      status: params.status ?? 'Available',
      statusBg: params.statusBg ?? 'rgba(32,180,107,0.14)',
      statusColor: params.statusColor ?? '#1E8E3E',
    }),
    [apiData.description, apiData.imageUri, params],
  );

  const rentalParams = useMemo(
    () => ({
      vehicleId: params.vehicleId,
      make: params.make,
      model: params.model,
      year: params.year,
      plateNo: params.plateNo,
      fuelType: params.fuelType,
      transmission: params.transmission,
      seats: params.seats,
      mileageLabel: params.mileageLabel,
      dailyRate: params.dailyRate,
      imageUri: params.imageUri,
      imageTint: params.imageTint,
    }),
    [params],
  );

  const onBackPress = useCallback(() => navigation.goBack(), [navigation]);

  const onRentNowPress = useCallback(() => {
    navigation.navigate('RentalVehicle', rentalParams);
  }, [navigation, rentalParams]);

  const onEditPress = useCallback(() => {
    navigation.navigate('EditVehicle', {
      vehicleId: params.vehicleId,
      make: params.make,
      model: params.model,
      year: params.year,
      plateNo: params.plateNo,
      fuelType: params.fuelType,
      transmission: params.transmission,
      seats: params.seats,
      mileageLabel: params.mileageLabel,
      dailyRate: params.dailyRate,
      imageUri: params.imageUri,
      imageTint: params.imageTint,
      status: params.status,
    });
  }, [navigation, params]);

  const onNewRentalPress = useCallback(() => {
    navigation.navigate('RentalVehicle', rentalParams);
  }, [navigation, rentalParams]);

  const onNewServicePress = useCallback(() => {
    showMessage({message: 'New service coming soon', type: 'info'});
  }, []);

  const onUploadDocumentPress = useCallback(() => {
    setIsUploadModalVisible(true);
  }, []);

  const onCloseUploadModal = useCallback(() => {
    if (!isUploadSubmitting) {
      setIsUploadModalVisible(false);
      setUploadFileName(null);
      setUploadMedia(null);
    }
  }, [isUploadSubmitting]);

  const onPickUploadDocument = useCallback(async () => {
    const picked = await pickFromGallery();
    if (picked?.name) {
      setUploadFileName(picked.name);
      setUploadMedia(picked);
    }
  }, []);

  const onConfirmUploadPress = useCallback(async () => {
    if (!uploadMedia || !params.vehicleId) {
      return;
    }
    setIsUploadSubmitting(true);
    try {
      await vehicleManagementVehiclesService.uploadDocuments(
        params.vehicleId,
        createMediaFormData('document', uploadMedia, {type: 'general'}),
      );
      setIsUploadModalVisible(false);
      setUploadFileName(null);
      setUploadMedia(null);
      showMessage({message: 'Document uploaded successfully', type: 'success'});
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to upload document'),
        type: 'danger',
      });
    } finally {
      setIsUploadSubmitting(false);
    }
  }, [params.vehicleId, uploadMedia]);

  const onPrevCalendarMonth = useCallback(() => {
    setCalendarMonthDate(current => {
      const next = new Date(current);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }, []);

  const onNextCalendarMonth = useCallback(() => {
    setCalendarMonthDate(current => {
      const next = new Date(current);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }, []);

  const onOpenCalendarPicker = useCallback(() => {
    setIsCalendarPickerVisible(true);
  }, []);

  const onCloseCalendarPicker = useCallback(() => {
    setIsCalendarPickerVisible(false);
  }, []);

  const onCalendarMonthChange = useCallback((date: Date) => {
    setCalendarMonthDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  return {
    vehicle,
    tabs: TABS,
    activeTab,
    specs: apiData.specs,
    featurePills: [
      {icon: 'navVehicles', label: 'Electric'},
      {icon: 'settings', label: 'Automatic'},
      {icon: 'employees', label: `${params.seats} seats`},
      {icon: 'present', label: params.mileageLabel || '12,400 km'},
      {icon: 'logoCar', label: 'Alpine White'},
      {icon: 'calendarField', label: `Reg ${params.year}`},
      {icon: 'settingsSecurity', label: 'Insured'},
      {icon: 'activityDollar', label: '$118k value'},
    ],
    activities: apiData.activities,
    quickStats: [
      {
        label: 'Total Revenue',
        value: apiData.totalRevenue,
        icon: 'activityDollar',
        tone: 'blue',
      },
      {
        label: 'Total Rentals',
        value: apiData.totalRentals,
        icon: 'shiftClock',
        tone: 'green',
      },
      {
        label: 'Services Done',
        value: apiData.servicesDone,
        icon: 'activityWrench',
        tone: 'amber',
      },
      {
        label: 'Insurance Expiry',
        value: apiData.insuranceExpiry,
        icon: 'settingsSecurity',
        tone: 'purple',
      },
    ],
    purchaseSummary: [
      {label: 'Purchase Date', value: 'Mar 12, 2024'},
      {label: 'Purchase Cost', value: '$118,000'},
      {label: 'Current Value', value: '$104,500'},
      {label: 'Depreciation', value: '-11.4%'},
    ],
    maintenanceStats: [
      {
        label: 'Total Spent',
        value: '$4,180',
        icon: 'activityDollar',
        tone: 'blue',
      },
      {
        label: 'Services Done',
        value: '8',
        icon: 'activityWrench',
        tone: 'amber',
      },
      {
        label: 'Next Service',
        value: 'in 2,600 km',
        icon: 'shiftClock',
        tone: 'green',
      },
    ],
    maintenanceRows: apiData.maintenanceRows.length
      ? apiData.maintenanceRows
      : [
      {
        id: '1',
        date: 'Jun 12, 2026',
        type: '40,000 km Service',
        garage: 'BMW Workshop',
        odometer: '40,120 km',
        cost: '$420',
      },
      {
        id: '2',
        date: 'Mar 03, 2026',
        type: 'Brake pads',
        garage: 'AutoCare Lahore',
        odometer: '36,800 km',
        cost: '$310',
      },
      {
        id: '3',
        date: 'Nov 18, 2025',
        type: 'Software update',
        garage: 'BMW Workshop',
        odometer: '32,400 km',
        cost: '$0',
      },
    ],
    rentalStats: [
      {
        label: 'Total Rentals',
        value: apiData.totalRentals,
        icon: 'shiftClock',
        tone: 'green',
      },
      {
        label: 'Revenue',
        value: apiData.totalRevenue,
        icon: 'activityDollar',
        tone: 'blue',
      },
      {
        label: 'Avg Days / Trip',
        value: '4.2',
        icon: 'calendarField',
        tone: 'amber',
      },
      {
        label: 'Utilization',
        value: '78%',
        icon: 'presentDays',
        tone: 'purple',
      },
    ],
    rentalRows: apiData.rentalRows.length ? apiData.rentalRows : [
      {id: '1', start: 'Jul 10, 2026', end: 'Jul 15, 2026', days: '5'},
      {id: '2', start: 'Jun 28, 2026', end: 'Jul 02, 2026', days: '4'},
      {id: '3', start: 'Jun 12, 2026', end: 'Jun 16, 2026', days: '4'},
      {id: '4', start: 'May 30, 2026', end: 'Jun 04, 2026', days: '5'},
    ],
    documents: apiData.documents.length ? apiData.documents : [
      {
        id: '1',
        title: 'Registration Certificate',
        meta: 'PDF · 1.2 MB · expires May 14, 2027',
      },
      {
        id: '2',
        title: 'Insurance Policy',
        meta: 'PDF · 860 KB · expires Nov 02, 2027',
      },
      {
        id: '3',
        title: 'Inspection Report',
        meta: 'PDF · 2.4 MB · uploaded Jun 12, 2026',
      },
    ],
    insurancePolicy: {
      provider: 'EFU Premium Auto',
      status: 'Active',
      fields: [
        {label: 'Cover Type', value: 'Comprehensive'},
        {label: 'Premium', value: '$1,240/yr'},
        {label: 'Deductible', value: '$500'},
        {label: 'Sum Insured', value: '$125,000'},
        {label: 'Valid From', value: 'Nov 02, 2025'},
        {label: 'Valid To', value: 'Nov 02, 2027'},
        {label: 'Insurer', value: 'Alpha Insurance'},
        {label: 'Claims', value: '1'},
      ],
    },
    claims: [
      {
        id: '1',
        title: 'Bumper repair — Jun 2023',
        status: 'Settled',
        amount: '$2,500',
      },
    ],
    serviceItems: [
      {
        id: '1',
        date: 'Jun 12, 2026',
        title: '40,000 km Service',
        details: 'Oil filter · brake check · software update',
        cost: '$420',
      },
      {
        id: '2',
        date: 'Mar 03, 2026',
        title: 'Brake pads replacement',
        details: 'Front pads · rotor inspection',
        cost: '$310',
      },
      {
        id: '3',
        date: 'Nov 18, 2025',
        title: 'Software update',
        details: 'iDrive 8.5 · battery calibration',
        cost: '$0',
      },
    ],
    activityFeed: [
      {
        id: 'a1',
        title: 'Returned by Ayesha Khan',
        time: '2h ago · by Agent R',
        icon: 'activityCheck',
        tone: 'green',
      },
      {
        id: 'a2',
        title: 'Scheduled service completed',
        time: '3d ago · by Workshop Team',
        icon: 'activityWrench',
        tone: 'amber',
      },
      {
        id: 'a3',
        title: 'Rental income posted',
        time: '5d ago · by System',
        icon: 'activityDollar',
        tone: 'blue',
      },
      {
        id: 'a4',
        title: 'Insurance renewed',
        time: '2w ago · by Admin',
        icon: 'stepDocuments',
        tone: 'purple',
      },
    ],
    calendarLegend: [
      {color: '#20B46B', label: 'Available'},
      {color: '#3B82F6', label: 'Booked'},
      {color: '#F59E0B', label: 'Reserved'},
      {color: '#EF4444', label: 'Maintenance'},
    ],
    calendarMonthDate,
    calendarScheduleRows: CALENDAR_SCHEDULE_ROWS,
    isCalendarPickerVisible,
    isUploadModalVisible,
    uploadFileName,
    isUploadSubmitting,
    setActiveTab,
    onBackPress,
    onRentNowPress,
    onEditPress,
    onUploadDocumentPress,
    onCloseUploadModal,
    onPickUploadDocument,
    onConfirmUploadPress,
    onNewRentalPress,
    onNewServicePress,
    onPrevCalendarMonth,
    onNextCalendarMonth,
    onOpenCalendarPicker,
    onCloseCalendarPicker,
    onCalendarMonthChange,
  };
}
