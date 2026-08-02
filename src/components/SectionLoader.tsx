import React, {memo, type ReactNode} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {type AppColors, useAppTheme, useThemedStyles, useThemeColors} from '../theme';

type SectionLoaderProps = {
  loading: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  minHeight?: number;
};

export const SectionLoader = memo(function SectionLoader({
  loading,
  children,
  style,
  minHeight,
}: SectionLoaderProps) {
  const colors = useThemeColors();
  const {isDark} = useAppTheme();
  const styles = useThemedStyles(c => createStyles(c, isDark));

  return (
    <View style={[styles.wrap, minHeight != null && {minHeight}, style]}>
      {children}
      {loading ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator color={colors.actionBlue} size="small" />
        </View>
      ) : null}
    </View>
  );
});

function createStyles(_c: AppColors, isDark: boolean) {
  return StyleSheet.create({
    wrap: {
      position: 'relative',
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(7,11,20,0.45)' : 'rgba(255,255,255,0.72)',
      borderRadius: 24,
    },
  });
}
