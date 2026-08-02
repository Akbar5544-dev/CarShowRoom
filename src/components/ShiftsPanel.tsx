import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon, IconName} from './Icon';
import {ProfileActionHeader} from './ProfileActionHeader';
import {type AppColors, useThemedStyles, useThemeColors, colors} from '../theme';

export type ShiftKind = 'morning' | 'evening' | 'night';

export type ShiftItem = {
  id: string;
  title: string;
  time: string;
  kind: ShiftKind;
};

type ShiftsPanelProps = {
  items: ShiftItem[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void;
  onAssignPress?: () => void;
  onRemovePress?: (item: ShiftItem) => void;
};

const KIND_STYLE: Record<
  ShiftKind,
  {bg: string; icon: IconName}
> = {
  morning: {bg: colors.actionSoftFill, icon: 'shiftMorning'},
  evening: {bg: '#FFE2B1', icon: 'shiftSun'},
  night: {bg: 'rgba(149,91,227,0.17)', icon: 'shiftNight'},
};

export const ShiftsPanel = memo(function ShiftsPanel({
  items,
  searchValue,
  onSearchChange,
  onFilterPress,
  onAssignPress,
  onRemovePress,
}: ShiftsPanelProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <ProfileActionHeader
        eyebrow="Weekly Schedule"
        title="Shifts"
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        actionLabel="Assign Shift"
        onActionPress={onAssignPress}
        onFilterPress={onFilterPress}
      />
      <View style={styles.list}>
        {items.map(item => {
          const kind = KIND_STYLE[item.kind];
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.left}>
                <View style={[styles.iconWrap, {backgroundColor: kind.bg}]}>
                  <Icon name={kind.icon} size={16} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>{item.time}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => onRemovePress?.(item)}
                hitSlop={8}
                accessibilityLabel={`Remove ${item.title}`}>
                <Icon name="closeCross" size={20} />
              </Pressable>
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
    paddingHorizontal: 10,
    paddingVertical: 16,
    gap: 11,
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
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
});
}
