import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Svg, {Defs, LinearGradient, Path, Stop, Line} from 'react-native-svg';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type RentalsReturnsChartProps = {
  rentals: number[];
  returns: number[];
};

function buildPath(
  values: number[],
  width: number,
  height: number,
  max: number,
) {
  if (values.length === 0) {
    return {line: '', area: ''};
  }
  const stepX = width / Math.max(values.length - 1, 1);
  const points = values.map((value, index) => {
    const x = index * stepX;
    const y = height - (value / max) * (height - 12) - 6;
    return {x, y};
  });
  const line = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return {line, area};
}

export const RentalsReturnsChart = memo(function RentalsReturnsChart({
  rentals,
  returns,
}: RentalsReturnsChartProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width: windowWidth} = useWindowDimensions();
  const chartWidth = Math.max(280, windowWidth - 80);
  const chartHeight = 140;

  const {rentalsPath, returnsPath, gridYs} = useMemo(() => {
    const max = Math.max(...rentals, ...returns, 1) * 1.08;
    return {
      rentalsPath: buildPath(rentals, chartWidth, chartHeight, max),
      returnsPath: buildPath(returns, chartWidth, chartHeight, max),
      gridYs: [0.25, 0.5, 0.75].map(ratio => chartHeight * ratio),
    };
  }, [chartHeight, chartWidth, rentals, returns]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Rentals vs Returns</Text>
          <Text style={styles.title}>Last 30 days</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, {backgroundColor: colors.actionBlue}]} />
            <Text style={styles.legendText}>Rentals</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, {backgroundColor: colors.successBright}]} />
            <Text style={styles.legendText}>Returns</Text>
          </View>
        </View>
      </View>

      <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <Defs>
          <LinearGradient id="rentalsFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.actionBlue} stopOpacity={0.22} />
            <Stop offset="100%" stopColor={colors.actionBlue} stopOpacity={0.02} />
          </LinearGradient>
          <LinearGradient id="returnsFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.successBright} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={colors.successBright} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {gridYs.map(y => (
          <Line
            key={y}
            x1={0}
            y1={y}
            x2={chartWidth}
            y2={y}
            stroke={colors.border}
            strokeWidth={StyleSheet.hairlineWidth}
          />
        ))}
        <Path d={rentalsPath.area} fill="url(#rentalsFill)" />
        <Path d={returnsPath.area} fill="url(#returnsFill)" />
        <Path
          d={rentalsPath.line}
          stroke={colors.actionBlue}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={returnsPath.line}
          stroke={colors.successBright}
          strokeWidth={2.2}
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
  card: {
    backgroundColor: c.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 4.5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: c.textSecondary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: c.textDark,
    marginTop: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    color: c.textSoft,
  },
});
}
