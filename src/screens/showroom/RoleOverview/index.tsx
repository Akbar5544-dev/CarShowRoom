import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useRoleOverviewController} from './useController';

function GrantIcon({allowed}: {allowed: boolean}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={allowed ? styles.grantYes : styles.grantNo}>
      <Text style={allowed ? styles.grantYesText : styles.grantNoText}>
        {allowed ? '✓' : '✕'}
      </Text>
    </View>
  );
}

export function RoleOverview() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    role,
    onBackPress,
    onDeletePress,
    onEditPress,
    onAssignUserPress,
    onRemoveMemberPress,
  } = useRoleOverviewController();

  if (!role) {
    return (
      <Screen style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Role not found</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <View style={styles.heroCopy}>
                <Text style={styles.heroTitle} numberOfLines={1}>
                  {role.title}
                </Text>
                <Text style={styles.heroSubtitle}>{role.description}</Text>
                <View style={styles.badgesRow}>
                  <View style={styles.usersBadge}>
                    <Text style={styles.usersBadgeText}>
                      {role.userCount} users assigned
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      role.status === 'Active' && styles.statusBadgeActive,
                    ]}>
                    <Text
                      style={[
                        styles.statusBadgeText,
                        role.status === 'Active' && styles.statusBadgeTextActive,
                      ]}>
                      {role.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.outlineBtn} onPress={onDeletePress}>
                <Icon name="iconTrash" size={12} />
                <Text style={[styles.outlineBtnText, styles.deleteBtnText]}>
                  Delete
                </Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onEditPress}>
                <Icon name="iconEdit" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>Edit role</Text>
              </Pressable>
            </View>
          </View>

          {role.stats.map(stat => (
            <View key={stat.id} style={styles.card}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <View style={styles.statFooter}>
                <Icon name={stat.icon} size={14} color={colors.actionBlue} />
                <Text style={styles.statFooterText}>{stat.footer}</Text>
              </View>
            </View>
          ))}

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>What this role can do</Text>
              <Text style={styles.sectionTitle}>Permission matrix</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.matrixScroll}>
              <View style={styles.matrix}>
                <View style={styles.matrixHeaderRow}>
                  <View style={styles.matrixModuleCol}>
                    <Text style={styles.matrixModuleHeader}>Module</Text>
                  </View>
                  {role.matrixColumns.map(column => (
                    <View key={column.id} style={styles.matrixRoleCol}>
                      <Text style={styles.matrixRoleHeader} numberOfLines={2}>
                        {column.label}
                      </Text>
                    </View>
                  ))}
                </View>
                {role.matrixRows.map(row => (
                  <View key={row.id} style={styles.matrixRow}>
                    <View style={styles.matrixModuleCol}>
                      <Text style={styles.matrixModuleLabel}>{row.label}</Text>
                    </View>
                    {role.matrixColumns.map(column => (
                      <View key={column.id} style={styles.matrixRoleCol}>
                        <GrantIcon allowed={!!row.grants[column.id]} />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.card}>
            <View style={styles.membersHeader}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>
                  {role.userCount} users
                </Text>
                <Text style={styles.sectionTitle}>Members</Text>
              </View>
              <Pressable onPress={onAssignUserPress} hitSlop={8}>
                <Text style={styles.assignLink}>Assign user</Text>
              </Pressable>
            </View>

            <View style={styles.memberList}>
              {role.members.map((member, index) => (
                <View
                  key={member.id}
                  style={[
                    styles.memberRow,
                    index === role.members.length - 1 && styles.memberRowLast,
                  ]}>
                  <View
                    style={[
                      styles.memberAvatar,
                      {backgroundColor: member.avatarColor},
                    ]}>
                    <Text style={styles.memberAvatarText}>
                      {member.initials}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>
                  <Pressable
                    onPress={() => onRemoveMemberPress(member.id)}
                    hitSlop={8}>
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
