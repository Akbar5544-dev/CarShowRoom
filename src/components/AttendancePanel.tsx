import React, {memo, useMemo, useState} from 'react';
import {ActivityIndicator, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors, colors} from '../theme';

export type AttendanceStatus = 'P' | 'A' | 'L' | null;

export type AttendanceSummary = {
  present: number;
  absent: number;
  onLeave: number;
};

export type AttendanceDayCell = {
  day: number | null;
  status: AttendanceStatus;
  isWeekend?: boolean;
  recordId?: string | null;
};

export type AttendanceStatusChoice = 'present' | 'absent' | 'leave';

type AttendancePanelProps = {
  summary: AttendanceSummary;
  legend: {present: number; absent: number; leave: number};
  monthLabel: string;
  yearLabel: string;
  monthOptions?: readonly string[];
  yearOptions?: readonly string[];
  weekDays: string[];
  cells: AttendanceDayCell[];
  saving?: boolean;
  onTodayPress?: () => void;
  onMonthChange?: (month: string) => void;
  onYearChange?: (year: string) => void;
  onDayStatusSelect?: (
    day: number,
    status: AttendanceStatusChoice,
    recordId?: string | null,
  ) => void;
};

const STATUS_COLORS = {
  P: {bg: '#46B250', text: '#FCFCFC'},
  A: {bg: colors.notification, text: '#FCFCFC'},
  L: {bg: '#F29520', text: '#1D140D'},
} as const;

const STATUS_CHOICES: {
  id: AttendanceStatusChoice;
  label: string;
  code: Exclude<AttendanceStatus, null>;
}[] = [
  {id: 'present', label: 'Present', code: 'P'},
  {id: 'leave', label: 'Leave', code: 'L'},
  {id: 'absent', label: 'Absent', code: 'A'},
];

export const AttendancePanel = memo(function AttendancePanel({
  summary,
  legend,
  monthLabel,
  yearLabel,
  monthOptions,
  yearOptions,
  weekDays,
  cells,
  saving = false,
  onTodayPress,
  onMonthChange,
  onYearChange,
  onDayStatusSelect,
}: AttendancePanelProps) {
  const themeColors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<AttendanceDayCell | null>(
    null,
  );

  const rows = useMemo(() => {
    const result: AttendanceDayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [cells]);

  const closeDayPicker = () => setSelectedDay(null);

  return (
    <View style={styles.wrap}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Present</Text>
          <Text style={[styles.summaryValue, {color: '#00C965'}]}>
            {summary.present}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Absent</Text>
          <Text style={[styles.summaryValue, {color: '#E62B34'}]}>
            {summary.absent}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>On Leave</Text>
          <Text style={[styles.summaryValue, {color: '#F6922E'}]}>
            {summary.onLeave}
          </Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, {backgroundColor: '#46B250'}]} />
          <Text style={styles.legendText}>present · {legend.present}</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.dot, {backgroundColor: themeColors.notification}]}
          />
          <Text style={styles.legendText}>absent · {legend.absent}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, {backgroundColor: '#F29520'}]} />
          <Text style={styles.legendText}>leave · {legend.leave}</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Pressable style={styles.todayBtn} onPress={onTodayPress}>
          <Text style={styles.todayText}>Today</Text>
        </Pressable>
        <Pressable
          style={styles.selectBtn}
          onPress={() => monthOptions?.length && setMonthOpen(true)}>
          <Text style={styles.selectText}>{monthLabel}</Text>
          <Icon name="chevronDown" size={10} style={styles.chevron} />
        </Pressable>
        <Pressable
          style={styles.selectBtn}
          onPress={() => yearOptions?.length && setYearOpen(true)}>
          <Text style={styles.selectText}>{yearLabel}</Text>
          <Icon name="chevronDown" size={10} style={styles.chevron} />
        </Pressable>
      </View>

      <View style={styles.calendar}>
        <View style={styles.weekHeader}>
          {weekDays.map(day => (
            <View key={day} style={styles.weekCell}>
              <Text style={styles.weekLabel}>{day}</Text>
            </View>
          ))}
        </View>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.weekRow}>
            {row.map((cell, colIndex) => {
              const isEmpty = cell.day == null;
              const isWeekend = Boolean(cell.isWeekend);
              const content = (
                <>
                  {cell.day != null ? (
                    <>
                      <Text style={styles.dayNumber}>{cell.day}</Text>
                      {cell.status === 'P' ||
                      cell.status === 'A' ||
                      cell.status === 'L' ? (
                        <View
                          style={[
                            styles.statusBadge,
                            {backgroundColor: STATUS_COLORS[cell.status].bg},
                          ]}>
                          <Text
                            style={[
                              styles.statusText,
                              {color: STATUS_COLORS[cell.status].text},
                            ]}>
                            {cell.status.toLowerCase()}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.tapHint}>Tap</Text>
                      )}
                      {isWeekend ? (
                        <Text style={styles.weekendText}>Weekend</Text>
                      ) : null}
                    </>
                  ) : null}
                </>
              );

              if (isEmpty || cell.day == null) {
                return (
                  <View
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[
                      styles.dayCell,
                      styles.dayCellEmpty,
                      colIndex === 6 && styles.dayCellLastCol,
                    ]}
                  />
                );
              }

              return (
                <Pressable
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.dayCell,
                    isWeekend && styles.dayCellWeekend,
                    colIndex === 6 && styles.dayCellLastCol,
                  ]}
                  onPress={() => setSelectedDay(cell)}
                  disabled={saving}>
                  {content}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={selectedDay != null}
        presentationStyle="overFullScreen"
        onRequestClose={closeDayPicker}>
        <Pressable style={styles.pickerBackdrop} onPress={closeDayPicker}>
          <Pressable style={styles.pickerSheet} onPress={() => undefined}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {selectedDay?.day
                  ? `Mark ${monthLabel} ${selectedDay.day}`
                  : 'Mark attendance'}
              </Text>
              <Pressable onPress={closeDayPicker} hitSlop={8}>
                <Text style={styles.pickerDone}>Close</Text>
              </Pressable>
            </View>
            {STATUS_CHOICES.map(choice => {
              const selected = selectedDay?.status === choice.code;
              return (
                <Pressable
                  key={choice.id}
                  style={[
                    styles.pickerOption,
                    selected && styles.pickerOptionSelected,
                  ]}
                  disabled={saving}
                  onPress={() => {
                    if (selectedDay?.day == null) {
                      return;
                    }
                    onDayStatusSelect?.(
                      selectedDay.day,
                      choice.id,
                      selectedDay.recordId,
                    );
                    closeDayPicker();
                  }}>
                  <View
                    style={[
                      styles.pickerDot,
                      {backgroundColor: STATUS_COLORS[choice.code].bg},
                    ]}
                  />
                  <Text
                    style={[
                      styles.pickerOptionText,
                      selected && styles.pickerOptionTextSelected,
                    ]}>
                    {choice.label}
                  </Text>
                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color={themeColors.actionBlue}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      <DropdownModal
        visible={monthOpen}
        title="Select Month"
        options={monthOptions ?? []}
        value={monthLabel}
        onClose={() => setMonthOpen(false)}
        onChange={value => {
          onMonthChange?.(value);
          setMonthOpen(false);
        }}
      />
      <DropdownModal
        visible={yearOpen}
        title="Select Year"
        options={yearOptions ?? []}
        value={yearLabel}
        onClose={() => setYearOpen(false)}
        onChange={value => {
          onYearChange?.(value);
          setYearOpen(false);
        }}
      />
    </View>
  );
});

function DropdownModal({
  visible,
  title,
  options,
  value,
  onClose,
  onChange,
}: {
  visible: boolean;
  title: string;
  options: readonly string[];
  value: string;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  const styles = useThemedStyles(createStyles);
  if (!options.length) {
    return null;
  }
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      presentationStyle="overFullScreen"
      onRequestClose={onClose}>
      <Pressable style={styles.pickerBackdrop} onPress={onClose}>
        <Pressable style={styles.pickerSheet} onPress={() => undefined}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.pickerDone}>Done</Text>
            </Pressable>
          </View>
          {options.map(option => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                style={[
                  styles.pickerOption,
                  selected && styles.pickerOptionSelected,
                ]}
                onPress={() => onChange(option)}>
                <Text
                  style={[
                    styles.pickerOptionText,
                    selected && styles.pickerOptionTextSelected,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    backgroundColor: 'rgba(237,242,248,0.4)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 3,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: c.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 8,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 4,
  },
  filterText: {
    fontSize: 12,
    color: '#62748E',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: c.surface,
    borderRadius: 999,
    borderWidth: 0.85,
    borderColor: '#E2E8F0',
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#020618',
    textTransform: 'capitalize',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  todayBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    fontSize: 13,
    color: '#020618',
  },
  selectBtn: {
    minWidth: 82,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  selectText: {
    fontSize: 13,
    color: '#020618',
  },
  chevron: {
    width: 12,
    height: 6,
    transform: [{rotate: '90deg'}],
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: c.surface,
  },
  weekHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  weekCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#62748E',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    minHeight: 72,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 8,
    paddingHorizontal: 6,
    paddingBottom: 8,
    backgroundColor: c.surface,
    gap: 6,
  },
  dayCellEmpty: {
    backgroundColor: 'rgba(241,245,249,0.2)',
  },
  dayCellWeekend: {
    backgroundColor: 'rgba(241,245,249,0.1)',
  },
  dayCellLastCol: {
    borderRightWidth: 0,
  },
  dayNumber: {
    fontSize: 13,
    color: '#020618',
  },
  statusBadge: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignSelf: 'stretch',
  },
  statusText: {
    fontSize: 11,
    textTransform: 'lowercase',
  },
  tapHint: {
    fontSize: 9,
    color: '#94A3B8',
  },
  weekendText: {
    fontSize: 10,
    color: '#62748E',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.border,
    marginBottom: 4,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
  pickerDone: {
    fontSize: 13,
    fontWeight: '600',
    color: c.actionBlue,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pickerOptionSelected: {
    backgroundColor: '#F0F7FF',
  },
  pickerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pickerOptionText: {
    flex: 1,
    fontSize: 14,
    color: c.textDark,
  },
  pickerOptionTextSelected: {
    fontWeight: '700',
    color: c.actionBlue,
  },
});
}
