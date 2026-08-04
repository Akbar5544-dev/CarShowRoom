import React, {memo, useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
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

const TRACK_GAP = 4;
const HORIZONTAL_INSET = 40;

export const VehicleWizardStepper = memo(function VehicleWizardStepper({
  steps,
  currentStep,
  onStepPress,
}: VehicleWizardStepperProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width: windowWidth} = useWindowDimensions();

  const {useScroll, pillWidth} = useMemo(() => {
    const count = Math.max(steps.length, 1);
    const available = windowWidth - HORIZONTAL_INSET - TRACK_GAP * (count - 1);
    const equalWidth = Math.floor(available / count);
    const minComfortableWidth = count > 5 ? 58 : 72;

    if (equalWidth >= minComfortableWidth) {
      return {useScroll: false, pillWidth: undefined};
    }

    return {
      useScroll: true,
      pillWidth: minComfortableWidth,
    };
  }, [steps.length, windowWidth]);

  const renderStep = (step: VehicleWizardStep, fillRow?: boolean) => {
    const active = step.id === currentStep;
    const completed = step.id < currentStep;
    const upcoming = step.id > currentStep;

    return (
      <Pressable
        key={step.id}
        disabled={upcoming}
        onPress={() => onStepPress?.(step.id)}
        style={({pressed}) => [
          styles.pill,
          fillRow ? styles.pillFill : pillWidth != null ? {width: pillWidth} : null,
          completed && styles.pillCompleted,
          active && styles.pillActive,
          upcoming && styles.pillUpcoming,
          pressed && !upcoming && styles.pillPressed,
        ]}>
        <View style={styles.pillContent}>
          {completed ? (
            <View style={styles.checkWrap}>
              <Icon name="activityCheck" size={10} color={colors.successBright} />
            </View>
          ) : null}
          <Text
            style={[
              styles.pillText,
              completed && styles.pillTextCompleted,
              active && styles.pillTextActive,
              upcoming && styles.pillTextUpcoming,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}>
            {step.label}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (useScroll) {
    return (
      <View style={styles.wrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollTrack}>
          {steps.map(step => renderStep(step))}
        </ScrollView>
      </View>
    );
  }

  return (
      <View style={styles.wrapper}>
        <View style={styles.track}>{steps.map(step => renderStep(step, true))}</View>
      </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
      borderRadius: 14,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      backgroundColor: c.surface,
      padding: 4,
      shadowColor: '#0B152C',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 1,
    },
    track: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: TRACK_GAP,
      width: '100%',
    },
    scrollTrack: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: TRACK_GAP,
      paddingHorizontal: 1,
    },
    pill: {
      height: 34,
      borderRadius: 10,
      backgroundColor: c.searchBg,
      borderWidth: 0.75,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      flexShrink: 0,
    },
    pillFill: {
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
    pillActive: {
      backgroundColor: c.actionBlue,
      borderColor: c.actionBlue,
      shadowColor: c.actionBlue,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.22,
      shadowRadius: 6,
      elevation: 2,
    },
    pillCompleted: {
      backgroundColor: c.badgeActiveBg,
      borderColor: 'rgba(32,180,107,0.22)',
    },
    pillUpcoming: {
      backgroundColor: 'rgba(241,244,248,0.9)',
      borderColor: c.borderSoft,
      opacity: 0.72,
    },
    pillPressed: {
      opacity: 0.88,
    },
    pillContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      width: '100%',
      paddingHorizontal: 2,
    },
    checkWrap: {
      width: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    pillText: {
      flexShrink: 1,
      fontSize: 10,
      fontWeight: '600',
      color: c.textSoft,
      textAlign: 'center',
      letterSpacing: -0.1,
    },
    pillTextActive: {
      color: c.white,
      fontWeight: '700',
    },
    pillTextCompleted: {
      color: c.successBright,
      fontWeight: '700',
    },
    pillTextUpcoming: {
      color: c.textSoft,
      fontWeight: '500',
    },
  });
}
