import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {setThemeMode} from '../../../store/appSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import type {CustomerHomeStackParamList} from '../../../navigation/types';
import type {ThemeModeId} from '../../../theme/accents';
import type {LanguageOptionId, ThemeOptionId} from './styles';

type Nav = NativeStackNavigationProp<
  CustomerHomeStackParamList,
  'CustomerSettings'
>;

function toThemeOption(mode: ThemeModeId): ThemeOptionId {
  if (mode === 'dark' || mode === 'midnight') {
    return 'dark';
  }
  return 'light';
}

export function useCustomerSettingsController() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.app.themeMode);

  const [theme, setTheme] = useState<ThemeOptionId>(toThemeOption(themeMode));
  const [language, setLanguage] = useState<LanguageOptionId>('en');
  const [notifications, setNotifications] = useState(true);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSelectTheme = useCallback(
    (id: ThemeOptionId) => {
      setTheme(id);
      if (id === 'dark') {
        dispatch(setThemeMode('dark'));
      } else if (id === 'light') {
        dispatch(setThemeMode('light'));
      } else {
        // System → keep light for now (device Appearance can be wired later)
        dispatch(setThemeMode('light'));
      }
    },
    [dispatch],
  );

  const onSelectLanguage = useCallback((id: LanguageOptionId) => {
    setLanguage(id);
  }, []);

  const onToggleNotifications = useCallback(() => {
    setNotifications(prev => !prev);
  }, []);

  return {
    theme,
    language,
    notifications,
    onBack,
    onSelectTheme,
    onSelectLanguage,
    onToggleNotifications,
  };
}
