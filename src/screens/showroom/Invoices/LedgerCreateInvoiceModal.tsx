import React, {memo} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {FormDateField, FormField, FormRow, FormSelect} from '../../../components/FormControls';
import {Icon} from '../../../components/Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';
import type {CreateInvoiceForm, InvoiceLineItem} from './module';

type Props = {
  visible: boolean;
  form: CreateInvoiceForm;
  totalLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  updateField: <K extends keyof CreateInvoiceForm>(
    key: K,
    value: CreateInvoiceForm[K],
  ) => void;
  updateLineItem: (
    id: string,
    key: keyof Omit<InvoiceLineItem, 'id'>,
    value: string,
  ) => void;
  onAddLineRow: () => void;
  onRemoveLineRow: (id: string) => void;
};

const TYPE_OPTIONS = ['Receivable AR', 'Payable AP'] as const;
const CATEGORY_OPTIONS = ['Sales', 'Rental', 'Service', 'Parts', 'Other'];
const STATUS_OPTIONS = ['Draft', 'Sent', 'Paid', 'Overdue'];

export const LedgerCreateInvoiceModal = memo(function LedgerCreateInvoiceModal({
  visible,
  form,
  totalLabel,
  onClose,
  onConfirm,
  updateField,
  updateLineItem,
  onAddLineRow,
  onRemoveLineRow,
}: Props) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

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
            <View style={styles.header}>
              <View style={{flex: 1}}>
                <Text style={styles.title}>Create invoice</Text>
                <Text style={styles.subtitle}>
                  Add AR / AP entry with line items
                </Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <Icon name="closeCross" size={14} color={colors.textSoft} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <FormSelect
                label="Type"
                value={
                  form.type === 'Receivable' ? 'Receivable AR' : 'Payable AP'
                }
                options={TYPE_OPTIONS}
                fullWidth
                onChange={value =>
                  updateField(
                    'type',
                    value.startsWith('Receivable') ? 'Receivable' : 'Payable',
                  )
                }
              />
              <FormRow>
                <FormSelect
                  label="Category"
                  value={form.category}
                  options={CATEGORY_OPTIONS}
                  onChange={value => updateField('category', value)}
                />
                <FormSelect
                  label="Status"
                  value={form.status}
                  options={STATUS_OPTIONS}
                  onChange={value =>
                    updateField('status', value as CreateInvoiceForm['status'])
                  }
                />
              </FormRow>
              <FormField
                label="Party name"
                value={form.partyName}
                onChangeText={text => updateField('partyName', text)}
                placeholder="Company or person"
                fullWidth
              />
              <FormField
                label="Party email"
                value={form.partyEmail}
                onChangeText={text => updateField('partyEmail', text)}
                placeholder="billing@example.com"
                keyboardType="email-address"
                fullWidth
              />
              <FormDateField
                label="Due date"
                value={form.dueDate}
                onChangeText={text => updateField('dueDate', text)}
              />

              <View style={styles.linesHeader}>
                <Text style={styles.linesTitle}>Line items</Text>
                <Pressable onPress={onAddLineRow}>
                  <Text style={styles.addRow}>+ Add row</Text>
                </Pressable>
              </View>
              <View style={styles.lineHead}>
                <Text style={[styles.lineHeadText, {flex: 1.4}]}>Description</Text>
                <Text style={[styles.lineHeadText, {width: 44}]}>QTY</Text>
                <Text style={[styles.lineHeadText, {width: 64}]}>Price</Text>
                <View style={{width: 28}} />
              </View>
              {form.lineItems.map(item => (
                <View key={item.id} style={styles.lineRow}>
                  <TextInput
                    value={item.description}
                    onChangeText={text =>
                      updateLineItem(item.id, 'description', text)
                    }
                    placeholder="Item"
                    placeholderTextColor={colors.textSoft}
                    style={[styles.lineInput, {flex: 1.4}]}
                  />
                  <TextInput
                    value={item.qty}
                    onChangeText={text => updateLineItem(item.id, 'qty', text)}
                    keyboardType="number-pad"
                    style={[styles.lineInput, {width: 44}]}
                  />
                  <TextInput
                    value={item.price}
                    onChangeText={text =>
                      updateLineItem(item.id, 'price', text)
                    }
                    keyboardType="decimal-pad"
                    style={[styles.lineInput, {width: 64}]}
                  />
                  <Pressable
                    style={styles.trashBtn}
                    onPress={() => onRemoveLineRow(item.id)}>
                    <Icon name="closeCross" size={12} color={colors.absent} />
                  </Pressable>
                </View>
              ))}

              <FormField
                label="Notes"
                value={form.notes}
                onChangeText={text => updateField('notes', text)}
                placeholder="Optional notes"
                multiline
                fullWidth
              />
            </ScrollView>

            <View style={styles.footer}>
              <Text style={styles.totalText}>Invoice total {totalLabel}</Text>
              <View style={styles.footerActions}>
                <Pressable style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.confirmBtn} onPress={onConfirm}>
                  <Text style={styles.confirmText}>Create invoice</Text>
                </Pressable>
              </View>
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
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    backdropTap: {...StyleSheet.absoluteFill},
    keyboardWrap: {width: '100%', maxWidth: 420, alignSelf: 'center', zIndex: 1},
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      maxHeight: '92%',
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 10,
    },
    title: {fontSize: 20, fontWeight: '700', color: c.textDark},
    subtitle: {marginTop: 2, fontSize: 12, color: c.textSoft},
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.track,
    },
    scroll: {maxHeight: 420},
    scrollContent: {paddingHorizontal: 18, paddingBottom: 12, gap: 10},
    linesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    linesTitle: {fontSize: 13, fontWeight: '700', color: c.textDark},
    addRow: {fontSize: 12, fontWeight: '700', color: c.actionBlue},
    lineHead: {flexDirection: 'row', gap: 6, alignItems: 'center'},
    lineHeadText: {
      fontSize: 9,
      fontWeight: '700',
      color: c.textSoft,
      textTransform: 'uppercase',
    },
    lineRow: {flexDirection: 'row', gap: 6, alignItems: 'center'},
    lineInput: {
      height: 34,
      borderRadius: 12,
      borderWidth: 0.75,
      borderColor: c.border,
      paddingHorizontal: 8,
      fontSize: 12,
      color: c.textDark,
      backgroundColor: c.surface,
    },
    trashBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.borderSoft,
      paddingHorizontal: 18,
      paddingVertical: 12,
      gap: 10,
    },
    totalText: {fontSize: 13, fontWeight: '700', color: c.textDark},
    footerActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    cancelBtn: {
      height: 38,
      paddingHorizontal: 14,
      borderRadius: 19,
      borderWidth: 0.75,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: {fontSize: 13, fontWeight: '600', color: c.textDark},
    confirmBtn: {
      height: 38,
      paddingHorizontal: 14,
      borderRadius: 19,
      backgroundColor: c.actionBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmText: {fontSize: 13, fontWeight: '700', color: c.white},
  });
}
