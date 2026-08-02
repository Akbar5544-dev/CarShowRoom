import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {PipelineColumn} from './module';
import {createStyles} from './styles';
import {useHiringPipelineController} from './useController';

function PipelineStageCard({column}: {column: PipelineColumn}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.columnCard, {borderColor: column.borderColor}]}>
      <View style={styles.columnHeader}>
        <Text style={styles.columnTitle}>{column.label}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{column.count}</Text>
        </View>
      </View>

      <View style={styles.candidatesList}>
        {column.candidates.map(candidate => (
          <View key={candidate.id} style={styles.candidateRow}>
            <Text style={styles.candidateName}>{candidate.name}</Text>
            <Text style={styles.candidateMeta}>{candidate.movedLabel}</Text>
          </View>
        ))}
      </View>

      {column.extraCount > 0 ? (
        <Text style={styles.moreText}>+{column.extraCount} more</Text>
      ) : null}
    </View>
  );
}

export function HiringPipeline() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {summary, columns, onBackPress} =
    useHiringPipelineController();

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
                <Text style={styles.pageTitle}>Hiring Pipeline</Text>
                <Text style={styles.pageSubtitle}>{summary}</Text>
              </View>
            </View>
          </View>

          <View style={styles.columnsList}>
            {columns.map(column => (
              <PipelineStageCard key={column.id} column={column} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
