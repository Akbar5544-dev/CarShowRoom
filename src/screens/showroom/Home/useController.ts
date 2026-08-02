import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import {
  buildHomeMetricValues,
  buildHomeStatusItems,
  fetchHomeData,
  mapActivitiesWithTheme,
} from '../../../store/dataCacheSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import {useThemeColors} from '../../../theme';
import {todayLabel} from '../../../utils/apiHelpers';
import type {HomeController} from './module';

type HomeNav = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

export function useHomeController(): HomeController {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNav>();
  const userName = useAppSelector(state => state.app.userName);
  const home = useAppSelector(state => state.dataCache.home);

  const [revenuePeriod, setRevenuePeriod] = useState<'D' | 'W' | 'M'>('W');
  const [revenueBars] = useState([0.42, 0.68, 0.55, 0.92, 0.78, 0.48, 0.35]);

  const metrics = useMemo(
    () => buildHomeMetricValues(home.dashboard, colors),
    [colors, home.dashboard],
  );

  const statusItems = useMemo(
    () => buildHomeStatusItems(home.dashboard, colors),
    [colors, home.dashboard],
  );

  const activities = useMemo(
    () => mapActivitiesWithTheme(home.activities, colors),
    [colors, home.activities],
  );

  const fetchHome = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchHomeData(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(home.meta.fetchedAt, fetchHome);

  const onSettingsPress = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  return {
    userName: userName || 'User',
    dateLabel: todayLabel(),
    fleet: home.fleet,
    metrics,
    statusItems,
    revenueTotal: home.revenueTotal,
    revenueGrowth: home.revenueGrowth,
    revenuePeriod,
    revenueBars,
    orders: home.orders,
    activities,
    setRevenuePeriod,
    onSettingsPress,
  };
}
