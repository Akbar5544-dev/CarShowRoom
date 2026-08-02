import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {IconName} from '../../../assets/iconXml';
import type {HomeStackParamList} from '../../../navigation/types';
import {rolesPermissionsService} from '../../../services';
import {colors as defaultColors, useThemeColors} from '../../../theme';
import {
  asRecord,
  avatarColorFromId,
  initialsFromName,
  pickNumber,
  pickString,
  unwrapData,
} from '../../../utils/apiHelpers';
import type {
  RoleOverviewController,
  RoleOverviewData,
  RoleOverviewMatrixRow,
  RoleOverviewMember,
} from './module';

type RoleOverviewNav = NativeStackNavigationProp<
  HomeStackParamList,
  'RoleOverview'
>;
type RoleOverviewRoute = RouteProp<HomeStackParamList, 'RoleOverview'>;

const MATRIX_COLUMNS = [
  {id: 'superAdmin', label: 'Super Admin'},
  {id: 'fleetManager', label: 'Fleet Manager'},
  {id: 'accountant', label: 'Accountant'},
  {id: 'rentalAgent', label: 'Rental Agent'},
  {id: 'support', label: 'Support'},
];

const MATRIX_ROWS: RoleOverviewMatrixRow[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    grants: {
      superAdmin: true,
      fleetManager: true,
      accountant: true,
      rentalAgent: true,
      support: true,
    },
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    grants: {
      superAdmin: true,
      fleetManager: true,
      accountant: false,
      rentalAgent: true,
      support: false,
    },
  },
  {
    id: 'rentals',
    label: 'Rentals',
    grants: {
      superAdmin: true,
      fleetManager: true,
      accountant: false,
      rentalAgent: true,
      support: true,
    },
  },
  {
    id: 'customers',
    label: 'Customers',
    grants: {
      superAdmin: true,
      fleetManager: true,
      accountant: false,
      rentalAgent: true,
      support: true,
    },
  },
  {
    id: 'accounting',
    label: 'Accounting',
    grants: {
      superAdmin: true,
      fleetManager: false,
      accountant: true,
      rentalAgent: false,
      support: false,
    },
  },
  {
    id: 'staff',
    label: 'Staff',
    grants: {
      superAdmin: true,
      fleetManager: true,
      accountant: false,
      rentalAgent: false,
      support: false,
    },
  },
  {
    id: 'reports',
    label: 'Reports',
    grants: {
      superAdmin: true,
      fleetManager: true,
      accountant: true,
      rentalAgent: false,
      support: false,
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    grants: {
      superAdmin: true,
      fleetManager: false,
      accountant: false,
      rentalAgent: false,
      support: false,
    },
  },
];

const ALL_MEMBERS: RoleOverviewMember[] = [
  {
    id: 'm1',
    name: 'Ali Raza',
    email: 'ali@drivehub.io',
    initials: 'AR',
    avatarColor: defaultColors.brandBlue,
  },
  {
    id: 'm2',
    name: 'Sana Yousuf',
    email: 'sana@drivehub.io',
    initials: 'SY',
    avatarColor: '#8B5CF6',
  },
  {
    id: 'm3',
    name: 'Zara Malik',
    email: 'zara@drivehub.io',
    initials: 'ZM',
    avatarColor: '#20B46B',
  },
  {
    id: 'm4',
    name: 'Hamza Sheikh',
    email: 'hamza@drivehub.io',
    initials: 'HS',
    avatarColor: '#F59E0B',
  },
  {
    id: 'm5',
    name: 'Rehan Ali',
    email: 'rehan@drivehub.io',
    initials: 'RA',
    avatarColor: '#EF4444',
  },
  {
    id: 'm6',
    name: 'Nadia Iqbal',
    email: 'nadia@drivehub.io',
    initials: 'NI',
    avatarColor: '#14B8A6',
  },
  {
    id: 'm7',
    name: 'Usman Khan',
    email: 'usman@drivehub.io',
    initials: 'UK',
    avatarColor: defaultColors.secondary,
  },
  {
    id: 'm8',
    name: 'Fatima Noor',
    email: 'fatima@drivehub.io',
    initials: 'FN',
    avatarColor: '#9B6EFA',
  },
];

type RoleSeed = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconBg: string;
  userCount: number;
  permissionsAllowed: number;
  modulesCount: number;
  activityEvents: string;
  memberIds: string[];
};

const ROLE_SEEDS: Record<string, RoleSeed> = {
  'super-admin': {
    id: 'super-admin',
    title: 'Super Admin',
    description: 'Full system access, all modules',
    icon: 'roleCrown',
    iconBg: defaultColors.actionBlue,
    userCount: 2,
    permissionsAllowed: 30,
    modulesCount: 9,
    activityEvents: '284 events (30d)',
    memberIds: ['m1', 'm2'],
  },
  'fleet-manager': {
    id: 'fleet-manager',
    title: 'Fleet Manager',
    description: 'Vehicles, rentals & staff oversight',
    icon: 'employees',
    iconBg: defaultColors.statusRented,
    userCount: 5,
    permissionsAllowed: 22,
    modulesCount: 7,
    activityEvents: '156 events (30d)',
    memberIds: ['m1', 'm3', 'm4', 'm5', 'm7'],
  },
  accountant: {
    id: 'accountant',
    title: 'Accountant',
    description: 'Finance & payroll access',
    icon: 'roleSliders',
    iconBg: '#14B8A6',
    userCount: 3,
    permissionsAllowed: 12,
    modulesCount: 4,
    activityEvents: '98 events (30d)',
    memberIds: ['m2', 'm6', 'm8'],
  },
  'rental-agent': {
    id: 'rental-agent',
    title: 'Rental Agent',
    description: 'Bookings, customers & returns',
    icon: 'addUser',
    iconBg: '#8B5CF6',
    userCount: 14,
    permissionsAllowed: 16,
    modulesCount: 5,
    activityEvents: '412 events (30d)',
    memberIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'],
  },
  support: {
    id: 'support',
    title: 'Support',
    description: 'Read-only support access',
    icon: 'roleEye',
    iconBg: '#F59E0B',
    userCount: 6,
    permissionsAllowed: 10,
    modulesCount: 4,
    activityEvents: '67 events (30d)',
    memberIds: ['m3', 'm4', 'm5', 'm6', 'm7', 'm8'],
  },
  mechanic: {
    id: 'mechanic',
    title: 'Mechanic',
    description: 'Service records & maintenance',
    icon: 'activityWrench',
    iconBg: '#64748B',
    userCount: 8,
    permissionsAllowed: 8,
    modulesCount: 3,
    activityEvents: '203 events (30d)',
    memberIds: ['m4', 'm5', 'm6', 'm7', 'm8', 'm1', 'm2', 'm3'],
  },
};

function buildRole(seed: RoleSeed): RoleOverviewData {
  const members = seed.memberIds
    .map(id => ALL_MEMBERS.find(member => member.id === id))
    .filter(Boolean) as RoleOverviewMember[];

  return {
    ...seed,
    status: 'Active',
    stats: [
      {
        id: 'permissions',
        label: 'Permissions',
        value: `${seed.permissionsAllowed} allowed`,
        footer: `Across ${seed.modulesCount} modules`,
        icon: 'activityKey',
      },
      {
        id: 'members',
        label: 'Members',
        value: `${seed.userCount} users`,
        footer: 'Assigned to this role',
        icon: 'employees',
      },
      {
        id: 'activity',
        label: 'Activity',
        value: seed.activityEvents,
        footer: 'Audit trail enabled',
        icon: 'activityPulse',
      },
    ],
    matrixColumns: MATRIX_COLUMNS,
    matrixRows: MATRIX_ROWS,
    members,
  };
}

function buildRoleFromApi(row: Record<string, any>): RoleOverviewData {
  const id = String(row.id ?? '');
  const title = pickString(row, ['name', 'title'], 'Role');
  const description = pickString(
    row,
    ['description'],
    'Custom access across modules',
  );
  const userCount = pickNumber(row, ['users_count', 'user_count'], 0);
  const permissions = Array.isArray(row.permissions) ? row.permissions : [];
  const permissionsAllowed = permissions.length || pickNumber(row, ['permissions_count'], 0);
  const usersRaw = Array.isArray(row.users) ? row.users : [];
  const members: RoleOverviewMember[] = usersRaw.map((user: unknown, index: number) => {
    const userRow = asRecord(user);
    const name = pickString(userRow, ['name', 'full_name'], `User ${index + 1}`);
    const memberId = String(userRow.id ?? `${id}-${index}`);
    return {
      id: memberId,
      name,
      email: pickString(userRow, ['email'], ''),
      initials: initialsFromName(name),
      avatarColor: avatarColorFromId(memberId),
    };
  });

  return {
    id,
    title,
    description,
    icon: 'roleCrown',
    iconBg: defaultColors.actionBlue,
    status: row.is_active === false || row.active === false ? 'Inactive' : 'Active',
    userCount: userCount || members.length,
    permissionsAllowed,
    modulesCount: pickNumber(row, ['modules_count'], MATRIX_ROWS.length),
    activityEvents: pickString(row, ['activity_summary'], 'No recent activity'),
    stats: [
      {
        id: 'permissions',
        label: 'Permissions',
        value: `${permissionsAllowed} allowed`,
        footer: `Across ${pickNumber(row, ['modules_count'], MATRIX_ROWS.length)} modules`,
        icon: 'activityKey',
      },
      {
        id: 'members',
        label: 'Members',
        value: `${userCount || members.length} users`,
        footer: 'Assigned to this role',
        icon: 'employees',
      },
      {
        id: 'activity',
        label: 'Activity',
        value: pickString(row, ['activity_summary'], 'No recent activity'),
        footer: 'Audit trail enabled',
        icon: 'activityPulse',
      },
    ],
    matrixColumns: MATRIX_COLUMNS,
    matrixRows: MATRIX_ROWS,
    members,
  };
}

export function useRoleOverviewController(): RoleOverviewController {
  const colors = useThemeColors();
  const navigation = useNavigation<RoleOverviewNav>();
  const route = useRoute<RoleOverviewRoute>();
  const roleId = route.params.roleId;

  const fallbackRole = useMemo(() => {
    const seed = ROLE_SEEDS[roleId] ?? ROLE_SEEDS['super-admin'];
    return buildRole(seed);
  }, [roleId]);

  const [role, setRole] = useState<RoleOverviewData | null>(fallbackRole);

  useEffect(() => {
    let cancelled = false;
    setRole(fallbackRole);

    async function load() {
      try {
        const response = await rolesPermissionsService.getRolesById(roleId);
        const data = asRecord(unwrapData(response));
        const roleRow = asRecord(data.role ?? data);
        if (!cancelled && Object.keys(roleRow).length) {
          setRole(buildRoleFromApi(roleRow));
        }
      } catch {
        // Keep the local fallback role if the API call fails
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fallbackRole, roleId]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onDuplicatePress = useCallback(async () => {
    if (!role) {
      return;
    }
    try {
      await rolesPermissionsService.createRoles({
        name: `${role.title} Copy`,
        description: role.description,
      });
      showMessage({message: 'Role duplicated', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to duplicate role'),
        type: 'danger',
      });
    }
  }, [navigation, role]);

  const onDeletePress = useCallback(async () => {
    try {
      await rolesPermissionsService.deleteRolesById(roleId);
      showMessage({message: 'Role deleted', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to delete role'),
        type: 'danger',
      });
    }
  }, [navigation, roleId]);

  const onEditPress = useCallback(() => {
    navigation.navigate('EditRole', {roleId});
  }, [navigation, roleId]);
  const onAssignUserPress = useCallback(() => {
    showMessage({
      message: 'Assign users from the Create Role flow',
      type: 'info',
    });
  }, []);
  const onRemoveMemberPress = useCallback((_memberId: string) => {}, []);

  return {
    role,
    onBackPress,
    onDuplicatePress,
    onDeletePress,
    onEditPress,
    onAssignUserPress,
    onRemoveMemberPress,
  };
}
