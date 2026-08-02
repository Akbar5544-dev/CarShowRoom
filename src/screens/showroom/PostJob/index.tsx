import React, {useState} from 'react';
import {Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  AppDatePicker,
  formatDateInputValue,
  Icon,
  Screen,
  useParsedPickerDate,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {PostJobStep, PostJobStepId} from './module';
import {createStyles} from './styles';
import {usePostJobController} from './useController';

function JobStepper({
  steps,
  currentStep,
}: {
  steps: PostJobStep[];
  currentStep: PostJobStepId;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.stepperContent}
      style={styles.stepperScroll}>
      {steps.map(step => {
        const active = step.id === currentStep;
        const done = step.id < currentStep;
        const emphasized = active || done;
        const accent = emphasized ? colors.actionBlue : colors.textSecondary;

        return (
          <View
            key={step.id}
            style={[
              styles.stepPill,
              done && styles.stepPillDone,
              active && styles.stepPillActive,
            ]}>
            <View
              style={[
                styles.stepNumber,
                emphasized && styles.stepNumberActive,
              ]}>
              <Text
                style={[
                  styles.stepNumberText,
                  emphasized && styles.stepNumberTextActive,
                ]}>
                {step.id + 1}
              </Text>
            </View>
            <Icon name={step.icon} size={12} color={accent} />
            <Text
              style={[
                styles.stepPillText,
                emphasized && styles.stepPillTextActive,
              ]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline,
  fullWidth,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: 'calendarField';
  multiline?: boolean;
  fullWidth?: boolean;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerValue = useParsedPickerDate(value);
  const isDateField = icon === 'calendarField';

  return (
    <View style={fullWidth ? styles.fieldFull : styles.field}>
      <Text style={styles.label}>{label}</Text>
      {multiline ? (
        <View style={styles.textareaWrap}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSoft}
            multiline
            style={styles.textarea}
          />
        </View>
      ) : (
        <View style={styles.inputWrap}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSoft}
            style={styles.input}
          />
          {isDateField ? (
            <Pressable
              onPress={() => setPickerOpen(true)}
              hitSlop={8}
              accessibilityLabel="Open calendar">
              <Icon name={icon} size={14} color={colors.textSoft} />
            </Pressable>
          ) : icon ? (
            <Icon name={icon} size={14} color={colors.textSoft} />
          ) : null}
        </View>
      )}
      {isDateField ? (
        <AppDatePicker
          visible={pickerOpen}
          value={pickerValue}
          onClose={() => setPickerOpen(false)}
          onChange={date => {
            onChangeText(formatDateInputValue(date, value));
          }}
        />
      ) : null}
    </View>
  );
}

export function PostJob() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    currentStep,
    steps,
    form,
    stepSubtitle,
    canGoPrevious,
    isLastStep,
    reviewDescription,
    reviewCards,
    setField,
    onBackPress,
    onPrevious,
    onContinue,
    onSaveDraft,
    onPublish,
  } = usePostJobController();

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}
        keyboardOpeningTime={0}
        enableAutomaticScroll>
        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={12} color={colors.white} />
              </Pressable>
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle} numberOfLines={1}>
                  Post a New Job
                </Text>
                <Text style={styles.pageSubtitle} numberOfLines={1}>
                  {stepSubtitle}
                </Text>
              </View>
            </View>
          </View>

          <JobStepper steps={steps} currentStep={currentStep} />

          <View style={styles.card}>
            {currentStep === 0 ? (
              <View style={styles.fieldsGrid}>
                <View style={styles.fieldRow}>
                  <Field
                    label="Job Title"
                    value={form.jobTitle}
                    onChangeText={text => setField('jobTitle', text)}
                  />
                  <Field
                    label="Department"
                    value={form.department}
                    onChangeText={text => setField('department', text)}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Employment Type"
                    value={form.employmentType}
                    onChangeText={text => setField('employmentType', text)}
                  />
                  <Field
                    label="Experience Level"
                    value={form.experienceLevel}
                    onChangeText={text => setField('experienceLevel', text)}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Location"
                    value={form.location}
                    onChangeText={text => setField('location', text)}
                  />
                  <Field
                    label="Work Mode"
                    value={form.workMode}
                    onChangeText={text => setField('workMode', text)}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Openings"
                    value={form.openings}
                    onChangeText={text => setField('openings', text)}
                  />
                  <Field
                    label="Application Deadline"
                    value={form.applicationDeadline}
                    onChangeText={text => setField('applicationDeadline', text)}
                    placeholder="mm/dd/yyyy"
                    icon="calendarField"
                  />
                </View>
              </View>
            ) : null}

            {currentStep === 1 ? (
              <View style={styles.fieldsGrid}>
                <Field
                  label="Summary"
                  value={form.summary}
                  onChangeText={text => setField('summary', text)}
                  multiline
                  fullWidth
                />
                <Field
                  label="Responsibilities"
                  value={form.responsibilities}
                  onChangeText={text => setField('responsibilities', text)}
                  multiline
                  fullWidth
                />
                <Field
                  label="What You'll Do"
                  value={form.whatYoullDo}
                  onChangeText={text => setField('whatYoullDo', text)}
                  multiline
                  fullWidth
                />
              </View>
            ) : null}

            {currentStep === 2 ? (
              <View style={styles.fieldsGrid}>
                <View style={styles.fieldRow}>
                  <Field
                    label="Must-Have Skills"
                    value={form.mustHaveSkills}
                    onChangeText={text => setField('mustHaveSkills', text)}
                  />
                  <Field
                    label="Nice-to-Have Skills"
                    value={form.niceToHaveSkills}
                    onChangeText={text => setField('niceToHaveSkills', text)}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Education"
                    value={form.education}
                    onChangeText={text => setField('education', text)}
                  />
                  <Field
                    label="Years of Experience"
                    value={form.yearsOfExperience}
                    onChangeText={text => setField('yearsOfExperience', text)}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Certifications"
                    value={form.certifications}
                    onChangeText={text => setField('certifications', text)}
                  />
                  <View style={styles.field} />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Salary Range (Min)"
                    value={form.salaryMin}
                    onChangeText={text => setField('salaryMin', text)}
                  />
                  <Field
                    label="Salary Range (Max)"
                    value={form.salaryMax}
                    onChangeText={text => setField('salaryMax', text)}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Field
                    label="Currency"
                    value={form.currency}
                    onChangeText={text => setField('currency', text)}
                  />
                  <Field
                    label="Pay Frequency"
                    value={form.payFrequency}
                    onChangeText={text => setField('payFrequency', text)}
                  />
                </View>
                <Field
                  label="Benefits"
                  value={form.benefits}
                  onChangeText={text => setField('benefits', text)}
                  fullWidth
                />
              </View>
            ) : null}

            {currentStep === 3 ? (
              <View style={styles.fieldsGrid}>
                <View style={styles.previewBox}>
                  <Text style={styles.previewEyebrow}>Preview</Text>
                  <Text style={styles.previewTitle}>{form.jobTitle}</Text>
                  <Text style={styles.previewDescription}>
                    {reviewDescription}
                  </Text>
                </View>
                <View style={styles.reviewGrid}>
                  {reviewCards.map(card => (
                    <View key={card.id} style={styles.reviewCard}>
                      <View style={styles.reviewIcon}>
                        <Icon
                          name={card.icon}
                          size={14}
                          color={colors.actionBlue}
                        />
                      </View>
                      <View style={styles.reviewCopy}>
                        <Text style={styles.reviewLabel}>{card.label}</Text>
                        <Text style={styles.reviewValue} numberOfLines={2}>
                          {card.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.backStepBtn,
                  !canGoPrevious && styles.backStepBtnDisabled,
                ]}
                onPress={onPrevious}
                disabled={!canGoPrevious}>
                <Icon name="chevronLeft" size={14} color={colors.textDark} />
                <Text style={styles.backStepBtnText}>Back</Text>
              </Pressable>

              <Pressable style={styles.draftBtn} onPress={onSaveDraft}>
                <Text style={styles.draftBtnText}>Save as draft</Text>
              </Pressable>

              {isLastStep ? (
                <Pressable style={styles.continueBtn} onPress={onPublish}>
                  <Icon name="checkWhite" size={14} />
                  <Text style={styles.continueBtnText}>Publish Job</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.continueBtn} onPress={onContinue}>
                  <Text style={styles.continueBtnText}>Continue</Text>
                  <Icon name="arrowRight" size={12} color={colors.white} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
