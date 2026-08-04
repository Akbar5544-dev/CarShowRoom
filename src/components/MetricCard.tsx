import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {Sparkline} from './Sparkline';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type MetricCardData = {
  id: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  backgroundColor: string;
  icon: IconName;
  iconBg: string;
  sparklineColor: string;
  sparklinePoints?: number[];
};

type MetricCardProps = {
  item: MetricCardData;
};

export const MetricCard = memo(function MetricCard({item}: MetricCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.card, {backgroundColor: item.backgroundColor}]}>
      <View style={styles.top}>
        <View style={[styles.iconWrap, {backgroundColor: item.iconBg}]}>
          <Icon name={item.icon} size={15} />
        </View>
        <View
          style={[
            styles.changeBadge,
            {
              backgroundColor: item.positive
                ? 'rgba(32,180,107,0.15)'
                : 'rgba(239,68,68,0.15)',
            },
          ]}>
          <Icon
            name={item.positive ? 'growthGreen' : 'growthRed'}
            size={9}
          />
          <Text
            style={[
              styles.changeText,
              {color: item.positive ? colors.successBright : colors.absent},
            ]}>
            {item.change}
          </Text>
        </View>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {item.label}
      </Text>
      <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
        {item.value}
      </Text>
      <View style={styles.sparkline}>
        <Sparkline
          color={item.sparklineColor}
          points={item.sparklinePoints}
          width={130}
          height={28}
        />
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  card: {
    width: '47.5%',
    flexGrow: 1,
    borderRadius: 24,
    padding: 16,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 33,
    height: 33,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
  },
  changeText: {
    fontSize: 8,
    fontWeight: '600',
  },
  label: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '500',
    color: c.textLabel,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: c.textDark,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  sparkline: {
    marginTop: 4,
    height: 33,
    justifyContent: 'center',
  },
});
}
