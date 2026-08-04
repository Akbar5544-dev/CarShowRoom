import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../../components';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';
import type {
  ActivityItem,
  FeaturePill,
  OverviewTone,
  SpecItem,
  StatCard,
} from './module';

const TONE_STYLES: Record<OverviewTone, {bg: string; color: string}> = {
  green: {bg: 'rgba(32,180,107,0.14)', color: '#20B46B'},
  blue: {bg: 'rgba(59,130,246,0.14)', color: '#3B82F6'},
  amber: {bg: 'rgba(245,158,11,0.16)', color: '#D97706'},
  purple: {bg: 'rgba(139,92,246,0.14)', color: '#7C3AED'},
};

type VehicleOverviewPanelProps = {
  specs: SpecItem[];
  featurePills: FeaturePill[];
  activities: ActivityItem[];
  quickStats: StatCard[];
  purchaseSummary: SpecItem[];
  onActivityPress?: (item: ActivityItem) => void;
};

export const VehicleOverviewPanel = memo(function VehicleOverviewPanel({
  specs,
  featurePills,
  activities,
  quickStats,
  purchaseSummary,
  onActivityPress,
}: VehicleOverviewPanelProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.specCard}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specGrid}>
          {specs.map(spec => (
            <View key={spec.label} style={styles.specCell}>
              <Text style={styles.specLabel}>{spec.label.toUpperCase()}</Text>
              <Text style={styles.specValue} numberOfLines={2}>
                {spec.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.featureGrid}>
          {featurePills.map(pill => (
            <View key={pill.label} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Icon name={pill.icon} size={15} color={colors.actionBlue} />
              </View>
              <Text style={styles.featureLabel} numberOfLines={2}>
                {pill.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Activity Timeline</Text>
      <View style={styles.activityList}>
        {activities.map(item => {
          const tone = TONE_STYLES[item.tone];
          const clickable = Boolean(item.actionTab && onActivityPress);
          return (
            <Pressable
              key={item.id}
              style={({pressed}) => [
                styles.activityCard,
                clickable && pressed && styles.activityCardPressed,
              ]}
              disabled={!clickable}
              onPress={() => onActivityPress?.(item)}>
              <View style={[styles.activityIconWrap, {backgroundColor: tone.bg}]}>
                <Icon name={item.icon} size={13} color={tone.color} />
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              {clickable ? (
                <Icon name="profileArrow" size={12} color={colors.textSoft} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.statsGrid}>
        {quickStats.map(stat => {
          const tone = TONE_STYLES[stat.tone];
          return (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, {backgroundColor: tone.bg}]}>
                <Icon name={stat.icon} size={14} color={tone.color} />
              </View>
              <View style={styles.statCopy}>
                <Text style={styles.statLabel} numberOfLines={1}>
                  {stat.label.toUpperCase()}
                </Text>
                <Text style={styles.statValue} numberOfLines={1}>
                  {stat.value}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.purchaseCard}>
        <Text style={styles.purchaseEyebrow}>Purchase Summary</Text>
        {purchaseSummary.map(row => (
          <View key={row.label} style={styles.purchaseRow}>
            <Text style={styles.purchaseLabel}>{row.label}</Text>
            <Text
              style={
                row.label === 'Depreciation'
                  ? styles.purchaseValueDanger
                  : styles.purchaseValue
              }>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    wrap: {gap: 14},
    specCard: {
      borderRadius: 22,
      backgroundColor: c.surface,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 14,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: -0.3,
    },
    specGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    specCell: {
      width: '31.5%',
      flexGrow: 1,
      borderRadius: 14,
      backgroundColor: 'rgba(237,242,248,0.9)',
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 4,
      minHeight: 54,
    },
    specLabel: {
      fontSize: 8,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.4,
    },
    specValue: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textDark,
      lineHeight: 15,
    },
    featureGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    featureCard: {
      width: '23%',
      flexGrow: 1,
      minWidth: '22%',
      maxWidth: '24%',
      minHeight: 78,
      borderRadius: 16,
      backgroundColor: 'rgba(237,242,248,0.9)',
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      paddingVertical: 10,
      gap: 8,
    },
    featureIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.actionTint06,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureLabel: {
      fontSize: 9,
      fontWeight: '600',
      color: c.textDark,
      textAlign: 'center',
      lineHeight: 12,
    },
    activityList: {gap: 8},
    activityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderRadius: 18,
      backgroundColor: c.surface,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    activityCardPressed: {
      opacity: 0.88,
      borderColor: c.actionTint15,
    },
    activityIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityCopy: {flex: 1, gap: 3},
    activityTitle: {
      fontSize: 11.5,
      fontWeight: '600',
      color: c.textDark,
      lineHeight: 16,
    },
    activityTime: {
      fontSize: 10,
      color: c.textSoft,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    statCard: {
      width: '31.5%',
      flexGrow: 1,
      minWidth: '30%',
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderRadius: 18,
      backgroundColor: c.surface,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statCopy: {gap: 3},
    statLabel: {
      fontSize: 8,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.35,
    },
    statValue: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: -0.3,
    },
    purchaseCard: {
      borderRadius: 20,
      backgroundColor: c.surface,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 8,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    purchaseEyebrow: {
      fontSize: 9,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    purchaseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 5,
    },
    purchaseLabel: {
      fontSize: 11,
      color: c.textSoft,
    },
    purchaseValue: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textDark,
    },
    purchaseValueDanger: {
      fontSize: 11,
      fontWeight: '700',
      color: c.error,
    },
  });
}
