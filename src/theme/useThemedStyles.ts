import {useMemo} from 'react';
import type {AppColors} from './colors';
import {useThemeColors} from './ThemeProvider';

/**
 * Recreate StyleSheet (or any style map) whenever the active theme changes.
 * Pass a stable factory: `const createStyles = (colors: AppColors) => StyleSheet.create(...)`
 */
export function useThemedStyles<T>(factory: (colors: AppColors) => T): T {
  const colors = useThemeColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
