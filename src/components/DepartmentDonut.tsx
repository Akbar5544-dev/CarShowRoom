import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type DepartmentItem = {
  id: string;
  label: string;
  count: number;
  color: string;
};

type DepartmentDonutProps = {
  items: DepartmentItem[];
  total: number;
  size?: number;
  centerLabel?: string;
  legendColumns?: 1 | 2;
};

export const DepartmentDonut = memo(function DepartmentDonut({
  items,
  total,
  size = 118,
  centerLabel = 'Employees',
  legendColumns = 1,
}: DepartmentDonutProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    let offset = 0;
    return items.map(item => {
      const length = total ? (item.count / total) * circumference : 0;
      const segment = {
        ...item,
        dasharray: `${length} ${circumference - length}`,
        dashoffset: -offset,
      };
      offset += length;
      return segment;
    });
  }, [circumference, items, total]);

  return (
    <View style={styles.wrap}>
      <View style={[styles.chartWrap, {width: size, height: size}]}>
        <Svg width={size} height={size}>
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {segments.map(segment => (
              <Circle
                key={segment.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={segment.dasharray}
                strokeDashoffset={segment.dashoffset}
                strokeLinecap="butt"
              />
            ))}
          </G>
        </Svg>
        <View style={styles.center}>
          <Text style={styles.centerValue}>{total}</Text>
          <Text style={styles.centerLabel}>{centerLabel}</Text>
        </View>
      </View>
      <View
        style={[
          styles.legend,
          legendColumns === 2 && styles.legendGrid,
        ]}>
        {items.map(item => (
          <View
            key={item.id}
            style={[
              styles.legendRow,
              legendColumns === 2 && styles.legendGridItem,
            ]}>
            <View style={styles.legendLeft}>
              <View style={[styles.dot, {backgroundColor: item.color}]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
            <Text style={styles.legendCount}>{item.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 16,
  },
  chartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: c.textDark,
  },
  centerLabel: {
    fontSize: 10,
    color: c.textSoft,
  },
  legend: {
    width: '100%',
    gap: 8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendGridItem: {
    width: '48%',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: c.textSoft,
  },
  legendCount: {
    fontSize: 12,
    fontWeight: '700',
    color: c.textDark,
  },
});
}
