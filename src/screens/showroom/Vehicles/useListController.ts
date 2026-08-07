import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {VehicleInventoryItem} from '../../../components/VehicleInventoryCard';
import type {VehicleAuctionFormValues} from '../../../components/VehicleAuctionBidModal';
import type {VehiclePostListingChoice} from '../../../components/VehiclePostTypeModal';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {vehicleManagementVehiclesService} from '../../../services';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {fetchVehicles} from '../../../store/dataCacheSlice';
import {formatCount, parseMoneyInput} from '../../../utils/apiHelpers';
import type {VehicleListController} from './module';

type VehicleListNav = NativeStackNavigationProp<
  VehiclesStackParamList,
  'VehicleList'
>;

function defaultAuctionBid(item: VehicleInventoryItem | null): string {
  if (!item) {
    return '';
  }
  const fromAsking = parseMoneyInput(item.askingPrice ?? '');
  if (fromAsking != null && fromAsking > 0) {
    return String(fromAsking);
  }
  const fromDaily = parseMoneyInput(item.dailyRate);
  if (fromDaily != null && fromDaily > 0) {
    return String(fromDaily);
  }
  return '';
}

export function useVehicleListController(): VehicleListController {
  const navigation = useNavigation<VehicleListNav>();
  const dispatch = useAppDispatch();
  const vehiclesCache = useAppSelector(state => state.dataCache.vehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [postTarget, setPostTarget] = useState<VehicleInventoryItem | null>(
    null,
  );
  const [auctionTarget, setAuctionTarget] =
    useState<VehicleInventoryItem | null>(null);

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

  const openRentalFlow = useCallback(
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

  const publishVehicle = useCallback(
    async (
      item: VehicleInventoryItem,
      listing: Extract<VehiclePostListingChoice, 'sale' | 'rent'>,
    ) => {
      setBusyId(item.id);
      try {
        await vehicleManagementVehiclesService.updateVehiclesById(item.id, {
          is_published: true,
          status: 'available',
          usage_type: listing === 'rent' ? 'rent' : 'sale',
        });
        showMessage({
          message: `${item.make} ${item.model} posted for ${
            listing === 'rent' ? 'rent' : 'sale'
          }`,
          type: 'success',
        });
        setPostTarget(null);
        dispatch(fetchVehicles({silent: true}));
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to post vehicle'),
          type: 'danger',
        });
      } finally {
        setBusyId(null);
      }
    },
    [dispatch],
  );

  const unpublishVehicle = useCallback(
    async (item: VehicleInventoryItem) => {
      if (busyId) {
        return;
      }
      setBusyId(item.id);
      try {
        await vehicleManagementVehiclesService.updateVehiclesById(item.id, {
          is_published: false,
        });
        showMessage({
          message: `${item.make} ${item.model} unpublished`,
          type: 'success',
        });
        dispatch(fetchVehicles({silent: true}));
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to unpost vehicle'),
          type: 'danger',
        });
      } finally {
        setBusyId(null);
      }
    },
    [busyId, dispatch],
  );

  const onPostVehiclePress = useCallback(
    (item: VehicleInventoryItem) => {
      if (busyId) {
        return;
      }
      if (item.isPublished) {
        unpublishVehicle(item);
        return;
      }
      setPostTarget(item);
    },
    [busyId, unpublishVehicle],
  );

  const onClosePostTypeModal = useCallback(() => {
    if (busyId) {
      return;
    }
    setPostTarget(null);
  }, [busyId]);

  const onSelectPostType = useCallback(
    async (choice: VehiclePostListingChoice) => {
      if (!postTarget || busyId) {
        return;
      }
      await publishVehicle(postTarget, choice);
    },
    [busyId, postTarget, publishVehicle],
  );

  const onAuctionVehiclePress = useCallback(
    (item: VehicleInventoryItem) => {
      if (busyId) {
        return;
      }
      setAuctionTarget(item);
    },
    [busyId],
  );

  const onCloseAuctionModal = useCallback(() => {
    if (busyId) {
      return;
    }
    setAuctionTarget(null);
  }, [busyId]);

  const onConfirmAuctionBid = useCallback(
    async (values: VehicleAuctionFormValues) => {
      if (!auctionTarget || busyId) {
        return;
      }
      const startingBid = String(values.starting_bid ?? '').trim();
      const endsAt = String(values.ends_at ?? '').trim();
      if (!startingBid) {
        showMessage({
          message: 'starting_bid is required',
          type: 'warning',
        });
        return;
      }
      if (!endsAt) {
        showMessage({
          message: 'ends_at is required',
          type: 'warning',
        });
        return;
      }
      setBusyId(auctionTarget.id);
      try {
        await vehicleManagementVehiclesService.createAuction(auctionTarget.id, {
          starting_bid: startingBid,
          ends_at: endsAt,
        });
        showMessage({
          message: `${auctionTarget.make} ${auctionTarget.model} listed for auction`,
          type: 'success',
        });
        setAuctionTarget(null);
        dispatch(fetchVehicles({silent: true}));
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(
            error,
            'Failed to list vehicle for auction',
          ),
          type: 'danger',
        });
      } finally {
        setBusyId(null);
      }
    },
    [auctionTarget, busyId, dispatch],
  );

  const onItemPress = useCallback(
    (item: VehicleInventoryItem) => {
      openRentalFlow(item);
    },
    [openRentalFlow],
  );

  return {
    summary,
    searchQuery,
    filteredVehicles,
    isLoading:
      vehiclesCache.meta.loading && vehiclesCache.meta.fetchedAt == null,
    postTarget,
    auctionTarget,
    auctionDefaultBid: defaultAuctionBid(auctionTarget),
    actionBusy: Boolean(busyId),
    setSearchQuery,
    onBackPress,
    onFilterPress,
    onAuctionPress,
    onAddVehiclePress,
    onViewVehiclePress,
    onPostVehiclePress,
    onSelectPostType,
    onClosePostTypeModal,
    onAuctionVehiclePress,
    onConfirmAuctionBid,
    onCloseAuctionModal,
    onItemPress,
  };
}
