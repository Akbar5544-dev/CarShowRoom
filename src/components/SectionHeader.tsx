import React, {memo} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const SectionHeader = memo(function SectionHeader({
  eyebrow,
  title,
  right,
  style,
}: SectionHeaderProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.row, style]}>
      <View style={styles.textBlock}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {right}
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    gap: 3,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '600',
    color: c.textSoft,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
});
}
