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

export type AddBonusFormValues = {
  bonusType: string;
  name: string;
  date: string;
  amount: string;
};

const BONUS_TYPES = ['Performance', 'Festival', 'Commission', 'Other'];

const EMPTY_FORM: AddBonusFormValues = {
  bonusType: 'Performance',
  name: '',
  date: '',
  amount: '',
};

type AddBonusModalProps = {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onConfirm?: (values: AddBonusFormValues) => void;
};

export const AddBonusModal = memo(function AddBonusModal({
  visible,
  submitting = false,
  onClose,
  onConfirm,
}: AddBonusModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [form, setForm] = useState<AddBonusFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (visible) {
      setForm(EMPTY_FORM);
    }
  }, [visible]);

  const update = <K extends keyof AddBonusFormValues>(
    key: K,
    value: AddBonusFormValues[K],
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
            <Text style={styles.eyebrow}>BONUS</Text>
            <Text style={styles.title}>Add Bonus</Text>
            <Text style={styles.subtitle}>
              Choose a cadence, then set the date(s) and times.
            </Text>

            <View style={styles.form}>
              <FormSelect
                label="Bonus Type"
                value={form.bonusType}
                options={BONUS_TYPES}
                fullWidth
                onChange={value => update('bonusType', value)}
              />
              <FormRow>
                <FormField
                  label="Name"
                  value={form.name}
                  onChangeText={text => update('name', text)}
                  placeholder="--------"
                />
                <FormDateField
                  label="Date"
                  value={form.date}
                  onChangeText={text => update('date', text)}
                  placeholder="mm/dd/yyyy"
                />
              </FormRow>
              <FormField
                label="Amount"
                value={form.amount}
                onChangeText={text => update('amount', text)}
                placeholder="-----"
                keyboardType="decimal-pad"
                fullWidth
              />
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
                  <Text style={styles.confirmText}>Add Bonus</Text>
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
