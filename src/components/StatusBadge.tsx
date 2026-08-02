import React, {memo} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type StatusBadgeProps = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
};

export const StatusBadge = memo(function StatusBadge({
  label,
  backgroundColor,
  textColor,
  style,
}: StatusBadgeProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const bg = backgroundColor ?? colors.badgeActiveBg;
  const fg = textColor ?? colors.successBright;
  return (
    <View style={[styles.badge, {backgroundColor: bg}, style]}>
      <Text style={[styles.text, {color: fg}]}>{label}</Text>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  text: {
    fontSize: 7.5,
    fontWeight: '600',
  },
});
}
