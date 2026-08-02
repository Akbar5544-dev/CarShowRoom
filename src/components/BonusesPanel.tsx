import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {ProfileActionHeader} from './ProfileActionHeader';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type BonusItem = {
  id: string;
  title: string;
  meta: string;
  amount: string;
  status: 'approved' | 'pending';
};

type BonusesPanelProps = {
  total: string;
  items: BonusItem[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void;
  onAddPress?: () => void;
  onApprovePress?: (item: BonusItem) => void;
};

export const BonusesPanel = memo(function BonusesPanel({
  total,
  items,
  searchValue,
  onSearchChange,
  onFilterPress,
  onAddPress,
  onApprovePress,
}: BonusesPanelProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <ProfileActionHeader
        eyebrow="Total Bonuses"
        title={total}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        actionLabel="Add Bonus"
        onActionPress={onAddPress}
        onFilterPress={onFilterPress}
      />
      <View style={styles.list}>
        {items.map(item => {
          const pending = item.status === 'pending';
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.left}>
                  <View style={styles.iconWrap}>
                    <Icon name="gift" size={15} />
                  </View>
                  <View style={styles.copy}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.meta}>{item.meta}</Text>
                  </View>
                </View>
                <View style={styles.right}>
                  <Text style={styles.amount}>{item.amount}</Text>
                  <Text
                    style={[
                      styles.status,
                      pending ? styles.statusPending : styles.statusApproved,
                    ]}>
                    {pending ? 'Pending' : 'Approved'}
                  </Text>
                </View>
              </View>
              {pending ? (
                <View style={styles.approveRow}>
                  <Pressable
                    style={styles.approveBtn}
                    onPress={() => onApprovePress?.(item)}>
                    <Text style={styles.approveText}>Approved</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: 12,
  },
  list: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 13,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 22,
    backgroundColor: 'rgba(144,0,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
  meta: {
    fontSize: 8,
    fontWeight: '600',
    color: c.textSoft,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: c.successBright,
  },
  status: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  statusApproved: {
    color: '#00723A',
  },
  statusPending: {
    color: '#F6922E',
  },
  approveRow: {
    alignItems: 'flex-end',
  },
  approveBtn: {
    height: 22,
    minWidth: 63,
    borderRadius: 18,
    backgroundColor: c.successBright,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  approveText: {
    fontSize: 8.5,
    fontWeight: '500',
    color: c.white,
  },
});
}
