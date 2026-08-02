import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {NewHireItem, OnboardingTask} from './module';
import {createStyles} from './styles';
import {useJobsOnboardingController} from './useController';

function NewHireRow({hire}: {hire: NewHireItem}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.hireItem}>
      <View style={styles.hireTop}>
        <View style={[styles.avatar, {backgroundColor: hire.avatarColor}]}>
          <Text style={styles.avatarText}>{hire.initials}</Text>
        </View>
        <View style={styles.hireMain}>
          <Text style={styles.hireName}>{hire.name}</Text>
          <Text style={styles.hireRole}>{hire.role}</Text>
        </View>
        <Text style={styles.progressLabel}>{hire.progress}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${hire.progress}%`}]} />
      </View>
    </View>
  );
}

function ChecklistRow({
  task,
  onAssignPress,
}: {
  task: OnboardingTask;
  onAssignPress: (taskId: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.checklistItem}>
      {task.completed ? (
        <View style={styles.checkDone}>
          <Icon name="checkWhite" size={10} color={colors.white} />
        </View>
      ) : (
        <View style={styles.checkPending} />
      )}
      <Text
        style={[
          styles.checklistLabel,
          task.completed && styles.checklistLabelDone,
        ]}>
        {task.label}
      </Text>
      {!task.completed ? (
        <Pressable
          onPress={() => onAssignPress(task.id)}
          hitSlop={8}
          accessibilityLabel={`Assign ${task.label}`}>
          <Text style={styles.assignText}>Assign</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function JobsOnboarding() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    summary,
    newHires,
    checklistRole,
    checklistTitle,
    checklist,
    onBackPress,
    onHiringPress,
    onAssignPress,
  } = useJobsOnboardingController();

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
                <Text style={styles.pageTitle}>Onboarding</Text>
                <Text style={styles.pageSubtitle}>{summary}</Text>
              </View>
            </View>

            <Pressable style={styles.hiringBtn} onPress={onHiringPress}>
              <Icon name="addUser" size={13} color={colors.white} />
              <Text style={styles.hiringBtnText}>Hiring</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>In progress</Text>
              <Text style={styles.sectionTitle}>New Hires</Text>
            </View>
            <View style={styles.hireList}>
              {newHires.map(hire => (
                <NewHireRow key={hire.id} hire={hire} />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{checklistRole}</Text>
              <Text style={styles.sectionTitle}>{checklistTitle}</Text>
            </View>
            <View style={styles.checklistList}>
              {checklist.map(task => (
                <ChecklistRow
                  key={task.id}
                  task={task}
                  onAssignPress={onAssignPress}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
