import {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {rolesPermissionsService} from '../../../services';
import {asRecord, pickNumber, pickString, unwrapData} from '../../../utils/apiHelpers';
import type {
  EditRoleController,
  EditRoleMatrixColumn,
  EditRoleMatrixRow,
} from './module';

type EditRoleNav = NativeStackNavigationProp<HomeStackParamList, 'EditRole'>;
type EditRoleRoute = RouteProp<HomeStackParamList, 'EditRole'>;

const MATRIX_COLUMNS: EditRoleMatrixColumn[] = [
  {id: 'superAdmin', label: 'Super Admin'},
  {id: 'fleetManager', label: 'Fleet Manager'},
  {id: 'accountant', label: 'Accountant'},
  {id: 'rentalAgent', label: 'Rental Agent'},
  {id: 'support', label: 'Support'},
];

const INITIAL_ROWS: EditRoleMatrixRow[] = [
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

const ROLE_DEFAULTS: Record<
  string,
  {name: string; description: string; permissionsGranted: number}
> = {
  'super-admin': {
    name: 'Super Admin',
    description: "Manage this role's access and permissions across modules.",
    permissionsGranted: 30,
  },
  'fleet-manager': {
    name: 'Fleet Manager',
    description: 'Vehicles, rentals & staff oversight across modules.',
    permissionsGranted: 22,
  },
  accountant: {
    name: 'Accountant',
    description: 'Finance and payroll access across accounting modules.',
    permissionsGranted: 12,
  },
  'rental-agent': {
    name: 'Rental Agent',
    description: 'Bookings, customers and returns access.',
    permissionsGranted: 16,
  },
  support: {
    name: 'Support',
    description: 'Read-only support access across selected modules.',
    permissionsGranted: 10,
  },
  mechanic: {
    name: 'Mechanic',
    description: 'Service records and maintenance permissions.',
    permissionsGranted: 8,
  },
};

const ROLE_COLUMN: Record<string, string> = {
  'super-admin': 'superAdmin',
  'fleet-manager': 'fleetManager',
  accountant: 'accountant',
  'rental-agent': 'rentalAgent',
  support: 'support',
  mechanic: 'support',
};

const PERMISSIONS_TOTAL = 45;

export function useEditRoleController(): EditRoleController {
  const navigation = useNavigation<EditRoleNav>();
  const route = useRoute<EditRoleRoute>();
  const roleId = route.params.roleId;
  const defaults = ROLE_DEFAULTS[roleId] ?? ROLE_DEFAULTS['super-admin'];
  const roleColumn = ROLE_COLUMN[roleId] ?? 'superAdmin';

  const [name, setName] = useState(defaults.name);
  const [description, setDescription] = useState(defaults.description);
  const [active, setActive] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(
    defaults.permissionsGranted,
  );
  const [matrixRows, setMatrixRows] = useState<EditRoleMatrixRow[]>(
    INITIAL_ROWS.map(row => ({
      ...row,
      grants: {...row.grants},
    })),
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await rolesPermissionsService.getRolesById(roleId);
        const data = asRecord(unwrapData(response));
        const roleRow = asRecord(data.role ?? data);
        if (cancelled || !Object.keys(roleRow).length) {
          return;
        }
        setName(pickString(roleRow, ['name', 'title'], defaults.name));
        setDescription(
          pickString(roleRow, ['description'], defaults.description),
        );
        setActive(roleRow.is_active !== false && roleRow.active !== false);
        const permissions: string[] = Array.isArray(roleRow.permissions)
          ? roleRow.permissions.map((permission: unknown) =>
              typeof permission === 'string'
                ? permission
                : pickString(asRecord(permission), ['name', 'slug', 'id'], ''),
            )
          : [];
        if (permissions.length) {
          setPermissionsGranted(permissions.length);
          setMatrixRows(prev =>
            prev.map(row => ({
              ...row,
              grants: {
                ...row.grants,
                [roleColumn]: permissions.includes(row.id) || row.grants[roleColumn],
              },
            })),
          );
        } else {
          setPermissionsGranted(
            pickNumber(roleRow, ['permissions_count'], defaults.permissionsGranted),
          );
        }
      } catch {
        // Keep local defaults if the role can't be loaded
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [defaults, roleColumn, roleId]);

  const toggleGrant = useCallback(
    (moduleId: string, columnId: string) => {
      setMatrixRows(prev => {
        const row = prev.find(item => item.id === moduleId);
        if (!row) {
          return prev;
        }
        const nextValue = !row.grants[columnId];
        if (columnId === roleColumn) {
          setPermissionsGranted(count =>
            Math.max(
              0,
              Math.min(PERMISSIONS_TOTAL, count + (nextValue ? 1 : -1)),
            ),
          );
        }
        return prev.map(item =>
          item.id === moduleId
            ? {
                ...item,
                grants: {
                  ...item.grants,
                  [columnId]: nextValue,
                },
              }
            : item,
        );
      });
    },
    [roleColumn],
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSavePress = useCallback(async () => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      const permissions = matrixRows
        .filter(row => row.grants[roleColumn])
        .map(row => row.id);
      await rolesPermissionsService.updateRolesById(roleId, {
        name,
        description,
        active,
        permissions,
      });
      showMessage({message: 'Role updated', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to update role'),
        type: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  }, [active, description, isSaving, matrixRows, name, navigation, roleColumn, roleId]);

  return {
    name,
    description,
    active,
    matrixColumns: MATRIX_COLUMNS,
    matrixRows,
    modulesCount: 9,
    permissionsGranted,
    permissionsTotal: PERMISSIONS_TOTAL,
    summaryStatus: active ? 'Active' : 'Inactive',
    setName,
    setDescription,
    setActive,
    toggleGrant,
    onBackPress,
    onCancelPress,
    onSavePress,
  };
}
