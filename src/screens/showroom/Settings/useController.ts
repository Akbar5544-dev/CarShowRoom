import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {clearAuthSession} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {authService} from '../../../services';
import {clearSession} from '../../../store/appSlice';
import {useAppDispatch} from '../../../store/hooks';
import type {SettingsController, SettingsItem, SettingsItemId} from './module';

type SettingsNav = NativeStackNavigationProp<HomeStackParamList, 'Settings'>;

const SETTINGS_ITEMS: SettingsItem[] = [
  {
    id: 'profile',
    title: 'My Profile',
    subtitle: 'Personal information',
    icon: 'settingsProfile',
  },
  {
    id: 'company',
    title: 'Company',
    subtitle: 'Business details',
    icon: 'settingsCompany',
  },
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Regional preferences',
    icon: 'settingsLanguages',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Alert preferences',
    icon: 'settingsNotifications',
  },
  {
    id: 'security',
    title: 'Security',
    subtitle: 'Password & 2FA',
    icon: 'settingsSecurity',
  },
  {
    id: 'theme',
    title: 'Theme',
    subtitle: 'Appearance & colors',
    icon: 'settingsTheme',
  },
  {
    id: 'backup',
    title: 'Backup & Restore',
    subtitle: 'Data management',
    icon: 'settingsBackup',
  },
  {
    id: 'logout',
    title: 'Log out',
    subtitle: 'End your current session',
    icon: 'settingsBack',
  },
];

export function useSettingsController(): SettingsController {
  const navigation = useNavigation<SettingsNav>();
  const dispatch = useAppDispatch();
  const [activeId, setActiveId] = useState<SettingsItemId>('profile');

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onItemPress = useCallback(
    (id: SettingsItemId) => {
      if (id === 'logout') {
        (async () => {
          try {
            await authService.logout().catch(() => undefined);
          } finally {
            await clearAuthSession();
            dispatch(clearSession());
            // RootNavigator resets to the Login route once isAuthenticated flips.
          }
        })();
        return;
      }
      setActiveId(id);
      if (id === 'profile') {
        navigation.navigate('MyProfile');
      } else if (id === 'company') {
        navigation.navigate('CompanyProfile');
      } else if (id === 'languages') {
        navigation.navigate('Languages');
      } else if (id === 'notifications') {
        navigation.navigate('Notifications');
      } else if (id === 'security') {
        navigation.navigate('Security');
      } else if (id === 'theme') {
        navigation.navigate('Theme');
      } else if (id === 'backup') {
        navigation.navigate('BackupRestore');
      }
    },
    [dispatch, navigation],
  );

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    items: SETTINGS_ITEMS,
    activeId,
    onBackPress,
    onItemPress,
  };
}
