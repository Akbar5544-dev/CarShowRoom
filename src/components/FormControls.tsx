import React, {memo, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {Icon} from './Icon';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import {
  AppDatePicker,
  formatDateInputValue,
  shouldIncludeTime,
  useParsedPickerDate,
} from './AppDatePicker';

export const GENDER_OPTIONS = ['Male', 'Female', 'Others'] as const;
export const FUEL_TYPE_OPTIONS = [
  'Petrol',
  'Diesel',
  'Hybrid',
  'Electric',
] as const;
export const TRANSMISSION_OPTIONS = ['Auto', 'Manual', 'CVT'] as const;
export const DRIVE_TYPE_OPTIONS = ['AWD', 'RWD', 'FWD', '4WD'] as const;
export const VEHICLE_STATUS_OPTIONS = [
  'Available',
  'Reserved',
  'Maintenance',
] as const;
export const OWNERSHIP_OPTIONS = ['Owned', 'Leased', 'Financed'] as const;
export const BRANCH_OPTIONS = [
  'Downtown',
  'Marina',
  'Airport',
  'Mall Branch',
] as const;
export const EMPLOYEE_ROLE_OPTIONS = [
  'Rental Agent',
  'Fleet Coordinator',
  'Mechanic',
  'Support Lead',
] as const;
export const DEPARTMENT_OPTIONS = [
  'Operations',
  'Sales',
  'Support',
  'Mechanics',
  'Admin',
] as const;
export const EMPLOYMENT_TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Intern',
] as const;
export const EMPLOYMENT_STATUS_OPTIONS = [
  'Active',
  'Probation',
  'On Leave',
] as const;
export const BASIC_SALARY_OPTIONS = [
  '$2,000',
  '$2,400',
  '$2,800',
  '$3,200',
] as const;

/** Figma tokens from Add Employee form (nodes 192:4491 / 192:4782) */
const FIGMA = {
  labelSize: 9,
  labelTracking: 0.225,
  inputHeight: 27,
  selectHeight: 30,
  textareaHeight: 45,
  inputRadius: 18,
  inputFont: 10.5,
  fieldGap: 6.4,
  rowGap: 12,
  stepIcon: 33,
  stepEyebrow: 7.5,
  stepLabel: 10.5,
} as const;

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  fullWidth?: boolean;
  style?: ViewStyle;
};

export const FormField = memo(function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  secureTextEntry,
  keyboardType,
  fullWidth,
  style,
}: FormFieldProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.field, fullWidth && styles.fullWidth, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
});

type FormSelectProps = {
  label: string;
  value: string;
  onPress?: () => void;
  /** When provided, opens a dropdown and calls onChange with the chosen option. */
  options?: readonly string[];
  onChange?: (value: string) => void;
  placeholder?: string;
  title?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export const FormSelect = memo(function FormSelect({
  label,
  value,
  onPress,
  options,
  onChange,
  placeholder = 'Select',
  title,
  fullWidth,
  style,
}: FormSelectProps) {
  const styles = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);
  const hasOptions = Boolean(options?.length);
  const displayValue = value.trim() || placeholder;
  const isPlaceholder = !value.trim();

  const handlePress = () => {
    if (hasOptions) {
      setOpen(true);
      return;
    }
    onPress?.();
  };

  return (
    <View style={[styles.field, fullWidth && styles.fullWidth, style]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={handlePress}>
        <Text
          style={[styles.selectText, isPlaceholder && styles.selectPlaceholder]}
          numberOfLines={1}>
          {displayValue}
        </Text>
        <Icon name="chevronDown" size={8} style={styles.chevron} />
      </Pressable>

      {hasOptions ? (
        <Modal
          transparent
          animationType="fade"
          visible={open}
          presentationStyle="overFullScreen"
          onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.dropdownBackdrop} onPress={() => setOpen(false)}>
            <Pressable style={styles.dropdownSheet} onPress={() => undefined}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>{title ?? label}</Text>
                <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                  <Text style={styles.dropdownDone}>Done</Text>
                </Pressable>
              </View>
              <ScrollView
                style={styles.dropdownList}
                bounces={false}
                keyboardShouldPersistTaps="handled">
                {options!.map(option => {
                  const selected = option === value;
                  return (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownOption,
                        selected && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => {
                        onChange?.(option);
                        setOpen(false);
                      }}>
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          selected && styles.dropdownOptionTextSelected,
                        ]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
});

type FormDateFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Keep existing time suffix when picking a date (mm/dd/yyyy, hh:mm AM). */
  includeTime?: boolean;
  style?: ViewStyle;
};

export const FormDateField = memo(function FormDateField({
  label,
  value,
  onChangeText,
  placeholder = 'mm/dd/yyyy',
  includeTime,
  style,
}: FormDateFieldProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [pickerOpen, setPickerOpen] = useState(false);
  const withTime = shouldIncludeTime(placeholder, includeTime, value);
  const pickerValue = useParsedPickerDate(value);

  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dateInput}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSoft}
          style={styles.dateText}
        />
        <Pressable
          onPress={() => setPickerOpen(true)}
          hitSlop={8}
          accessibilityLabel="Open calendar">
          <Icon name="calendarField" size={11} />
        </Pressable>
      </View>
      <AppDatePicker
        visible={pickerOpen}
        value={pickerValue}
        title="Select Date"
        onClose={() => setPickerOpen(false)}
        onChange={date => {
          onChangeText(formatDateInputValue(date, value, withTime));
        }}
      />
    </View>
  );
});

/** Always 2-column row — matches Figma phone layout */
export const FormRow = memo(function FormRow({
  children,
}: {
  children: React.ReactNode;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={styles.halfChild}>
          {child}
        </View>
      ))}
    </View>
  );
});

type StepItem = {
  id: number;
  label: string;
  icon: IconName;
  activeIcon?: IconName;
};

type OnboardingStepperProps = {
  steps: StepItem[];
  currentStep: number;
};

export const OnboardingStepper = memo(function OnboardingStepper({
  steps,
  currentStep,
}: OnboardingStepperProps) {
  const styles = useThemedStyles(createStyles);

  const rows = [steps.slice(0, 2), steps.slice(2, 4)];

  return (
    <View style={styles.stepper}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.stepRow}>
          {row.map((step, colIndex) => {
            const active = step.id === currentStep;
            const completed = step.id < currentStep;
            const emphasized = active || completed;
            const iconName =
              emphasized && step.activeIcon ? step.activeIcon : step.icon;
            const leftCompleted = colIndex === 1 && row[0].id < currentStep;

            return (
              <React.Fragment key={step.id}>
                {colIndex === 1 ? (
                  <View
                    style={[
                      styles.stepConnector,
                      leftCompleted && styles.stepConnectorDone,
                    ]}
                  />
                ) : null}
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepIcon,
                      completed && styles.stepIconCompleted,
                      active && styles.stepIconActive,
                    ]}>
                    <Icon
                      name={iconName}
                      size={12}
                      color={emphasized ? '#FCFCFC' : undefined}
                    />
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={styles.stepEyebrow}>
                      Step {step.id + 1} of 4
                    </Text>
                    <Text
                      style={[
                        styles.stepLabel,
                        emphasized && styles.stepLabelActive,
                      ]}
                      numberOfLines={2}>
                      {step.label}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      ))}
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  field: {
    width: '100%',
    gap: FIGMA.fieldGap,
    paddingTop: 4,
  },
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: FIGMA.rowGap,
    width: '100%',
  },
  halfChild: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: FIGMA.labelSize,
    fontWeight: '600',
    color: c.textSoft,
    letterSpacing: FIGMA.labelTracking,
    textTransform: 'uppercase',
  },
  input: {
    height: FIGMA.inputHeight,
    borderRadius: FIGMA.inputRadius,
    borderWidth: 0.75,
    borderColor: c.border,
    paddingHorizontal: 9,
    paddingVertical: 0,
    fontSize: FIGMA.inputFont,
    color: c.textDark,
    backgroundColor: c.surface,
  },
  textarea: {
    height: FIGMA.textareaHeight,
    minHeight: FIGMA.textareaHeight,
    paddingTop: 6,
    paddingBottom: 6,
    textAlignVertical: 'top',
  },
  select: {
    height: FIGMA.selectHeight,
    borderRadius: FIGMA.inputRadius,
    borderWidth: 0.75,
    borderColor: c.border,
    backgroundColor: '#F7FBFD',
    paddingLeft: 13,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  selectText: {
    flex: 1,
    fontSize: FIGMA.inputFont,
    color: c.textDark,
    lineHeight: 13,
  },
  selectPlaceholder: {
    color: c.textSoft,
  },
  chevron: {
    width: 8,
    height: 5,
    transform: [{rotate: '90deg'}],
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  dropdownSheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.border,
    marginBottom: 4,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
  dropdownDone: {
    fontSize: 13,
    fontWeight: '600',
    color: c.actionBlue,
  },
  dropdownList: {
    maxHeight: 320,
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F7FF',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: c.textDark,
  },
  dropdownOptionTextSelected: {
    fontWeight: '700',
    color: c.actionBlue,
  },
  dateInput: {
    height: FIGMA.inputHeight,
    borderRadius: FIGMA.inputRadius,
    borderWidth: 0.75,
    borderColor: c.border,
    backgroundColor: c.surface,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    flex: 1,
    fontSize: FIGMA.inputFont,
    color: c.textDark,
    padding: 0,
    lineHeight: 15,
  },
  stepper: {
    gap: 25,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minWidth: 0,
  },
  stepIcon: {
    width: FIGMA.stepIcon,
    height: FIGMA.stepIcon,
    borderRadius: 21,
    backgroundColor: '#EDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepIconActive: {
    backgroundColor: c.actionBlue,
  },
  stepIconCompleted: {
    backgroundColor: '#008443',
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
  },
  stepEyebrow: {
    fontSize: FIGMA.stepEyebrow,
    fontWeight: '600',
    color: c.textSoft,
    letterSpacing: 0.75,
    textTransform: 'uppercase',
    lineHeight: 11,
  },
  stepLabel: {
    fontSize: FIGMA.stepLabel,
    fontWeight: '600',
    color: c.textSoft,
    lineHeight: 15,
  },
  stepLabelActive: {
    color: c.textDark,
  },
  stepConnector: {
    width: 12,
    height: 0.75,
    backgroundColor: c.border,
    marginHorizontal: 4,
    flexShrink: 0,
  },
  stepConnectorDone: {
    backgroundColor: '#008443',
    height: 1.5,
  },
});
}
