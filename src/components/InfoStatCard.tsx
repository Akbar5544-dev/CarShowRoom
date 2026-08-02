import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type InfoStatCardData = {
  id: string;
  label: string;
  value: string;
  icon: IconName;
  iconBg: string;
};

type InfoStatCardProps = {
  item: InfoStatCardData;
};

export const InfoStatCard = memo(function InfoStatCard({item}: InfoStatCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, {backgroundColor: item.iconBg}]}>
        <Icon name={item.icon} size={15} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  card: {
    width: '47.5%',
    flexGrow: 1,
    minHeight: 110,
    borderRadius: 20,
    backgroundColor: c.surface,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: c.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: c.textDark,
  },
});
}
