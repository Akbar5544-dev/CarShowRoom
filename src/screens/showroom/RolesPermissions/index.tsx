import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, MetricCard, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {RoleCardData} from './module';
import {createStyles} from './styles';
import {useRolesPermissionsController} from './useController';

function RoleCard({
  role,
  onPress,
}: {
  role: RoleCardData;
  onPress: (roleId: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      style={styles.roleCard}
      onPress={() => onPress(role.id)}
      accessibilityLabel={`Open ${role.title}`}>
      <View style={styles.roleTop}>
        <View style={[styles.roleIcon, {backgroundColor: role.iconBg}]}>
          <Icon name={role.icon} size={18} color={colors.white} />
        </View>
      </View>

      <View style={styles.roleBody}>
        <Text style={styles.roleTitle}>{role.title}</Text>
        <Text style={styles.roleDescription}>{role.description}</Text>
      </View>

      <View style={styles.roleFooter}>
        <View style={styles.avatarStack}>
          {role.avatars.map((avatar, index) => (
            <View
              key={avatar.id}
              style={[
                styles.avatar,
                {
                  backgroundColor: avatar.color,
                  marginLeft: index === 0 ? 0 : -8,
                  zIndex: role.avatars.length - index,
                },
              ]}>
              <Text style={styles.avatarText}>{avatar.initials}</Text>
            </View>
          ))}
          {role.extraCount ? (
            <View
              style={[
                styles.extraBadge,
                {marginLeft: -8, zIndex: 0},
              ]}>
              <Text style={styles.extraText}>+{role.extraCount}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.userCount}>{role.userCount} users</Text>
      </View>
    </Pressable>
  );
}

export function RolesPermissions() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    summary,
    metrics,
    roles,
    onBackPress,
    onActivityLogsPress,
    onManagePress,
    onRolePress,
  } = useRolesPermissionsController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                <Pressable
                  style={styles.backBtn}
                  onPress={onBackPress}
                  accessibilityLabel="Go back"
                  hitSlop={8}>
                  <Icon name="arrowLeft" size={14} color={colors.white} />
                </Pressable>
                <View style={styles.titleBlock}>
                  <Text style={styles.pageTitle}>Roles & Permissions</Text>
                  <Text style={styles.pageSubtitle}>{summary}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.secondaryBtn} onPress={onActivityLogsPress}>
                <Icon name="activityPulse" size={14} color={colors.textDark} />
                <Text style={styles.secondaryBtnText} numberOfLines={1}>
                  Activity Logs
                </Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onManagePress}>
                <Text style={styles.primaryBtnText} numberOfLines={1}>
                  Manage Roles
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map(metric => (
              <MetricCard key={metric.id} item={metric} />
            ))}
          </View>

          <View style={styles.rolesGrid}>
            {roles.length === 0 ? (
              <Text style={styles.emptyText}>No roles yet. Create one to get started.</Text>
            ) : (
              roles.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onPress={onRolePress}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
