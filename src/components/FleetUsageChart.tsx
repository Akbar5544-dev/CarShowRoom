import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type FleetUsageMonth = {
  label: string;
  value: number;
};

type FleetUsageChartProps = {
  months: FleetUsageMonth[];
  maxValue?: number;
};

const Y_LABELS = [100, 75, 50, 25, 0];
const CHART_HEIGHT = 168;
const BAR_WIDTH = 22;

export const FleetUsageChart = memo(function FleetUsageChart({
  months,
  maxValue = 100,
}: FleetUsageChartProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          {Y_LABELS.map(label => (
            <Text key={label} style={styles.yLabel}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.plot}>
          {Y_LABELS.slice(0, -1).map((_, index) => (
            <View
              key={`grid-${index}`}
              style={[styles.gridLine, {top: `${(index / 4) * 100}%`}]}
            />
          ))}
          <View style={styles.bars}>
            {months.map((month, index) => {
              const heightPct = Math.min(
                100,
                Math.max(4, (month.value / maxValue) * 100),
              );
              const barHeight = (CHART_HEIGHT * heightPct) / 100;
              return (
                <View key={`${month.label}-${index}`} style={styles.barColumn}>
                  <Svg width={BAR_WIDTH} height={barHeight}>
                    <Defs>
                      <LinearGradient
                        id={`fleetBar-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <Stop offset="0%" stopColor={colors.accent} />
                        <Stop offset="100%" stopColor={colors.actionBlue} />
                      </LinearGradient>
                    </Defs>
                    <Rect
                      x={0}
                      y={0}
                      width={BAR_WIDTH}
                      height={barHeight}
                      rx={6}
                      fill={`url(#fleetBar-${index})`}
                    />
                  </Svg>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.xAxis}>
        <View style={styles.yAxisSpacer} />
        <View style={styles.xLabels}>
          {months.map((month, index) => (
            <Text key={`${month.label}-${index}`} style={styles.xLabel}>
              {month.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrap: {
      gap: 8,
    },
    chartRow: {
      flexDirection: 'row',
      height: CHART_HEIGHT,
    },
    yAxis: {
      width: 22,
      justifyContent: 'space-between',
      paddingVertical: 2,
    },
    yLabel: {
      fontSize: 8,
      color: c.textSoft,
      textAlign: 'right',
    },
    plot: {
      flex: 1,
      position: 'relative',
      marginLeft: 4,
    },
    gridLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
    },
    bars: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 6,
    },
    barColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
    },
    xAxis: {
      flexDirection: 'row',
    },
    yAxisSpacer: {
      width: 26,
    },
    xLabels: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 6,
    },
    xLabel: {
      flex: 1,
      textAlign: 'center',
      fontSize: 9,
      color: c.textSoft,
    },
  });
}
