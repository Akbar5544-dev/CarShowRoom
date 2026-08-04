import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import {Icon} from './Icon';

export type RentalWizardStep = {
  id: number;
  label: string;
  icon: IconName;
};

type RentalWizardStepperProps = {
  steps: RentalWizardStep[];
  currentStep: number;
};

export const RentalWizardStepper = memo(function RentalWizardStepper({
  steps,
  currentStep,
}: RentalWizardStepperProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const progress = ((currentStep + 1) / Math.max(steps.length, 1)) * 100;

  return (
    <View style={styles.wrap}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${progress}%`}]} />
      </View>
      <View style={styles.track}>
        {steps.map((step, index) => {
          const active = step.id === currentStep;
          const completed = step.id < currentStep;
          const emphasized = active || completed;

          return (
            <View key={step.id} style={styles.stepWrap}>
              {index > 0 ? (
                <View
                  style={[
                    styles.connector,
                    completed && styles.connectorDone,
                    active && styles.connectorActive,
                  ]}
                />
              ) : null}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.iconCircle,
                    completed && styles.iconCircleCompleted,
                    active && styles.iconCircleActive,
                  ]}>
                  {completed ? (
                    <Icon name="activityCheck" size={12} color={colors.white} />
                  ) : (
                    <Icon
                      name={step.icon}
                      size={12}
                      color={emphasized ? colors.white : colors.textSoft}
                    />
                  )}
                </View>
                <Text
                  style={[styles.label, emphasized && styles.labelActive]}
                  numberOfLines={1}>
                  {step.label}
                </Text>
                {active ? <View style={styles.activeDot} /> : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrap: {
      gap: 12,
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.borderSoft,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 12,
    },
    progressTrack: {
      height: 4,
      borderRadius: 999,
      backgroundColor: c.searchBg,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: c.actionBlue,
    },
    track: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    stepWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    connector: {
      position: 'absolute',
      left: -10,
      right: '50%',
      top: 15,
      height: 2,
      backgroundColor: c.borderSoft,
    },
    connectorDone: {
      backgroundColor: c.successBright,
    },
    connectorActive: {
      backgroundColor: c.actionTint15,
    },
    stepItem: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },
    iconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.searchBg,
      borderWidth: 1,
      borderColor: c.borderSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircleActive: {
      backgroundColor: c.actionBlue,
      borderColor: c.actionBlue,
      shadowColor: c.actionBlue,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.28,
      shadowRadius: 8,
      elevation: 3,
    },
    iconCircleCompleted: {
      backgroundColor: c.successBright,
      borderColor: c.successBright,
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: c.textSoft,
      textAlign: 'center',
    },
    labelActive: {
      color: c.textDark,
      fontWeight: '700',
    },
    activeDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.actionBlue,
      marginTop: 1,
    },
  });
}
