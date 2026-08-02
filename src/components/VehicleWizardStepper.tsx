import React, {memo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type VehicleWizardStep = {
  id: number;
  label: string;
};

type VehicleWizardStepperProps = {
  steps: VehicleWizardStep[];
  currentStep: number;
  onStepPress?: (stepId: number) => void;
};

export const VehicleWizardStepper = memo(function VehicleWizardStepper({
  steps,
  currentStep,
  onStepPress,
}: VehicleWizardStepperProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.track}>
      {steps.map(step => {
        const active = step.id === currentStep;
        const completed = step.id < currentStep;
        return (
          <Pressable
            key={step.id}
            onPress={() => onStepPress?.(step.id)}
            style={[
              styles.pill,
              completed && styles.pillCompleted,
              active && styles.pillActive,
            ]}>
            {completed ? (
              <Icon name="activityCheck" size={10} color={colors.successBright} />
            ) : null}
            <Text
              style={[
                styles.pillText,
                completed && styles.pillTextCompleted,
                active && styles.pillTextActive,
              ]}
              numberOfLines={1}>
              {step.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    track: {
      gap: 6,
      paddingVertical: 2,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      height: 28,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: c.searchBg,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      maxWidth: 160,
    },
    pillActive: {
      backgroundColor: c.actionBlue,
      borderColor: c.actionBlue,
    },
    pillCompleted: {
      backgroundColor: c.badgeActiveBg,
      borderColor: 'rgba(32,180,107,0.25)',
    },
    pillText: {
      fontSize: 9,
      fontWeight: '600',
      color: c.textSoft,
    },
    pillTextActive: {
      color: c.white,
    },
    pillTextCompleted: {
      color: c.successBright,
    },
  });
}
