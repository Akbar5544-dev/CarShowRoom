import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {clearAuthSession} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {authService} from '../../../services';
import {clearSession} from '../../../store/appSlice';
import {useAppDispatch} from '../../../store/hooks';
import type {
  ActiveSession,
  PasswordForm,
  SecurityController,
  SessionId,
} from './module';

type SecurityNav = NativeStackNavigationProp<HomeStackParamList, 'Security'>;

const INITIAL_PASSWORD: PasswordForm = {
  currentPassword: '********',
  newPassword: '',
  confirmPassword: '',
};

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'mac',
    device: 'MacBook Pro · Chrome',
    meta: 'Lahore, PK · Now',
    current: true,
  },
  {
    id: 'iphone',
    device: 'iPhone 16 · Safari',
    meta: 'Lahore, PK · 2h ago',
  },
  {
    id: 'windows',
    device: 'Windows · Firefox',
    meta: 'Karachi, PK · 3d ago',
  },
];

export function useSecurityController(): SecurityController {
  const navigation = useNavigation<SecurityNav>();
  const dispatch = useAppDispatch();
  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD);
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(true);
  const [smsBackupEnabled, setSmsBackupEnabled] = useState(false);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const setPasswordField = useCallback(
    (key: keyof PasswordForm, value: string) => {
      setPasswordForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onUpdatePassword = useCallback(() => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, []);

  const onRevokeSession = useCallback((id: SessionId) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  }, []);

  const onLogoutPress = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await authService.logout().catch(() => undefined);
    } finally {
      await clearAuthSession();
      dispatch(clearSession());
      setIsLoggingOut(false);
      // RootNavigator resets to the Login route once isAuthenticated flips.
    }
  }, [dispatch, isLoggingOut]);

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    passwordForm,
    authenticatorEnabled,
    smsBackupEnabled,
    sessions,
    isLoggingOut,
    setPasswordField,
    onToggleAuthenticator: setAuthenticatorEnabled,
    onToggleSmsBackup: setSmsBackupEnabled,
    onUpdatePassword,
    onRevokeSession,
    onBackPress,
    onLogoutPress,
  };
}
