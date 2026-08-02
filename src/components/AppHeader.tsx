import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type AppHeaderProps = {
  dateLabel: string;
  userName: string;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
};

export const AppHeader = memo(function AppHeader({
  dateLabel,
  userName,
  onSearchPress,
  onNotificationPress,
  onSettingsPress,
}: AppHeaderProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoBadge}>
          <Icon name="logoCar" size={20} />
        </View>
        <View>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.welcome}>
            Welcome, <Text style={styles.welcomeName}>{userName}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          style={styles.iconButton}
          accessibilityLabel="Search"
          onPress={onSearchPress}>
          <Icon name="search" size={18} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          accessibilityLabel="Notifications"
          onPress={onNotificationPress}>
          <Icon name="bell" size={18} />
          <View style={styles.notificationDot} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          accessibilityLabel="Settings"
          onPress={onSettingsPress}>
          <Icon name="settings" size={18} />
        </Pressable>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.brandBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: c.textSecondary,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },
  welcome: {
    fontSize: 16,
    fontWeight: '700',
    color: c.text,
    marginTop: 2,
  },
  welcomeName: {
    color: c.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.notification,
  },
});
}
