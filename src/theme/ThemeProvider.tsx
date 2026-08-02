import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import {useAppSelector} from '../store/hooks';
import type {AccentColorId, ThemeModeId} from './accents';
import {buildAppColors, syncAppColors, type AppColors} from './colors';

type AppThemeValue = {
  colors: AppColors;
  accentId: AccentColorId;
  modeId: ThemeModeId;
  isDark: boolean;
};

const AppThemeContext = createContext<AppThemeValue>({
  colors: buildAppColors('blue', 'light'),
  accentId: 'blue',
  modeId: 'light',
  isDark: false,
});

export function AppThemeProvider({children}: {children: ReactNode}) {
  const accentId = useAppSelector(state => state.app.accentId);
  const modeId = useAppSelector(state => state.app.themeMode);

  const value = useMemo<AppThemeValue>(() => {
    const nextColors = buildAppColors(accentId, modeId);
    return {
      colors: nextColors,
      accentId,
      modeId,
      isDark: modeId === 'dark' || modeId === 'midnight',
    };
  }, [accentId, modeId]);

  useEffect(() => {
    syncAppColors(value.colors);
  }, [value.colors]);

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeValue {
  return useContext(AppThemeContext);
}

export function useThemeColors(): AppColors {
  return useAppTheme().colors;
}
