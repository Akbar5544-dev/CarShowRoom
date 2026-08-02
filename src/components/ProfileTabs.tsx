import React, {memo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type ProfileTabId =
  | 'overview'
  | 'attendance'
  | 'salary'
  | 'bonuses'
  | 'shifts'
  | 'documents';

type ProfileTabsProps = {
  tabs: {id: ProfileTabId; label: string}[];
  activeTab: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
};

export const ProfileTabs = memo(function ProfileTabs({
  tabs,
  activeTab,
  onChange,
}: ProfileTabsProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {tabs.map(tab => {
          const active = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onChange(tab.id)}
              style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    borderRadius: 16,
    backgroundColor: c.track,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 4,
  },
  content: {
    gap: 4,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: c.surface,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: c.textSoft,
  },
  labelActive: {
    color: c.textDark,
    fontWeight: '600',
  },
});
}
