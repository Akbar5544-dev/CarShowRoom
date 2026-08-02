import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {InterviewCardData, InterviewStatus} from './module';
import {createStyles} from './styles';
import {useInterviewScheduleController} from './useController';

function statusColors(status: InterviewStatus) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  if (status === 'Upcoming') {
    return {
      backgroundColor: colors.actionTint12,
      textColor: colors.actionBlue,
    };
  }
  return {
    backgroundColor: colors.track,
    textColor: colors.textSecondary,
  };
}

function InterviewCard({
  interview,
  onReschedulePress,
  onJoinCallPress,
}: {
  interview: InterviewCardData;
  onReschedulePress: (id: string) => void;
  onJoinCallPress: (id: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const badge = statusColors(interview.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardMain}>
          <Text style={styles.candidateName}>{interview.candidateName}</Text>
          <Text style={styles.position}>{interview.position}</Text>
        </View>
        <View
          style={[styles.statusBadge, {backgroundColor: badge.backgroundColor}]}>
          <Text style={[styles.statusBadgeText, {color: badge.textColor}]}>
            {interview.status}
          </Text>
        </View>
      </View>

      <View style={styles.metaList}>
        <View style={styles.metaItem}>
          <View style={styles.metaIcon}>
            <Icon name="calendarField" size={13} color={colors.actionBlue} />
          </View>
          <Text style={styles.metaText}>{interview.scheduleLabel}</Text>
        </View>
        <View style={styles.metaItem}>
          <View style={styles.metaIcon}>
            <Icon name="location" size={13} color={colors.actionBlue} />
          </View>
          <Text style={styles.metaText}>{interview.mode}</Text>
        </View>
        <View style={styles.metaItem}>
          <View style={styles.metaIcon}>
            <Icon name="shiftClock" size={13} color={colors.actionBlue} />
          </View>
          <Text style={styles.metaText}>{interview.interviewers}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardActions}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => onReschedulePress(interview.id)}>
          <Text style={styles.secondaryBtnText}>Reschedule</Text>
        </Pressable>
        <Pressable
          style={styles.joinBtn}
          onPress={() => onJoinCallPress(interview.id)}>
          <Text style={styles.joinBtnText}>Join Call</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function InterviewSchedule() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    subtitle,
    interviews,
    onBackPress,
    onSchedulePress,
    onReschedulePress,
    onJoinCallPress,
  } = useInterviewScheduleController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
                <Text style={styles.pageTitle}>Interview Schedule</Text>
                <Text style={styles.pageSubtitle}>{subtitle}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.primaryBtn} onPress={onSchedulePress}>
                <Icon name="addPlus" size={11} color={colors.white} />
                <Text style={styles.primaryBtnText}>Schedule</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.list}>
            {interviews.map(interview => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onReschedulePress={onReschedulePress}
                onJoinCallPress={onJoinCallPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
