import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {ManageRoleItem} from './module';
import {createStyles} from './styles';
import {useManageRolesController} from './useController';

function ManageRoleCard({
  role,
  onMorePress,
  onManagePress,
}: {
  role: ManageRoleItem;
  onMorePress: (roleId: string) => void;
  onManagePress: (roleId: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.roleCard}>
      <View style={styles.roleTop}>
        <View style={[styles.roleIcon, {backgroundColor: role.iconBg}]}>
          <Icon name={role.icon} size={18} color={colors.white} />
        </View>
        <Pressable
          style={styles.roleMenuBtn}
          onPress={() => onMorePress(role.id)}
          hitSlop={8}
          accessibilityLabel={`${role.title} options`}>
          <Icon
            name="moreDotsVertical"
            size={14}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      <View style={styles.roleBody}>
        <Text style={styles.roleTitle}>{role.title}</Text>
        <Text style={styles.roleDescription}>{role.description}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.roleFooter}>
        <Text style={styles.userCount}>{role.userCount} users</Text>
        <Pressable onPress={() => onManagePress(role.id)} hitSlop={8}>
          <Text style={styles.manageText}>Manage</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ManageRoles() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    summary,
    roles,
    onBackPress,
    onCreateRolePress,
    onRoleMorePress,
    onManageRolePress,
  } = useManageRolesController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle} numberOfLines={1}>
                  Roles & Permissions
                </Text>
                <Text style={styles.pageSubtitle} numberOfLines={1}>
                  {summary}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.createBtn}
                onPress={onCreateRolePress}
                accessibilityLabel="Create role">
                <Icon name="addPlus" size={12} color={colors.white} />
                <Text style={styles.createBtnText}>Create Role</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.list}>
            {roles.length === 0 ? (
              <Text style={styles.emptyText}>No roles yet. Tap Create Role to add one.</Text>
            ) : (
              roles.map(role => (
                <ManageRoleCard
                  key={role.id}
                  role={role}
                  onMorePress={onRoleMorePress}
                  onManagePress={onManageRolePress}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
