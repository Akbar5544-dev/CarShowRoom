import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import {fetchActivityLogs} from '../../../store/dataCacheSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import type {ActivityLogController} from './module';

type ActivityLogNav = NativeStackNavigationProp<
  HomeStackParamList,
  'ActivityLog'
>;

export function useActivityLogController(): ActivityLogController {
  const navigation = useNavigation<ActivityLogNav>();
  const dispatch = useAppDispatch();
  const {items, summary, meta} = useAppSelector(
    state => state.dataCache.activityLogs,
  );

  const fetchLogs = useCallback(
    (options?: {silent?: boolean}) => {
      dispatch(fetchActivityLogs(options));
    },
    [dispatch],
  );

  useSmartFocusFetch(meta.fetchedAt, fetchLogs);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    summary,
    items,
    isLoading: meta.loading,
    onBackPress,
  };
}
