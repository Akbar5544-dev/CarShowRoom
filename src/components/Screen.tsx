import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type ScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function Screen({
  children,
  style,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.background,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
});
}
