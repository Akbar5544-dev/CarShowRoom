import React, {memo, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FormDateField, FormField, FormRow, FormSelect} from './FormControls';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type CreateInvoiceFormValues = {
  title: string;
  amount: string;
  date: string;
  invoiceNumber: string;
  customer: string;
  vehicle: string;
  status: string;
};

const EMPTY_FORM: CreateInvoiceFormValues = {
  title: '',
  amount: '',
  date: '',
  invoiceNumber: '',
  customer: '',
  vehicle: '',
  status: 'Unpaid',
};

type CreateInvoiceModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: (values: CreateInvoiceFormValues) => void;
};

export const CreateInvoiceModal = memo(function CreateInvoiceModal({
  visible,
  onClose,
  onConfirm,
}: CreateInvoiceModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [form, setForm] = useState<CreateInvoiceFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (visible) {
      setForm(EMPTY_FORM);
    }
  }, [visible]);

  const update = <K extends keyof CreateInvoiceFormValues>(
    key: K,
    value: CreateInvoiceFormValues[K],
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
            <Text style={styles.eyebrow}>FORM</Text>
            <Text style={styles.title}>Create Invoice</Text>

            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <FormField
                label="Title"
                value={form.title}
                onChangeText={text => update('title', text)}
                placeholder="EMP-056"
                fullWidth
              />

              <FormRow>
                <FormField
                  label="Amount / Value"
                  value={form.amount}
                  onChangeText={text => update('amount', text)}
                  placeholder="EMP-056"
                  keyboardType="decimal-pad"
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
                  label="Invoice Number"
                  value={form.invoiceNumber}
                  onChangeText={text => update('invoiceNumber', text)}
                  placeholder="EMP-056"
                />
                <FormField
                  label="Customer"
                  value={form.customer}
                  onChangeText={text => update('customer', text)}
                  placeholder="customer"
                />
              </FormRow>

              <FormRow>
                <FormField
                  label="Vehicle"
                  value={form.vehicle}
                  onChangeText={text => update('vehicle', text)}
                  placeholder="vehicle"
                />
                <FormSelect
                  label="Status"
                  value={form.status}
                  options={['Unpaid', 'Paid']}
                  onChange={value =>
                    update('status', value as 'Unpaid' | 'Paid')
                  }
                />
              </FormRow>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmBtn}
                onPress={() => {
                  onConfirm?.(form);
                  onClose();
                }}>
                <Text style={styles.confirmText}>Confirm</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: c.textDark,
    marginBottom: 14,
  },
  formScroll: {
    maxHeight: 360,
  },
  formContent: {
    gap: 10,
    paddingBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 0.75,
    borderTopColor: c.borderSoft,
  },
  cancelBtn: {
    minWidth: 68,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.75,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '500',
    color: c.textDark,
  },
  confirmBtn: {
    minWidth: 88,
    height: 30,
    borderRadius: 15,
    backgroundColor: c.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.white,
  },
});
}
