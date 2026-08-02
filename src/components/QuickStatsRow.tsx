import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type QuickStat = {
  id: string;
  label: string;
  value: string;
  color: string;
};

type QuickStatsRowProps = {
  items: QuickStat[];
};

export const QuickStatsRow = memo(function QuickStatsRow({items}: QuickStatsRowProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.row}>
      {items.map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.value, {color: item.color}]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    minHeight: 72,
    borderRadius: 14,
    backgroundColor: c.background,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 10,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 9,
    color: c.textSoft,
    lineHeight: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
});
}
