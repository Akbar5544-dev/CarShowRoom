import React, {memo, useMemo} from 'react';
import {Modal, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {type AppColors, useThemedStyles} from '../theme';

type AppDatePickerProps = {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  title?: string;
};

export const AppDatePicker = memo(function AppDatePickerComponent({
  visible,
  value,
  onChange,
  onClose,
  title = 'Select Date',
}: AppDatePickerProps) {
  const styles = useThemedStyles(createStyles);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === 'dismissed') {
      onClose();
      return;
    }
    if (selected) {
      onChange(selected);
    }
    if (Platform.OS === 'android') {
      onClose();
    }
  };

  if (!visible) {
    return null;
  }

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        onChange={handleChange}
      />
    );
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.pickerBackdrop} onPress={onClose}>
        <Pressable style={styles.pickerSheet} onPress={() => undefined}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.pickerDone}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            onChange={handleChange}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
});

/** Parse common app date / datetime strings into a Date. */
export function parseDateInput(value: string, fallback = new Date()): Date {
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const match = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i,
  );
  if (match) {
    const [, m, d, y, hh, mi, meridiem] = match;
    let hours = hh ? Number(hh) : 0;
    if (meridiem) {
      const upper = meridiem.toUpperCase();
      if (upper === 'PM' && hours < 12) {
        hours += 12;
      }
      if (upper === 'AM' && hours === 12) {
        hours = 0;
      }
    }
    const parsed = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      hours,
      mi ? Number(mi) : 0,
    );
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const iso = new Date(trimmed);
  return Number.isNaN(iso.getTime()) ? fallback : iso;
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function formatDateOnly(date: Date): string {
  return `${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}/${date.getFullYear()}`;
}

function formatTime12(date: Date): string {
  let hours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }
  return `${pad2(hours)}:${minutes} ${meridiem}`;
}

function extractTimeSuffix(value: string): string | null {
  const match = value.match(/,\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  if (!match) {
    return null;
  }
  return match[1].replace(/\s+/g, ' ').toUpperCase();
}

/** Format selected calendar date in the same style the field already uses. */
export function formatDateInputValue(
  selected: Date,
  currentValue: string,
  includeTime = false,
): string {
  const datePart = formatDateOnly(selected);
  if (!includeTime) {
    return datePart;
  }
  const existingTime = extractTimeSuffix(currentValue);
  if (existingTime) {
    return `${datePart}, ${existingTime}`;
  }
  return `${datePart}, ${formatTime12(selected)}`;
}

export function shouldIncludeTime(
  placeholder?: string,
  includeTime?: boolean,
  value?: string,
): boolean {
  if (includeTime != null) {
    return includeTime;
  }
  if (placeholder && /hh|am|pm|:mm/i.test(placeholder)) {
    return true;
  }
  if (value && /,\s*\d{1,2}:\d{2}/.test(value)) {
    return true;
  }
  return false;
}

export function useParsedPickerDate(value: string) {
  return useMemo(() => parseDateInput(value), [value]);
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    pickerBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(15,23,42,0.35)',
      justifyContent: 'flex-end',
    },
    pickerSheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 24,
    },
    pickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 0.75,
      borderBottomColor: c.borderSoft,
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
  });
}
