import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  BackupHistoryRow,
  BackupRestoreController,
  ScheduleItem,
  ScheduleToggleId,
} from './module';

type BackupNav = NativeStackNavigationProp<HomeStackParamList, 'BackupRestore'>;

const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'daily',
    title: 'Daily automatic backup',
    subtitle: 'Runs every day at 04:00 UTC',
    enabled: true,
  },
  {
    id: 'cloudSync',
    title: 'Cloud sync (S3)',
    subtitle: 'Mirror to encrypted S3 bucket',
    enabled: true,
  },
  {
    id: 'includeFiles',
    title: 'Include uploaded files',
    subtitle: 'Vehicle photos & documents',
    enabled: true,
  },
  {
    id: 'emailOnFailure',
    title: 'Email admins on failure',
    subtitle: 'Alert on any failed job',
    enabled: true,
  },
];

const INITIAL_HISTORY: BackupHistoryRow[] = [
  {id: '1', size: '412 MB', type: 'Automatic', status: 'Success'},
  {id: '2', size: '410 MB', type: 'Automatic', status: 'Success'},
  {id: '3', size: '408 MB', type: 'Manual', status: 'Success'},
  {id: '4', size: '405 MB', type: 'Automatic', status: 'Success'},
  {id: '5', size: '403 MB', type: 'Automatic', status: 'Failed'},
];

export function useBackupRestoreController(): BackupRestoreController {
  const navigation = useNavigation<BackupNav>();
  const [scheduleItems, setScheduleItems] = useState(INITIAL_SCHEDULE);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onToggleSchedule = useCallback(
    (id: ScheduleToggleId, value: boolean) => {
      setScheduleItems(prev =>
        prev.map(item => (item.id === id ? {...item, enabled: value} : item)),
      );
    },
    [],
  );

  const noop = useCallback(() => {}, []);

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    storageUsed: '4.2 GB',
    storageTotal: '20 GB',
    storagePercent: 21,
    lastBackupTitle: 'Today · 04:00',
    lastBackupMeta: 'Automatic · 412 MB · Cloud + Local',
    retentionTitle: '30 days',
    retentionMeta: 'Daily rolling · Monthly archive',
    scheduleItems,
    history: INITIAL_HISTORY,
    onToggleSchedule,
    onRestorePress: noop,
    onDownloadPress: noop,
    onRunBackupPress: noop,
    onBackPress,
  };
}
