import {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {rolesPermissionsService} from '../../../services';
import {useThemeColors} from '../../../theme';
import {
  asRecord,
  pickNumber,
  pickString,
  unwrapList,
} from '../../../utils/apiHelpers';
import type {ManageRoleItem, ManageRolesController} from './module';

type ManageRolesNav = NativeStackNavigationProp<
  HomeStackParamList,
  'ManageRoles'
>;

function mapRole(
  row: Record<string, unknown>,
  index: number,
  palette: {icon: ManageRoleItem['icon']; bg: string}[],
): ManageRoleItem {
  const item = palette[index % palette.length];
  const record = asRecord(row);
  return {
    id: String(row.id ?? index),
    title: pickString(record, ['name', 'title', 'role_name'], `Role ${index + 1}`),
    description: pickString(
      record,
      ['description'],
      'Custom access across modules',
    ),
    icon: item.icon,
    iconBg: item.bg,
    userCount: pickNumber(record, ['users_count', 'user_count', 'members_count'], 0),
  };
}

export function useManageRolesController(): ManageRolesController {
  const colors = useThemeColors();
  const navigation = useNavigation<ManageRolesNav>();
  const [roles, setRoles] = useState<ManageRoleItem[]>([]);
  const [summary, setSummary] = useState('0 roles · granular module-level control');

  const iconPalette = [
    {icon: 'roleCrown' as const, bg: colors.actionBlue},
    {icon: 'employees' as const, bg: colors.statusRented},
    {icon: 'roleSliders' as const, bg: '#14B8A6'},
    {icon: 'addUser' as const, bg: '#8B5CF6'},
    {icon: 'roleEye' as const, bg: '#F59E0B'},
    {icon: 'activityWrench' as const, bg: '#64748B'},
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await rolesPermissionsService.listRoles({per_page: 100});
      const rows = unwrapList(response);
      const mapped = rows.map((row, index) =>
        mapRole(asRecord(row), index, iconPalette),
      );
      const totalUsers = mapped.reduce((sum, role) => sum + role.userCount, 0);
      setRoles(mapped);
      setSummary(
        `${mapped.length} roles · ${totalUsers} users · granular module-level control`,
      );
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load roles'),
        type: 'danger',
      });
      setSummary('Unable to load roles right now');
    }
  }, [colors.actionBlue, colors.statusRented]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCreateRolePress = useCallback(() => {
    navigation.navigate('CreateRole');
  }, [navigation]);

  const onManageRolePress = useCallback(
    (roleId: string) => {
      navigation.navigate('RoleOverview', {roleId});
    },
    [navigation],
  );

  return {
    summary,
    roles,
    onBackPress,
    onCreateRolePress,
    onManageRolePress,
  };
}
