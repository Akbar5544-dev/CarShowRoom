import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  formatDateInputValue,
  parseDateInput,
} from './AppDatePicker';
import {FormDateField} from './FormControls';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import type {VehicleInventoryItem} from './VehicleInventoryCard';

export type VehicleAuctionFormValues = {
  starting_bid: string;
  ends_at: string;
};

type VehicleAuctionBidModalProps = {
  visible: boolean;
  item: VehicleInventoryItem | null;
  defaultBid?: string;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (values: VehicleAuctionFormValues) => void;
};

function defaultEndsAtInput(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(23, 59, 0, 0);
  return formatDateInputValue(date, '', true);
}

/** Convert UI date to API `ends_at` (ISO-8601). */
export function toAuctionEndsAt(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  // Already ISO / Y-m-d H:i:s
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const parsed = new Date(trimmed.replace(' ', 'T'));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  const parsed = parseDateInput(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  // If user picked date-only, end of that day
  if (!/,\s*\d{1,2}:\d{2}/i.test(trimmed)) {
    parsed.setHours(23, 59, 0, 0);
  }
  return parsed.toISOString();
}

export const VehicleAuctionBidModal = memo(function VehicleAuctionBidModal({
  visible,
  item,
  defaultBid = '',
  submitting = false,
  onClose,
  onConfirm,
}: VehicleAuctionBidModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [startingBid, setStartingBid] = useState(defaultBid);
  const [endsAt, setEndsAt] = useState(defaultEndsAtInput);

  useEffect(() => {
    if (visible) {
      setStartingBid(defaultBid);
      setEndsAt(defaultEndsAtInput());
    }
  }, [visible, defaultBid, item?.id]);

  const title = item ? `${item.make} ${item.model}`.trim() : 'Vehicle';
  const cleanedBid = startingBid.replace(/[^0-9.]/g, '').trim();
  const endsAtIso = toAuctionEndsAt(endsAt);
  const canSubmit =
    cleanedBid.length > 0 && Boolean(endsAtIso) && !submitting;

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
            <Text style={styles.eyebrow}>AUCTION</Text>
            <Text style={styles.title}>List for auction</Text>
            <Text style={styles.subtitle}>
              Set starting bid and end time for {title}.
            </Text>

            <Text style={styles.label}>Starting bid</Text>
            <TextInput
              style={styles.input}
              value={startingBid}
              onChangeText={setStartingBid}
              placeholder="e.g. 2500000"
              placeholderTextColor={colors.textSoft}
              keyboardType="decimal-pad"
              editable={!submitting}
              autoFocus
            />

            <FormDateField
              label="Ends at"
              value={endsAt}
              onChangeText={setEndsAt}
              placeholder="mm/dd/yyyy, hh:mm AM"
              includeTime
              style={styles.dateField}
            />

            <View style={styles.actions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={submitting}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, !canSubmit && styles.confirmDisabled]}
                disabled={!canSubmit}
                onPress={() => {
                  if (!endsAtIso) {
                    return;
                  }
                  onConfirm({
                    starting_bid: cleanedBid,
                    ends_at: endsAtIso,
                  });
                }}>
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.confirmBtnText}>List auction</Text>
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
    },
    card: {
      width: '100%',
      backgroundColor: c.surface,
      borderRadius: 28,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.16,
      shadowRadius: 20,
      elevation: 8,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '600',
      color: c.actionBlue,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: c.textDark,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: c.textSoft,
      marginBottom: 18,
    },
    label: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.4,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    input: {
      height: 48,
      borderRadius: 14,
      borderWidth: 0.75,
      borderColor: c.border,
      backgroundColor: c.background,
      paddingHorizontal: 14,
      fontSize: 16,
      fontWeight: '600',
      color: c.textDark,
      marginBottom: 14,
    },
    dateField: {
      marginBottom: 18,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
    },
    cancelBtn: {
      flex: 1,
      height: 46,
      borderRadius: 999,
      borderWidth: 0.75,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textDark,
    },
    confirmBtn: {
      flex: 1.2,
      height: 46,
      borderRadius: 999,
      backgroundColor: c.actionBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmDisabled: {
      opacity: 0.5,
    },
    confirmBtnText: {
      fontSize: 14,
      fontWeight: '700',
      color: c.white,
    },
  });
}
