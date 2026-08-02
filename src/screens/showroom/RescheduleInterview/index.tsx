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
import {useRescheduleInterviewController} from './useController';

export function RescheduleInterview() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    headerSubtitle,
    originalSlot,
    notice,
    form,
    suggestedSlots,
    setField,
    onUseSlot,
    onBackPress,
    onCancelPress,
    onCancelInterviewPress,
    onReschedulePress,
  } = useRescheduleInterviewController();
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
                <Text style={styles.pageTitle}>Reschedule Interview</Text>
                <Text style={styles.pageSubtitle}>{headerSubtitle}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.alertBox}>
              <Icon name="alertCircle" size={18} />
              <View style={styles.alertCopy}>
                <Text style={styles.alertTitle}>
                  Original slot: {originalSlot}
                </Text>
                <Text style={styles.alertBody}>{notice}</Text>
              </View>
            </View>

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
                  <Text style={styles.label}>Reason</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={form.reason}
                      onChangeText={value => setField('reason', value)}
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>Message to candidate</Text>
                <View style={styles.textareaWrap}>
                  <TextInput
                    value={form.message}
                    onChangeText={value => setField('message', value)}
                    multiline
                    style={styles.textarea}
                  />
                </View>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelBtn} onPress={onCancelPress}>
                <Icon name="chevronLeft" size={14} color={colors.textDark} />
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.dangerTextBtn}
                onPress={onCancelInterviewPress}>
                <Text style={styles.dangerText}>Cancel interview</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={onReschedulePress}>
                <Icon name="checkWhite" size={14} />
                <Text style={styles.submitBtnText}>Reschedule</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.slotsCard}>
            <Text style={styles.slotsLabel}>Suggested slots</Text>
            <View style={styles.slotsList}>
              {suggestedSlots.map(slot => (
                <View key={slot.id} style={styles.slotRow}>
                  <Icon name="shiftClock" size={14} color={colors.actionBlue} />
                  <Text style={styles.slotLabel}>{slot.label}</Text>
                  <Pressable onPress={() => onUseSlot(slot.id)} hitSlop={8}>
                    <Text style={styles.useBtnText}>Use</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
