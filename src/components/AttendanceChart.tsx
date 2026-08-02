import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type AttendanceDay = {
  label: string;
  present: number;
  late: number;
  absent: number;
};

type AttendanceChartProps = {
  days: AttendanceDay[];
  maxValue?: number;
};

export const AttendanceChart = memo(function AttendanceChart({
  days,
  maxValue = 60,
}: AttendanceChartProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const yLabels = [60, 45, 30, 15, 0];

  return (
    <View style={styles.wrap}>
      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          {yLabels.map(label => (
            <Text key={label} style={styles.yLabel}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.plot}>
          {yLabels.slice(0, -1).map((_, index) => (
            <View
              key={`grid-${index}`}
              style={[styles.gridLine, {top: `${(index / 4) * 100}%`}]}
            />
          ))}
          <View style={styles.bars}>
            {days.map(day => {
              const total = day.present + day.late + day.absent;
              const heightPct = Math.min(100, (total / maxValue) * 100);
              const presentPct = total ? (day.present / total) * 100 : 0;
              const latePct = total ? (day.late / total) * 100 : 0;
              const absentPct = total ? (day.absent / total) * 100 : 0;

              return (
                <View key={day.label} style={styles.barColumn}>
                  <View style={[styles.barTrack, {height: `${heightPct}%`}]}>
                    <View
                      style={[
                        styles.segment,
                        {flex: absentPct, backgroundColor: colors.absent},
                      ]}
                    />
                    <View
                      style={[
                        styles.segment,
                        {flex: latePct, backgroundColor: colors.late},
                      ]}
                    />
                    <View
                      style={[
                        styles.segment,
                        {
                          flex: presentPct,
                          backgroundColor: colors.present,
                          borderBottomLeftRadius: 4,
                          borderBottomRightRadius: 4,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.xAxis}>
        <View style={styles.yAxisSpacer} />
        <View style={styles.xLabels}>
          {days.map(day => (
            <Text key={day.label} style={styles.xLabel}>
              {day.label}
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
    height: 168,
  },
  yAxis: {
    width: 18,
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
    paddingHorizontal: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 18,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  segment: {
    width: '100%',
  },
  xAxis: {
    flexDirection: 'row',
  },
  yAxisSpacer: {
    width: 22,
  },
  xLabels: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  xLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    color: c.textSoft,
  },
});
}
