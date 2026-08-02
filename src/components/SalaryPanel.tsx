import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ProfileActionHeader} from './ProfileActionHeader';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type SalaryRow = {
  id: string;
  month: string;
  base: string;
  bonus: string;
  deduction: string;
};

type SalaryPanelProps = {
  ytdTotal: string;
  rows: SalaryRow[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void;
  onAddPress?: () => void;
};

export const SalaryPanel = memo(function SalaryPanel({
  ytdTotal,
  rows,
  searchValue,
  onSearchChange,
  onFilterPress,
  onAddPress,
}: SalaryPanelProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <ProfileActionHeader
        eyebrow="Total YTD"
        title={ytdTotal}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        actionLabel="Add Salary"
        onActionPress={onAddPress}
        onFilterPress={onFilterPress}
      />
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {['Month', 'Base', 'Bonus', 'Ded'].map(label => (
            <Text key={label} style={styles.headerCell}>
              {label}
            </Text>
          ))}
        </View>
        {rows.map((row, index) => (
          <View
            key={row.id}
            style={[
              styles.dataRow,
              index === rows.length - 1 && styles.dataRowLast,
            ]}>
            <Text style={[styles.cell, styles.monthCell]}>{row.month}</Text>
            <Text style={styles.cell}>{row.base}</Text>
            <Text style={[styles.cell, styles.bonusCell]}>{row.bonus}</Text>
            <Text style={[styles.cell, styles.dedCell]}>{row.deduction}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: 12,
  },
  table: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '700',
    color: c.textSoft,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingVertical: 5,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.75,
    borderBottomColor: c.borderSoft,
    paddingVertical: 2,
  },
  dataRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10.5,
    color: c.textSoft,
    paddingVertical: 5,
  },
  monthCell: {
    fontWeight: '600',
  },
  bonusCell: {
    color: c.successBright,
    fontWeight: '500',
  },
  dedCell: {
    color: '#E62B34',
    fontWeight: '600',
  },
});
}
