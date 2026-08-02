import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  AppDatePicker,
  formatDateInputValue,
  Icon,
  Screen,
  useParsedPickerDate,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useScheduleInterviewController} from './useController';

export function ScheduleInterview() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    headerSubtitle,
    form,
    setField,
    onBackPress,
    onCancelPress,
    onSchedulePress,
  } = useScheduleInterviewController();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const pickerValue = useParsedPickerDate(form.date);

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
                <Text style={styles.pageTitle}>Schedule Interview</Text>
                <Text style={styles.pageSubtitle}>{headerSubtitle}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldsGrid}>
              <View style={styles.fieldRow}>
                <View style={styles.field}>
                  <Text style={styles.label}>New date</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.date}
                      onChangeText={value => setField('date', value)}
                      placeholder="mm/dd/yyyy"
                      placeholderTextColor={colors.textSoft}
                      style={styles.input}
                    />
                    <Pressable
                      onPress={() => setDatePickerOpen(true)}
                      hitSlop={8}
                      accessibilityLabel="Open calendar">
                      <Icon
                        name="calendarField"
                        size={14}
                        color={colors.textSoft}
                      />
                    </Pressable>
                  </View>
                  <AppDatePicker
                    visible={datePickerOpen}
                    value={pickerValue}
                    onClose={() => setDatePickerOpen(false)}
                    onChange={date => {
                      setField('date', formatDateInputValue(date, form.date));
                    }}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>New time</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.time}
                      onChangeText={value => setField('time', value)}
                      placeholder="02:00 PM"
                      placeholderTextColor={colors.textSoft}
                      style={styles.input}
                    />
                    <Icon name="shiftClock" size={14} color={colors.textSoft} />
                  </View>
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.field}>
                  <Text style={styles.label}>Candidate</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.candidate}
                      onChangeText={value => setField('candidate', value)}
                      style={styles.input}
                    />
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Position</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.position}
                      onChangeText={value => setField('position', value)}
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.field}>
                  <Text style={styles.label}>Duration</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.duration}
                      onChangeText={value => setField('duration', value)}
                      style={styles.input}
                    />
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Mode</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.mode}
                      onChangeText={value => setField('mode', value)}
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>Location / Meeting link</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={form.location}
                    onChangeText={value => setField('location', value)}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>
                  Select the interviewers on this panel:
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={form.interviewers}
                    onChangeText={value => setField('interviewers', value)}
                    placeholder="search"
                    placeholderTextColor={colors.textSoft}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>Email subject</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={form.emailSubject}
                    onChangeText={value => setField('emailSubject', value)}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>Message to candidate</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={form.message}
                    onChangeText={value => setField('message', value)}
                    style={styles.input}
                  />
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelBtn} onPress={onCancelPress}>
                <Icon name="chevronLeft" size={14} color={colors.textDark} />
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={onSchedulePress}>
                <Icon name="checkWhite" size={14} />
                <Text style={styles.submitBtnText}>Schedule</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
