import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import type {HomeStackParamList} from '../../../navigation/types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {applyTheme} from '../../../store/appSlice';
import {
  ACCENT_SWATCHES,
  THEME_MODE_PREVIEWS,
  type AccentColorId,
  type ThemeModeId,
} from '../../../theme';
import type {
  AccentColorOption,
  ThemeController,
  ThemeModeOption,
} from './module';

type ThemeNav = NativeStackNavigationProp<HomeStackParamList, 'Theme'>;

const THEME_MODES: ThemeModeOption[] = THEME_MODE_PREVIEWS;

const ACCENT_COLORS: AccentColorOption[] = ACCENT_SWATCHES.map(item => ({
  id: item.id,
  color: item.brand,
}));

export function useThemeController(): ThemeController {
  const navigation = useNavigation<ThemeNav>();
  const dispatch = useAppDispatch();
  const storedMode = useAppSelector(state => state.app.themeMode);
  const storedAccent = useAppSelector(state => state.app.accentId);

  const [selectedModeId, setSelectedModeId] =
    useState<ThemeModeId>(storedMode);
  const [selectedAccentId, setSelectedAccentId] =
    useState<AccentColorId>(storedAccent);

  useEffect(() => {
    setSelectedModeId(storedMode);
    setSelectedAccentId(storedAccent);
  }, [storedAccent, storedMode]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSelectMode = useCallback((id: ThemeModeId) => {
    setSelectedModeId(id);
  }, []);

  const onSelectAccent = useCallback((id: AccentColorId) => {
    setSelectedAccentId(id);
  }, []);

  const onApplyPress = useCallback(() => {
    dispatch(
      applyTheme({
        mode: selectedModeId,
        accent: selectedAccentId,
      }),
    );
    showMessage({
      message: 'Theme applied',
      type: 'success',
    });
    navigation.goBack();
  }, [dispatch, navigation, selectedAccentId, selectedModeId]);

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    modes: THEME_MODES,
    accents: ACCENT_COLORS,
    selectedModeId,
    selectedAccentId,
    onSelectMode,
    onSelectAccent,
    onApplyPress,
    onBackPress,
  };
}
