import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {JobStatus, OpenPositionItem} from './module';
import {createStyles} from './styles';
import {useOpenPositionsController} from './useController';

function getStatusBadge(status: JobStatus) {
  const themeColors = useThemeColors();
  switch (status) {
    case 'open':
      return {
        label: 'Open',
        backgroundColor: themeColors.badgeActiveBg,
        textColor: themeColors.successBright,
      };
    case 'interviewing':
      return {
        label: 'Interviewing',
        backgroundColor: 'rgba(245,158,11,0.15)',
        textColor: themeColors.late,
      };
    case 'closed':
      return {
        label: 'Closed',
        backgroundColor: 'rgba(144,161,185,0.18)',
        textColor: themeColors.statusInactive,
      };
  }
}

function JobCard({
  job,
  onViewApplicantsPress,
}: {
  job: OpenPositionItem;
  onViewApplicantsPress: (jobId: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const badge = getStatusBadge(job.status);

  return (
    <View style={styles.jobCard}>
      <View style={styles.jobTop}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: badge.backgroundColor},
          ]}>
          <Text style={[styles.statusBadgeText, {color: badge.textColor}]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <Text style={styles.jobMeta}>
        {job.department} · {job.employmentType}
      </Text>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Icon name="location" size={12} color={colors.textSecondary} />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="customers" size={12} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {job.applicantCount} applicants
          </Text>
        </View>
        <Text style={styles.salaryText}>{job.salaryRange}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.jobFooter}>
        <Pressable
          style={styles.viewApplicantsBtn}
          onPress={() => onViewApplicantsPress(job.id)}
          accessibilityLabel={`View applicants for ${job.title}`}>
          <Text style={styles.viewApplicantsText}>View Applicants</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function OpenPositions() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    isLoading,
    summary,
    positions,
    emptyMessage,
    onBackPress,
    onPostJobPress,
    onViewApplicantsPress,
    onRefresh,
  } = useOpenPositionsController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }>
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
                  Open Positions
                </Text>
                <Text style={styles.pageSubtitle} numberOfLines={2}>
                  {summary}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.primaryBtn} onPress={onPostJobPress}>
                <Icon name="addPlus" size={11} color={colors.white} />
                <Text style={styles.primaryBtnText}>Post Job</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.list}>
            {isLoading && positions.length === 0 ? (
              <ActivityIndicator color={colors.actionBlue} />
            ) : positions.length === 0 ? (
              <Text style={styles.pageSubtitle}>{emptyMessage}</Text>
            ) : (
              positions.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewApplicantsPress={onViewApplicantsPress}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
