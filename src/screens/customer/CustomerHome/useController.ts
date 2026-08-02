import {useCallback, useMemo} from 'react';
import {Alert} from 'react-native';
import {clearAuthSession} from '../../../api';
import {authService} from '../../../services';
import {clearSession} from '../../../store/appSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {todayLabel} from '../../../utils/apiHelpers';
import type {CarListing, CustomerHomeController} from './module';

const SALE_LISTINGS: CarListing[] = [
  {
    id: 'sale-tesla-model-3',
    title: 'Tesla Model 3 Long Range',
    subtitle: '2024 · Long Range AWD',
    imageUri: null,
    imageTint: '#EEF3F9',
    badges: [
      {label: 'For sale', tone: 'sale'},
      {label: 'New', tone: 'new'},
    ],
    specs: [
      {icon: 'gauge', label: '1,200 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'bolt', label: 'Electric'},
    ],
    showroomName: 'City Motors',
    showroomVerified: true,
    locationLabel: '2.1 km · Lahore',
    price: 'PKR 128 Lakh',
  },
  {
    id: 'sale-bmw-220i',
    title: 'BMW 220i M Sport Coupe',
    subtitle: '2023 · 220 M Sport',
    imageUri: null,
    imageTint: '#F1F4F8',
    badges: [{label: 'For sale', tone: 'sale'}],
    specs: [
      {icon: 'gauge', label: '15,400 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'fuelPump', label: 'Petrol'},
    ],
    showroomName: 'Auto World',
    showroomVerified: true,
    locationLabel: '4.7 km · Lahore',
    price: 'PKR 89.5 Lakh',
  },
  {
    id: 'sale-toyota-yaris',
    title: 'Toyota Yaris Sport',
    subtitle: '2023 · 1.5 Sport',
    imageUri: null,
    imageTint: '#F7F1F1',
    badges: [
      {label: 'For sale', tone: 'sale'},
      {label: 'Reserved', tone: 'reserved'},
    ],
    specs: [
      {icon: 'gauge', label: '14,200 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'fuelPump', label: 'Petrol'},
    ],
    showroomName: 'Velocity West',
    showroomVerified: true,
    locationLabel: '6.2 km · Lahore',
    price: 'PKR 46.5 Lakh',
  },
  {
    id: 'sale-range-rover',
    title: 'Range Rover Sport HSE',
    subtitle: '2024 · HSE Dynamic',
    imageUri: null,
    imageTint: '#EDEFF3',
    badges: [
      {label: 'For sale', tone: 'sale'},
      {label: 'New', tone: 'new'},
    ],
    specs: [
      {icon: 'gauge', label: '3,200 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'bolt', label: 'Hybrid'},
    ],
    showroomName: 'City Motors',
    showroomVerified: true,
    locationLabel: '2.1 km · Lahore',
    price: 'PKR 425 Lakh',
  },
  {
    id: 'sale-toyota-hilux',
    title: 'Toyota Hilux Revo V',
    subtitle: '2023 · Revo V Automatic',
    imageUri: null,
    imageTint: '#F0F2F5',
    badges: [{label: 'For sale', tone: 'sale'}],
    specs: [
      {icon: 'gauge', label: '38,600 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'fuelPump', label: 'Diesel'},
    ],
    showroomName: 'EcoDrive Hub',
    showroomVerified: true,
    locationLabel: '5.9 km · Lahore',
    price: 'PKR 102.5 Lakh',
  },
];

const RENTAL_LISTINGS: CarListing[] = [
  {
    id: 'rent-honda-e',
    title: 'Honda e Advance',
    subtitle: '2024 · Advance',
    imageUri: null,
    imageTint: '#EDF6EE',
    badges: [
      {label: 'For rent', tone: 'rent'},
      {label: 'New', tone: 'new'},
    ],
    specs: [
      {icon: 'gauge', label: '900 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'bolt', label: 'Electric'},
    ],
    showroomName: 'EcoDrive Hub',
    showroomVerified: true,
    locationLabel: '5.9 km · Lahore',
    price: 'PKR 12,500',
    priceSuffix: 'PER DAY',
  },
  {
    id: 'rent-mercedes-s500',
    title: 'Mercedes-Benz S 500',
    subtitle: '2022 · S 500 4MATIC',
    imageUri: null,
    imageTint: '#F1F3F6',
    badges: [{label: 'For rent', tone: 'rent'}],
    specs: [
      {icon: 'gauge', label: '18,400 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'fuelPump', label: 'Petrol'},
    ],
    showroomName: 'Auto World',
    showroomVerified: true,
    locationLabel: '4.7 km · Lahore',
    price: 'PKR 45,000',
    priceSuffix: 'PER DAY',
  },
  {
    id: 'rent-bmw-i5',
    title: 'BMW i5 eDrive40',
    subtitle: '2024 · eDrive40 M Sport',
    imageUri: null,
    imageTint: '#EEF1F7',
    badges: [{label: 'For rent', tone: 'rent'}],
    specs: [
      {icon: 'gauge', label: '2,100 km'},
      {icon: 'steering', label: 'Auto'},
      {icon: 'bolt', label: 'Electric'},
    ],
    showroomName: 'Velocity West',
    showroomVerified: true,
    locationLabel: '6.2 km · Lahore',
    price: 'PKR 28,000',
    priceSuffix: 'PER DAY',
  },
];

export function useCustomerHomeController(): CustomerHomeController {
  const dispatch = useAppDispatch();
  const userName = useAppSelector(state => state.app.userName);
  const dateLabel = useMemo(() => todayLabel(), []);

  const onNotificationsPress = useCallback(() => {}, []);

  const onSettingsPress = useCallback(() => {
    Alert.alert('Settings', 'End your current session?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          (async () => {
            try {
              await authService.logout().catch(() => undefined);
            } finally {
              await clearAuthSession();
              dispatch(clearSession());
            }
          })();
        },
      },
    ]);
  }, [dispatch]);

  const onListingPress = useCallback(() => {}, []);
  const onSeeAllSalePress = useCallback(() => {}, []);
  const onSeeAllRentalPress = useCallback(() => {}, []);

  return {
    userName,
    dateLabel,
    hasNotifications: true,
    saleListings: SALE_LISTINGS,
    rentalListings: RENTAL_LISTINGS,
    onNotificationsPress,
    onSettingsPress,
    onListingPress,
    onSeeAllSalePress,
    onSeeAllRentalPress,
  };
}
