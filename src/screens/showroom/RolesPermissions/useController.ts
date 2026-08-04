import {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {MetricCardData} from '../../../components';
import type {HomeStackParamList} from '../../../navigation/types';
import {rolesPermissionsService} from '../../../services';
import {useThemeColors, type AppColors} from '../../../theme';
import {
  asRecord,
  avatarColorFromId,
  countPermissionEntries,
  extractAssignedUsers,
  initialsFromName,
  pickNumber,
  pickString,
  unwrapList,
} from '../../../utils/apiHelpers';
import type {RoleAvatar, RoleCardData, RolesPermissionsController} from './module';

type RolesNav = NativeStackNavigationProp<
  HomeStackParamList,
  'RolesPermissions'
>;

function iconPalette(c: AppColors): {icon: RoleCardData['icon']; bg: string}[] {
  return [
    {icon: 'roleCrown', bg: c.actionBlue},
    {icon: 'employees', bg: c.statusRented},
    {icon: 'addUser', bg: '#8B5CF6'},
    {icon: 'roleEye', bg: '#F59E0B'},
    {icon: 'roleSliders', bg: '#14B8A6'},
    {icon: 'activityWrench', bg: '#64748B'},
  ];
}

function buildRoleMetrics(c: AppColors): MetricCardData[] {
  return [
    {
      id: 'roles',
      label: 'Total Roles',
      value: '0',
      change: '0%',
      positive: true,
      backgroundColor: c.staffMetricBlue,
      icon: 'settingsSecurity',
      iconBg: c.actionTint12,
      sparklineColor: c.actionBlue,
      sparklinePoints: [10, 12, 11, 14, 13, 15, 14, 16],
    },
    {
      id: 'users',
      label: 'Active Users',
      value: '0',
      change: '5.4%',
      positive: true,
      backgroundColor: c.staffMetricGreen,
      icon: 'employees',
      iconBg: 'rgba(32,180,107,0.12)',
      sparklineColor: c.successBright,
      sparklinePoints: [8, 11, 10, 14, 13, 17, 16, 20],
    },
    {
      id: 'permissions',
      label: 'Permissions',
      value: '0',
      change: '2%',
      positive: true,
      backgroundColor: c.staffMetricPurple,
      icon: 'activityKey',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: c.deptSales,
      sparklinePoints: [12, 13, 12, 15, 14, 16, 15, 17],
    },
    {
      id: 'actions',
      label: 'Actions Today',
      value: '0',
      change: '12.1%',
      positive: true,
      backgroundColor: c.staffMetricOrange,
      icon: 'activityPulse',
      iconBg: 'rgba(245,158,11,0.14)',
      sparklineColor: c.late,
      sparklinePoints: [6, 10, 9, 14, 12, 18, 16, 22],
    },
  ];
}

function buildAvatars(row: Record<string, unknown>): RoleAvatar[] {
  const users = extractAssignedUsers(asRecord(row));
  return users.slice(0, 4).map((user: unknown, index: number) => {
    const userRow = asRecord(user);
    const name = pickString(userRow, ['name', 'full_name'], `User ${index + 1}`);
    const id = String(userRow.id ?? `${row.id ?? 'role'}-${index}`);
    return {
      id,
      initials: initialsFromName(name),
      color: avatarColorFromId(id),
    };
  });
}

function mapRole(
  row: Record<string, unknown>,
  index: number,
  colors: AppColors,
): RoleCardData {
  const palette = iconPalette(colors);
  const item = palette[index % palette.length];
  const avatars = buildAvatars(row);
  const userCount = pickNumber(
    asRecord(row),
    ['users_count', 'user_count', 'members_count'],
    avatars.length,
  );
  const extraCount = Math.max(userCount - avatars.length, 0);
  return {
    id: String(row.id ?? index),
    title: pickString(asRecord(row), ['name', 'title', 'role_name'], `Role ${index + 1}`),
    description: pickString(
      asRecord(row),
      ['description'],
      'Custom access across modules',
    ),
    icon: item.icon,
    iconBg: item.bg,
    userCount,
    avatars,
    extraCount: extraCount > 0 ? extraCount : undefined,
  };
}

export function useRolesPermissionsController(): RolesPermissionsController {
  const colors = useThemeColors();
  const navigation = useNavigation<RolesNav>();
  const [roles, setRoles] = useState<RoleCardData[]>([]);
  const [metrics, setMetrics] = useState<MetricCardData[]>(() =>
    buildRoleMetrics(colors),
  );
  const [summary, setSummary] = useState(
    '0 roles · granular module-level control',
  );

  const fetchData = useCallback(async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        rolesPermissionsService.listRoles({per_page: 100}),
        rolesPermissionsService.listPermissions({per_page: 200}).catch(() => null),
      ]);

      const roleRows = unwrapList(rolesRes);
      const mappedRoles = roleRows.map((row, index) =>
        mapRole(asRecord(row), index, colors),
      );
      const permissionCount = permissionsRes
        ? countPermissionEntries(permissionsRes)
        : roleRows.reduce((sum, row) => {
            const perms = asRecord(row).permissions;
            return sum + (Array.isArray(perms) ? perms.length : 0);
          }, 0);
      const totalUsers = mappedRoles.reduce(
        (sum, role) => sum + role.userCount,
        0,
      );

      setRoles(mappedRoles);
      setMetrics(
        buildRoleMetrics(colors).map(metric => {
          if (metric.id === 'roles') {
            return {...metric, value: String(mappedRoles.length)};
          }
          if (metric.id === 'users') {
            return {...metric, value: String(totalUsers)};
          }
          if (metric.id === 'permissions') {
            return {...metric, value: String(permissionCount)};
          }
          return metric;
        }),
      );
      setSummary(
        `${mappedRoles.length} roles · ${totalUsers} users · granular module-level control`,
      );
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load roles'),
        type: 'danger',
      });
      setSummary('Unable to load roles right now');
    }
  }, [colors]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onActivityLogsPress = useCallback(() => {
    navigation.navigate('ActivityLog');
  }, [navigation]);

  const onManagePress = useCallback(() => {
    navigation.navigate('ManageRoles');
  }, [navigation]);

  const onRolePress = useCallback(
    (roleId: string) => {
      navigation.navigate('RoleOverview', {roleId});
    },
    [navigation],
  );

  return {
    summary,
    metrics,
    roles,
    onBackPress,
    onActivityLogsPress,
    onManagePress,
    onRolePress,
  };
}
