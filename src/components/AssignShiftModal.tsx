import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FormDateField, FormField, FormRow, FormSelect} from './FormControls';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type AssignShiftFormValues = {
  shiftType: string;
  period: string;
  date: string;
  startTime: string;
  endTime: string;
};

const SHIFT_TYPES = ['Daily', 'Weekly', 'Custom'];
const PERIODS = ['Morning', 'Evening', 'Night'];

const EMPTY_FORM: AssignShiftFormValues = {
  shiftType: 'Daily',
  period: 'Morning',
  date: '',
  startTime: '09:00',
  endTime: '12:00',
};

type AssignShiftModalProps = {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onConfirm?: (values: AssignShiftFormValues) => void;
};

export const AssignShiftModal = memo(function AssignShiftModal({
  visible,
  submitting = false,
  onClose,
  onConfirm,
}: AssignShiftModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [form, setForm] = useState<AssignShiftFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (visible) {
      setForm(EMPTY_FORM);
    }
  }, [visible]);

  const update = <K extends keyof AssignShiftFormValues>(
    key: K,
    value: AssignShiftFormValues[K],
  ) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}>
          <View style={styles.card}>
            <Text style={styles.eyebrow}>SHIFT</Text>
            <Text style={styles.title}>Assign Shift</Text>
            <Text style={styles.subtitle}>
              Choose a cadence, then set the date(s) and times.
            </Text>

            <View style={styles.form}>
              <FormSelect
                label="Shift Type"
                value={form.shiftType}
                options={SHIFT_TYPES}
                fullWidth
                onChange={value => update('shiftType', value)}
              />
              <FormRow>
                <FormSelect
                  label="Period"
                  value={form.period}
                  options={PERIODS}
                  onChange={value => {
                    update('period', value);
                    if (value === 'Morning') {
                      update('startTime', '09:00');
                      update('endTime', '17:00');
                    } else if (value === 'Evening') {
                      update('startTime', '14:00');
                      update('endTime', '22:00');
                    } else {
                      update('startTime', '22:00');
                      update('endTime', '06:00');
                    }
                  }}
                />
                <FormDateField
                  label="Date"
                  value={form.date}
                  onChangeText={text => update('date', text)}
                  placeholder="mm/dd/yyyy"
                />
              </FormRow>
              <FormRow>
                <FormField
                  label="Start Time"
                  value={form.startTime}
                  onChangeText={text => update('startTime', text)}
                  placeholder="09:00"
                />
                <FormField
                  label="End Time"
                  value={form.endTime}
                  onChangeText={text => update('endTime', text)}
                  placeholder="12:00"
                />
              </FormRow>
            </View>

            <View style={styles.footer}>
              <Pressable
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={submitting}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, submitting && styles.disabled]}
                disabled={submitting}
                onPress={() => onConfirm?.(form)}>
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.confirmText}>Assign Shift</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 17, 35, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backdropTap: {
    ...StyleSheet.absoluteFill,
  },
  keyboardWrap: {
    width: '100%',
    maxWidth: 353,
    zIndex: 1,
  },
  card: {
    width: '100%',
    backgroundColor: c.surface,
    borderRadius: 28,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: c.actionBlue,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: c.textDark,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 12,
    lineHeight: 17,
    color: c.textSoft,
  },
  form: {
    gap: 12,
  },
  footer: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelBtn: {
    minWidth: 96,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: c.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: c.white,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.textDark,
  },
  confirmBtn: {
    minWidth: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: c.white,
  },
  disabled: {
    opacity: 0.7,
  },
});
}
