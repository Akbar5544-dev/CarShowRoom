import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.track}>
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
                  <Icon name="activityCheck" size={10} color={colors.white} />
                ) : (
                  <Icon
                    name={step.icon}
                    size={10}
                    color={emphasized ? colors.white : colors.textSoft}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  emphasized && styles.labelActive,
                ]}
                numberOfLines={1}>
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    track: {
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: 2,
      gap: 0,
    },
    stepWrap: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    connector: {
      width: 10,
      height: 2,
      backgroundColor: c.borderSoft,
      marginTop: 13,
      marginHorizontal: 0,
    },
    connectorDone: {
      backgroundColor: c.successBright,
    },
    stepItem: {
      alignItems: 'center',
      width: 48,
      gap: 4,
    },
    iconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: c.searchBg,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircleActive: {
      backgroundColor: c.actionBlue,
      borderColor: c.actionBlue,
    },
    iconCircleCompleted: {
      backgroundColor: c.successBright,
      borderColor: c.successBright,
    },
    label: {
      fontSize: 7.5,
      fontWeight: '600',
      color: c.textSoft,
      textAlign: 'center',
    },
    labelActive: {
      color: c.actionBlue,
    },
  });
}
