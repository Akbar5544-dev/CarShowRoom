import React, {memo} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import type {VehicleInventoryItem} from './VehicleInventoryCard';

export type VehiclePostListingChoice = 'sale' | 'rent';

type VehiclePostTypeModalProps = {
  visible: boolean;
  item: VehicleInventoryItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSelect: (choice: VehiclePostListingChoice) => void;
};

export const VehiclePostTypeModal = memo(function VehiclePostTypeModal({
  visible,
  item,
  submitting = false,
  onClose,
  onSelect,
}: VehiclePostTypeModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const title = item
    ? `${item.make} ${item.model}`.trim()
    : 'Vehicle';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>POST VEHICLE</Text>
          <Text style={styles.title}>How do you want to list?</Text>
          <Text style={styles.subtitle}>
            Choose how to publish {title} on the customer marketplace.
          </Text>

          <View style={styles.options}>
            <Pressable
              style={[styles.optionCard, submitting && styles.optionDisabled]}
              disabled={submitting}
              onPress={() => onSelect('sale')}>
              <View style={[styles.optionIcon, styles.saleIcon]}>
                <Icon name="activityDollar" size={16} color={colors.white} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>For Sale</Text>
                <Text style={styles.optionSubtitle}>
                  Publish on feed as For Sale
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.optionCard, submitting && styles.optionDisabled]}
              disabled={submitting}
              onPress={() => onSelect('rent')}>
              <View style={[styles.optionIcon, styles.rentIcon]}>
                <Icon name="navRentals" size={16} color={colors.white} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>For Rent</Text>
                <Text style={styles.optionSubtitle}>
                  Publish on feed as For Rent
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose} disabled={submitting}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </Pressable>
        </View>
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
    card: {
      width: '100%',
      maxWidth: 353,
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
      marginBottom: 16,
    },
    options: {
      gap: 10,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 18,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      backgroundColor: c.background,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    optionDisabled: {
      opacity: 0.55,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saleIcon: {
      backgroundColor: '#059669',
    },
    rentIcon: {
      backgroundColor: c.actionBlue,
    },
    optionText: {
      flex: 1,
      gap: 2,
    },
    optionLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textDark,
    },
    optionSubtitle: {
      fontSize: 12,
      lineHeight: 16,
      color: c.textSoft,
    },
    closeBtn: {
      marginTop: 14,
      height: 44,
      borderRadius: 999,
      borderWidth: 0.75,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textDark,
    },
  });
}
