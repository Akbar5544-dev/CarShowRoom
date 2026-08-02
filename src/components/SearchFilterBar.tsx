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

type SearchFilterBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
};

export const SearchFilterBar = memo(function SearchFilterBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search employees...',
}: SearchFilterBarProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.row}>
      <View style={styles.search}>
        <Icon name="search" size={12} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSoft}
          style={styles.input}
        />
      </View>
      <Pressable style={styles.filter} onPress={onFilterPress}>
        <Icon name="filter" size={12} />
        <Text style={styles.filterText}>Filter</Text>
      </Pressable>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  search: {
    flex: 1,
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
});
}
