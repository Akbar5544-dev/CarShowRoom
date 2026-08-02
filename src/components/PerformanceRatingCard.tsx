import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type PerformanceRatingCardProps = {
  rating: number;
  caption: string;
  progress?: number;
};

export const PerformanceRatingCard = memo(function PerformanceRatingCard({
  rating,
  caption,
  progress = 0.96,
}: PerformanceRatingCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Performance Rating</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        <View style={styles.stars}>
          {Array.from({length: 5}).map((_, index) => (
            <Icon key={index} name="star" size={12} />
          ))}
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${Math.min(100, progress * 100)}%`}]} />
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: c.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 24,
    fontWeight: '700',
    color: c.textDark,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: c.track,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: c.actionBlue,
  },
  caption: {
    fontSize: 11,
    color: c.textSoft,
    marginTop: 2,
  },
});
}
