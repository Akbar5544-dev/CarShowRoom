import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useAppTheme, useThemedStyles, useThemeColors} from '../theme';

type ScreenLoaderProps = {
  visible: boolean;
};

export const ScreenLoader = memo(function ScreenLoader({
  visible,
}: ScreenLoaderProps) {
  const colors = useThemeColors();
  const {isDark} = useAppTheme();
  const styles = useThemedStyles(() => createStyles(isDark));

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.spinnerWrap}>
        <ActivityIndicator color={colors.actionBlue} size="large" />
      </View>
    </View>
  );
});

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
      backgroundColor: isDark ? 'rgba(7,11,20,0.35)' : 'rgba(255,255,255,0.55)',
    },
    spinnerWrap: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
  });
}
