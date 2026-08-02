import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, MetricCard, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {CandidateItem, CandidateStage, PipelineStage} from './module';
import {createStyles} from './styles';
import {useJobsHiringController} from './useController';

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function stageBadgeColors(stage: CandidateStage) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  switch (stage) {
    case 'Interview':
      return {
        backgroundColor: 'rgba(245,158,11,0.15)',
        textColor: colors.late,
      };
    case 'Offer':
      return {
        backgroundColor: colors.badgeActiveBg,
        textColor: colors.successBright,
      };
    case 'Screening':
      return {
        backgroundColor: colors.actionTint12,
        textColor: colors.actionBlue,
      };
  }
}

function PipelineStageItem({stage}: {stage: PipelineStage}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View
      style={[
        styles.stageItem,
        stage.wide && styles.stageItemWide,
        {backgroundColor: stage.background},
      ]}>
      <Text style={styles.stageLabel}>{stage.label}</Text>
      <Text style={styles.stageCount}>{stage.count}</Text>
      <View style={styles.stageStatus}>
        <Icon name="trendUpWhite" size={9} />
        <Text style={styles.stageStatusText}>Active</Text>
      </View>
    </View>
  );
}

function CandidateRow({
  candidate,
  onPress,
}: {
  candidate: CandidateItem;
  onPress: (id: string) => void;
}) {
  const styles = useThemedStyles(createStyles);

  const badge = stageBadgeColors(candidate.stage);

  return (
    <Pressable
      style={styles.candidateCard}
      onPress={() => onPress(candidate.id)}
      accessibilityLabel={`Review ${candidate.name}`}>
      <View
        style={[
          styles.candidateAvatar,
          {backgroundColor: candidate.avatarColor},
        ]}>
        <Text style={styles.candidateAvatarText}>
          {getInitials(candidate.name)}
        </Text>
      </View>
      <View style={styles.candidateBody}>
        <Text style={styles.candidateName}>{candidate.name}</Text>
        <Text style={styles.candidateRole}>{candidate.role}</Text>
        <View
          style={[
            styles.stageBadge,
            {backgroundColor: badge.backgroundColor},
          ]}>
          <Text style={[styles.stageBadgeText, {color: badge.textColor}]}>
            {candidate.stage}
          </Text>
        </View>
      </View>
      <View style={styles.scoreBlock}>
        <Text style={styles.scoreText}>{candidate.score}</Text>
        <Text style={styles.scoreLabel}>SCORE</Text>
      </View>
    </Pressable>
  );
}

export function JobsHiring() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    summary,
    metrics,
    pipelineStages,
    candidates,
    onBackPress,
    onInterviewsPress,
    onOpenPositionsPress,
    onPipelinePress,
    onCandidatePress,
  } = useJobsHiringController();

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
                <Text style={styles.pageTitle}>Jobs & Hiring</Text>
                <Text style={styles.pageSubtitle}>{summary}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.secondaryBtn} onPress={onInterviewsPress}>
                <Icon name="videoCamera" size={12} color={colors.textDark} />
                <Text style={styles.secondaryBtnText}>Interviews</Text>
              </Pressable>
              <Pressable
                style={styles.primaryBtn}
                onPress={onOpenPositionsPress}>
                <Icon name="addPlus" size={11} color={colors.white} />
                <Text style={styles.primaryBtnText}>Opening Positions</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map(metric => (
              <MetricCard key={metric.id} item={metric} />
            ))}
          </View>

          <Pressable
            style={styles.pipelineCard}
            onPress={onPipelinePress}
            accessibilityLabel="View hiring pipeline">
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineEyebrow}>Hiring Pipeline</Text>
              <Text style={styles.pipelineTitle}>Candidate flow</Text>
            </View>
            <View style={styles.pipelineGrid}>
              {pipelineStages.map(stage => (
                <PipelineStageItem key={stage.id} stage={stage} />
              ))}
            </View>
          </Pressable>

          <View style={styles.shortlistCard}>
            <View style={styles.shortlistHeader}>
              <View style={styles.shortlistHeaderText}>
                <Text style={styles.sectionEyebrow}>Shortlisted</Text>
                <Text style={styles.sectionTitle}>Top candidates</Text>
              </View>
              <View style={styles.gradIcon}>
                <Icon name="graduationCap" size={14} color={colors.textDark} />
              </View>
            </View>

            <View style={styles.candidateList}>
              {candidates.length === 0 ? (
                <Text style={styles.pageSubtitle}>
                  No candidates yet — applications/interview APIs are not in
                  the backend. Open Positions use live /public/jobs.
                </Text>
              ) : (
                candidates.map(candidate => (
                  <CandidateRow
                    key={candidate.id}
                    candidate={candidate}
                    onPress={onCandidatePress}
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
