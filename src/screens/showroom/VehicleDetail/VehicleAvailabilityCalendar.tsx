import React, {memo, useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppDatePicker} from '../../../components/AppDatePicker';
import {Icon} from '../../../components/Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';
import type {CalendarDayStatus, CalendarLegendItem} from './module';

const STATUS_COLORS: Record<CalendarDayStatus, string> = {
  available: '#20B46B',
  booked: '#3B82F6',
  reserved: '#F59E0B',
  maintenance: '#EF4444',
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type VehicleAvailabilityCalendarProps = {
  monthDate: Date;
  legend: CalendarLegendItem[];
  scheduleRows: CalendarDayStatus[][];
  isPickerVisible: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onMonthChange: (date: Date) => void;
};

function formatMonthYear(date: Date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const VehicleAvailabilityCalendar = memo(
  function VehicleAvailabilityCalendar({
    monthDate,
    legend,
    scheduleRows,
    isPickerVisible,
    onPrevMonth,
    onNextMonth,
    onOpenPicker,
    onClosePicker,
    onMonthChange,
  }: VehicleAvailabilityCalendarProps) {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const daysInMonth = useMemo(
      () =>
        new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate(),
      [monthDate],
    );
    const dayNumbers = useMemo(
      () => Array.from({length: daysInMonth}, (_, index) => index + 1),
      [daysInMonth],
    );

    return (
      <View style={styles.wrap}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Availability Calendar</Text>
            <Text style={styles.subtitle}>
              Color-coded schedule across your fleet.
            </Text>
          </View>
          <View style={styles.monthPicker}>
            <Pressable
              style={styles.monthArrowBtn}
              onPress={onPrevMonth}
              hitSlop={6}>
              <Icon name="arrowLeft" size={9} color={colors.textSoft} />
            </Pressable>
            <Pressable style={styles.monthLabelBtn} onPress={onOpenPicker}>
              <Icon name="calendarField" size={11} color={colors.actionBlue} />
              <Text style={styles.monthLabel}>{formatMonthYear(monthDate)}</Text>
            </Pressable>
            <Pressable
              style={styles.monthArrowBtn}
              onPress={onNextMonth}
              hitSlop={6}>
              <Icon name="arrowRight" size={9} color={colors.textSoft} />
            </Pressable>
          </View>
        </View>

        <View style={styles.legendRow}>
          {legend.map(item => (
            <View
              key={item.label}
              style={[
                styles.legendChip,
                {
                  backgroundColor: withAlpha(item.color, 0.12),
                  borderColor: withAlpha(item.color, 0.28),
                },
              ]}>
              <View style={[styles.legendDot, {backgroundColor: item.color}]} />
              <Text style={[styles.legendText, {color: item.color}]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarScroll}>
            <View>
              <View style={styles.dayHeaderRow}>
                {dayNumbers.map(day => (
                  <View key={day} style={styles.dayHeaderCell}>
                    <Text style={styles.dayHeaderText}>{day}</Text>
                  </View>
                ))}
              </View>

              {scheduleRows.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.scheduleRow}>
                  {row.slice(0, daysInMonth).map((status, dayIndex) => {
                    const tone = STATUS_COLORS[status];
                    return (
                      <View
                        key={`${rowIndex}-${dayIndex}`}
                        style={[
                          styles.dayCell,
                          dayIndex > 0 && styles.dayCellOverlap,
                        ]}>
                        <View
                          style={[
                            styles.dayPill,
                            {
                              backgroundColor: withAlpha(tone, 0.34),
                              borderColor: withAlpha(tone, 0.72),
                            },
                          ]}
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <AppDatePicker
          visible={isPickerVisible}
          value={monthDate}
          title="Select Month"
          onClose={onClosePicker}
          onChange={onMonthChange}
        />
      </View>
    );
  },
);

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrap: {gap: 12},
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    },
    headerCopy: {flex: 1, gap: 3},
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: -0.2,
    },
    subtitle: {
      fontSize: 10,
      color: c.textSoft,
      lineHeight: 14,
    },
    monthPicker: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      backgroundColor: c.searchBg,
      borderRadius: 14,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 4,
      paddingVertical: 3,
    },
    monthArrowBtn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthLabelBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    monthLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: c.textDark,
    },
    legendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    legendChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 0.75,
    },
    legendDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    legendText: {
      fontSize: 9,
      fontWeight: '600',
    },
    calendarCard: {
      borderRadius: 22,
      backgroundColor: c.surface,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 14,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    calendarScroll: {
      paddingBottom: 2,
    },
    dayHeaderRow: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingLeft: 2,
    },
    dayHeaderCell: {
      width: 14,
      marginLeft: -4,
      alignItems: 'center',
    },
    dayHeaderText: {
      fontSize: 8,
      fontWeight: '600',
      color: c.textSoft,
    },
    scheduleRow: {
      flexDirection: 'row',
      marginBottom: 6,
      paddingLeft: 2,
    },
    dayCell: {
      width: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCellOverlap: {
      marginLeft: -4,
    },
    dayPill: {
      width: 13,
      height: 40,
      borderRadius: 7,
      borderWidth: 1,
    },
  });
}
