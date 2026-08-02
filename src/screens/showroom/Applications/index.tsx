import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {ApplicationCardData, ApplicationStage} from './module';
import {createStyles} from './styles';
import {useApplicationsController} from './useController';

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function stageColors(stage: ApplicationStage) {
  switch (stage) {
    case 'Shortlisted':
      return {
        backgroundColor: 'rgba(245,158,11,0.15)',
        textColor: colors.late,
      };
    case 'New':
      return {
        backgroundColor: colors.actionTint12,
        textColor: colors.actionBlue,
      };
    case 'Interview':
      return {
        backgroundColor: colors.staffMetricPurple,
        textColor: colors.deptSales,
      };
    case 'Rejected':
      return {
        backgroundColor: colors.badgeOverdueBg,
        textColor: colors.error,
      };
  }
}

function ApplicationCard({
  application,
  onReviewPress,
}: {
  application: ApplicationCardData;
  onReviewPress: (id: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const stageStyle = stageColors(application.stage);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View
          style={[
            styles.avatar,
            {backgroundColor: application.avatarColor},
          ]}>
          <Text style={styles.avatarText}>
            {getInitials(application.name)}
          </Text>
        </View>

        <View style={styles.cardMain}>
          <Text style={styles.name}>{application.name}</Text>
          <Text style={styles.role}>
            {application.role} · {application.experience}
          </Text>
        </View>

        <View style={styles.matchBlock}>
          <Text style={styles.matchLabel}>MATCH</Text>
          <View style={styles.matchValueRow}>
            <Icon name="star" size={11} color={colors.actionBlue} />
            <Text style={styles.matchValue}>{application.matchPercent}%</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: stageStyle.backgroundColor},
            ]}>
            <Text style={[styles.statusBadgeText, {color: stageStyle.textColor}]}>
              {application.stage}
            </Text>
          </View>
          <Pressable
            style={styles.reviewBtn}
            onPress={() => onReviewPress(application.id)}>
            <Text style={styles.reviewBtnText}>Review</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function Applications() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    subtitle,
    searchQuery,
    applications,
    setSearchQuery,
    onStageFilterPress,
    onPositionFilterPress,
    onBackPress,
    onOnboardingPress,
    onReviewPress,
  } = useApplicationsController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
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
                <Text style={styles.pageTitle}>Applications</Text>
                <Text style={styles.pageSubtitle}>{subtitle}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.onboardingBtn}
                onPress={onOnboardingPress}>
                <Icon name="graduationCap" size={12} color={colors.white} />
                <Text style={styles.onboardingBtnText}>Onboarding</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.filtersRow}>
              <View style={styles.searchWrap}>
                <Icon name="search" size={14} color={colors.textSoft} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search candidates..."
                  placeholderTextColor={colors.textSoft}
                  style={styles.searchInput}
                />
              </View>
              <View style={styles.filterStack}>
                <Pressable
                  style={styles.filterChip}
                  onPress={onStageFilterPress}>
                  <Icon name="filter" size={10} color={colors.textDark} />
                  <Text style={styles.filterChipText}>Stage</Text>
                </Pressable>
                <Pressable
                  style={styles.filterChip}
                  onPress={onPositionFilterPress}>
                  <Icon name="filter" size={10} color={colors.textDark} />
                  <Text style={styles.filterChipText}>Position</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.list}>
              {applications.length === 0 ? (
                <Text style={styles.emptyText}>
                  No candidates found. Backend has no applications list API
                  yet (only public job apply).
                </Text>
              ) : (
                applications.map(application => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onReviewPress={onReviewPress}
                  />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
