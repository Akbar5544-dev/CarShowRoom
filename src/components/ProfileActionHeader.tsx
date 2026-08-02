import React, {memo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type ProfileActionHeaderProps = {
  eyebrow: string;
  title: string;
  searchValue: string;
  onSearchChange: (text: string) => void;
  actionLabel: string;
  onActionPress?: () => void;
  onFilterPress?: () => void;
  searchPlaceholder?: string;
};

export const ProfileActionHeader = memo(function ProfileActionHeader({
  eyebrow,
  title,
  searchValue,
  onSearchChange,
  actionLabel,
  onActionPress,
  onFilterPress,
  searchPlaceholder = 'Search ...',
}: ProfileActionHeaderProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.search}>
          <Icon name="search" size={12} />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.textSoft}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.filter} onPress={onFilterPress}>
          <Icon name="filter" size={12} />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onActionPress}>
          <Icon name="addPlus" size={12} />
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: 7,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleBlock: {
    flexShrink: 1,
    gap: 3,
  },
  eyebrow: {
    fontSize: 10.5,
    color: c.textSoft,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: c.textDark,
  },
  search: {
    width: 150,
    height: 27,
    borderRadius: 18,
    backgroundColor: c.searchBg,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 10.5,
    color: c.textDark,
    padding: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },
  filter: {
    height: 24,
    borderRadius: 18,
    backgroundColor: '#F7FBFD',
    borderWidth: 0.75,
    borderColor: c.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  filterText: {
    fontSize: 9,
    fontWeight: '500',
    color: c.textDark,
  },
  actionBtn: {
    height: 27,
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: c.actionBlue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: c.white,
  },
});
}
