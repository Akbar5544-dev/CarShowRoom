import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {VehicleInventoryItem} from '../../../components/VehicleInventoryCard';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchVehicles} from '../../../store/dataCacheSlice';
import {formatCount} from '../../../utils/apiHelpers';
import type {VehicleListController} from './module';

type VehicleListNav = NativeStackNavigationProp<
  VehiclesStackParamList,
  'VehicleList'
>;

export function useVehicleListController(): VehicleListController {
  const navigation = useNavigation<VehicleListNav>();
  const dispatch = useAppDispatch();
  const vehiclesCache = useAppSelector(state => state.dataCache.vehicles);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchVehicles(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(vehiclesCache.meta.fetchedAt, fetchData);

  const vehicles = vehiclesCache.inventory;

  const summary = useMemo(() => {
    const available = vehicles.filter(v => v.status === 'Available').length;
    const categories = new Set(vehicles.map(v => v.make.trim()).filter(Boolean))
      .size;
    if (!vehicles.length && vehiclesCache.meta.error) {
      return 'Unable to load vehicles right now';
    }
    return `${formatCount(vehicles.length)} vehicles across ${
      categories || 1
    } categories · ${formatCount(available)} available now`;
  }, [vehicles, vehiclesCache.meta.error]);

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return vehicles;
    }
    return vehicles.filter(
      item =>
        item.make.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.plateNo.toLowerCase().includes(query) ||
        item.fuelType.toLowerCase().includes(query),
    );
  }, [vehicles, searchQuery]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onFilterPress = useCallback(() => {}, []);
  const onAuctionPress = useCallback(() => {}, []);
  const onAddVehiclePress = useCallback(() => {
    navigation.navigate('AddVehicle');
  }, [navigation]);

  const onViewVehiclePress = useCallback(
    (item: VehicleInventoryItem) => {
      navigation.navigate('VehicleDetail', {
        vehicleId: item.id,
        make: item.make,
        model: item.model,
        year: item.year,
        plateNo: item.plateNo,
        fuelType: item.fuelType,
        transmission: item.transmission,
        seats: item.seats,
        mileageLabel: item.rangeLabel,
        dailyRate: item.dailyRate,
        imageUri: item.imageUri,
        imageTint: item.imageTint,
        status: item.status,
        statusBg: item.statusBg,
        statusColor: item.statusColor,
      });
    },
    [navigation],
  );

  const onItemPress = useCallback(
    (item: VehicleInventoryItem) => {
      navigation.navigate('RentalVehicle', {
        vehicleId: item.id,
        make: item.make,
        model: item.model,
        year: item.year,
        plateNo: item.plateNo,
        fuelType: item.fuelType,
        transmission: item.transmission,
        seats: item.seats,
        mileageLabel: item.rangeLabel,
        dailyRate: item.dailyRate,
        imageUri: item.imageUri,
        imageTint: item.imageTint,
      });
    },
    [navigation],
  );

  return {
    summary,
    searchQuery,
    filteredVehicles,
    isLoading:
      vehiclesCache.meta.loading && vehiclesCache.meta.fetchedAt == null,
    setSearchQuery,
    onBackPress,
    onFilterPress,
    onAuctionPress,
    onAddVehiclePress,
    onViewVehiclePress,
    onItemPress,
  };
}
