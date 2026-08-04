import React, {memo} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type DateRangePreset = 'all' | 'daily' | 'weekly' | 'monthly';

type DateRangeOption = {
  id: DateRangePreset;
  label: string;
  subtitle: string;
  icon: 'shiftClock' | 'navRentals' | 'monthlySalary' | 'activityCheck';
};

const OPTIONS: DateRangeOption[] = [
  {
    id: 'daily',
    label: 'Daily',
    subtitle: "Today's rental orders",
    icon: 'shiftClock',
  },
  {
    id: 'weekly',
    label: 'Weekly',
    subtitle: 'Orders from this week',
    icon: 'navRentals',
  },
  {
    id: 'monthly',
    label: 'Monthly',
    subtitle: 'Orders from this month',
    icon: 'monthlySalary',
  },
  {
    id: 'all',
    label: 'All time',
    subtitle: 'Show every order',
    icon: 'activityCheck',
  },
];

type DateRangeFilterModalProps = {
  visible: boolean;
  selected: DateRangePreset;
  onClose: () => void;
  onSelect: (preset: DateRangePreset) => void;
};

export const DateRangeFilterModal = memo(function DateRangeFilterModal({
  visible,
  selected,
  onClose,
  onSelect,
}: DateRangeFilterModalProps) {
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
        <View style={styles.card}>
          <Text style={styles.eyebrow}>FILTER</Text>
          <Text style={styles.title}>Date range</Text>
          <Text style={styles.subtitle}>
            Choose a period to filter rental orders.
          </Text>

          <View style={styles.options}>
            {OPTIONS.map(option => {
              const isActive = selected === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionCard, isActive && styles.optionCardActive]}
                  onPress={() => {
                    onSelect(option.id);
                    onClose();
                  }}>
                  <View
                    style={[
                      styles.optionIcon,
                      isActive && styles.optionIconActive,
                    ]}>
                    <Icon
                      name={option.icon}
                      size={16}
                      color={isActive ? colors.white : colors.actionBlue}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isActive && styles.optionLabelActive,
                      ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  {isActive ? (
                    <Icon name="activityCheck" size={16} color={colors.actionBlue} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
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
      backgroundColor: 'rgba(237,242,248,0.45)',
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    optionCardActive: {
      borderColor: c.actionBlue,
      backgroundColor: c.actionTint12,
    },
    optionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.actionTint12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionIconActive: {
      backgroundColor: c.actionBlue,
    },
    optionText: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    optionLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: c.textDark,
    },
    optionLabelActive: {
      color: c.actionBlue,
    },
    optionSubtitle: {
      fontSize: 12,
      fontWeight: '400',
      color: c.textSoft,
    },
    closeBtn: {
      marginTop: 18,
      height: 36,
      borderRadius: 18,
      borderWidth: 0.75,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textDark,
    },
  });
}
