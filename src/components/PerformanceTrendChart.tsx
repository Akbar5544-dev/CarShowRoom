import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type PerformanceTrendChartProps = {
  values: number[];
  growthLabel?: string;
  width?: number;
  height?: number;
};

export const PerformanceTrendChart = memo(function PerformanceTrendChart({
  values,
  growthLabel = '14%',
  width = 300,
  height = 120,
}: PerformanceTrendChartProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {linePath, areaPath} = useMemo(() => {
    if (values.length === 0) {
      return {linePath: '', areaPath: ''};
    }
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const stepX = width / (values.length - 1);
    const points = values.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * (height - 16) - 8;
      return {x, y};
    });

    const line = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L${width} ${height} L0 ${height} Z`;
    return {linePath: line, areaPath: area};
  }, [height, values, width]);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Trend</Text>
        <View style={styles.badge}>
          <Icon name="growthGreen" size={9} />
          <Text style={styles.badgeText}>{growthLabel}</Text>
        </View>
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.actionBlue} stopOpacity={0.28} />
            <Stop offset="100%" stopColor={colors.actionBlue} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#trendFill)" />
        <Path
          d={linePath}
          stroke={colors.actionBlue}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: c.badgeActiveBg,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: c.successBright,
  },
});
}
