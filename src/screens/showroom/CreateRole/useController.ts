import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {
  rolesPermissionsService,
  staffManagementStaffService,
} from '../../../services';
import {
  asRecord,
  avatarColorFromId,
  initialsFromName,
  pickString,
  unwrapList,
  type AnyRecord,
} from '../../../utils/apiHelpers';
import type {
  AssignableUser,
  CreateRoleController,
  CreateRoleForm,
  CreateRoleStepId,
  PermissionModuleRow,
  PermissionRoleColumn,
  RolePreset,
  RolePresetId,
} from './module';

type CreateRoleNav = NativeStackNavigationProp<HomeStackParamList, 'CreateRole'>;

const STEPS: {id: CreateRoleStepId; label: string}[] = [
  {id: 0, label: 'Details'},
  {id: 1, label: 'Permissions'},
  {id: 2, label: 'Assign users'},
  {id: 3, label: 'Review'},
];

const PRESETS: RolePreset[] = [
  {
    id: 'blank',
    title: 'Blank',
    description: 'Start with no permissions',
    icon: 'settingsSecurity',
  },
  {
    id: 'viewer',
    title: 'Viewer',
    description: 'Read-only across modules',
    icon: 'roleEye',
  },
  {
    id: 'manager',
    title: 'Manager',
    description: 'Manage day-to-day ops',
    icon: 'employees',
  },
  {
    id: 'administrator',
    title: 'Administrator',
    description: 'Full access, no billing',
    icon: 'roleCrown',
  },
];

const PRESET_LABELS: Record<RolePresetId, string> = {
  blank: 'Blank',
  viewer: 'Viewer',
  manager: 'Manager',
  administrator: 'Administrator',
};

const PERMISSION_COLUMNS: {id: PermissionRoleColumn; label: string}[] = [
  {id: 'superAdmin', label: 'Super Admin'},
  {id: 'fleetManager', label: 'Fleet Manager'},
  {id: 'accountant', label: 'Accountant'},
  {id: 'rentalAgent', label: 'Rental Agent'},
  {id: 'support', label: 'Support'},
];

const DEFAULT_ROWS: PermissionModuleRow[] = [
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

function mapStaffToAssignableUser(item: AnyRecord): AssignableUser {
  const row = asRecord(item);
  const id = pickString(row, ['id'], '0');
  const name =
    pickString(row, ['name']) ||
    [pickString(row, ['first_name']), pickString(row, ['last_name'])]
      .filter(Boolean)
      .join(' ') ||
    'Employee';
  return {
    id,
    name,
    email: pickString(row, ['email'], '—'),
    initials: initialsFromName(name),
    avatarColor: avatarColorFromId(id),
  };
}

const INITIAL_FORM: CreateRoleForm = {
  name: '',
  description: '',
  activeOnCreation: true,
  preset: 'blank',
};

const TOTAL_PERMISSIONS = 45;

/** Which matrix column represents the role being created for each preset */
const PRESET_COLUMN: Record<RolePresetId, PermissionRoleColumn> = {
  blank: 'superAdmin',
  viewer: 'support',
  manager: 'fleetManager',
  administrator: 'superAdmin',
};

function cloneRows(rows: PermissionModuleRow[]): PermissionModuleRow[] {
  return rows.map(row => ({
    ...row,
    grants: {...row.grants},
  }));
}

function blankRows(): PermissionModuleRow[] {
  return DEFAULT_ROWS.map(row => ({
    ...row,
    grants: {
      superAdmin: false,
      fleetManager: false,
      accountant: false,
      rentalAgent: false,
      support: false,
    },
  }));
}

function rowsForPreset(preset: RolePresetId): PermissionModuleRow[] {
  if (preset === 'blank') {
    return blankRows();
  }
  return cloneRows(DEFAULT_ROWS);
}

function countEnabledForColumn(
  rows: PermissionModuleRow[],
  column: PermissionRoleColumn,
): number {
  return rows.filter(row => row.grants[column]).length;
}

function parseCatalogActions(
  payload: unknown,
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  unwrapList<unknown>(payload).forEach(item => {
    if (typeof item === 'string') {
      const [moduleName, action = 'view'] = item.split('.');
      if (!moduleName) {
        return;
      }
      if (!map[moduleName]) {
        map[moduleName] = [];
      }
      if (!map[moduleName].includes(action)) {
        map[moduleName].push(action);
      }
      return;
    }
    const row = asRecord(item);
    const moduleName = pickString(row, ['module', 'name', 'group']);
    if (!moduleName) {
      return;
    }
    const actions = Array.isArray(row.actions)
      ? row.actions.filter(
          (action): action is string =>
            typeof action === 'string' && action.trim().length > 0,
        )
      : ['view'];
    map[moduleName] = actions.length ? actions : ['view'];
  });
  return map;
}

function actionsForModule(
  catalog: Record<string, string[]>,
  moduleId: string,
  preset: RolePresetId,
): string[] {
  const actions = catalog[moduleId] ?? ['view', 'create', 'edit', 'delete'];
  if (preset === 'viewer') {
    return actions.filter(action => action === 'view');
  }
  if (preset === 'manager') {
    return actions.filter(action =>
      ['view', 'create', 'edit'].includes(action),
    );
  }
  return actions;
}

function buildApiPermissions(
  rows: PermissionModuleRow[],
  column: PermissionRoleColumn,
  catalog: Record<string, string[]>,
  preset: RolePresetId,
): string[] {
  const permissions: string[] = [];
  rows.forEach(row => {
    if (!row.grants[column]) {
      return;
    }
    actionsForModule(catalog, row.id, preset).forEach(action => {
      permissions.push(`${row.id}.${action}`);
    });
  });
  return permissions;
}

export function useCreateRoleController(): CreateRoleController {
  const navigation = useNavigation<CreateRoleNav>();
  const [currentStep, setCurrentStep] = useState<CreateRoleStepId>(0);
  const [form, setForm] = useState<CreateRoleForm>(INITIAL_FORM);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionRows, setPermissionRows] = useState<PermissionModuleRow[]>(
    () => blankRows(),
  );
  const [permissionCatalog, setPermissionCatalog] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      try {
        const response = await rolesPermissionsService.listPermissions({
          per_page: 200,
        });
        if (!cancelled) {
          setPermissionCatalog(parseCatalogActions(response));
        }
      } catch {
        // Fallback module.action expansion still works without catalog
      }
    }
    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadStaff() {
      try {
        const response = await staffManagementStaffService.listStaff({
          per_page: 50,
        });
        if (!cancelled) {
          setAssignableUsers(unwrapList(response).map(mapStaffToAssignableUser));
        }
      } catch (error) {
        if (!cancelled) {
          showMessage({
            message: getApiErrorMessage(error, 'Failed to load employees'),
            type: 'danger',
          });
        }
      }
    }
    loadStaff();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeColumn = PRESET_COLUMN[form.preset];

  const setName = useCallback((value: string) => {
    setForm(prev => ({...prev, name: value}));
  }, []);

  const setDescription = useCallback((value: string) => {
    setForm(prev => ({...prev, description: value}));
  }, []);

  const setActiveOnCreation = useCallback((value: boolean) => {
    setForm(prev => ({...prev, activeOnCreation: value}));
  }, []);

  const setPreset = useCallback((preset: RolePresetId) => {
    setForm(prev => ({...prev, preset}));
    setPermissionRows(rowsForPreset(preset));
  }, []);

  const toggleGrant = useCallback(
    (moduleId: string, columnId: PermissionRoleColumn) => {
      setPermissionRows(prev =>
        prev.map(row =>
          row.id === moduleId
            ? {
                ...row,
                grants: {
                  ...row.grants,
                  [columnId]: !row.grants[columnId],
                },
              }
            : row,
        ),
      );
    },
    [],
  );

  const toggleAssignUser = useCallback((userId: string) => {
    setAssignedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId],
    );
  }, []);

  const onStepPress = useCallback((step: CreateRoleStepId) => {
    setCurrentStep(step);
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPreviousPress = useCallback(() => {
    setCurrentStep(prev => (prev > 0 ? ((prev - 1) as CreateRoleStepId) : prev));
  }, []);

  const selectedPermissions = useMemo(
    () =>
      buildApiPermissions(
        permissionRows,
        activeColumn,
        permissionCatalog,
        form.preset,
      ),
    [activeColumn, form.preset, permissionCatalog, permissionRows],
  );

  const permissionCount = countEnabledForColumn(permissionRows, activeColumn);

  const onContinuePress = useCallback(async () => {
    if (currentStep < 3) {
      if (currentStep === 1 && selectedPermissions.length === 0) {
        showMessage({
          message: 'Enable at least one permission (✓) for this role',
          type: 'warning',
        });
        return;
      }
      setCurrentStep(prev => (prev + 1) as CreateRoleStepId);
      return;
    }
    if (isSubmitting) {
      return;
    }
    if (!form.name.trim()) {
      showMessage({message: 'Role name is required', type: 'warning'});
      setCurrentStep(0);
      return;
    }
    if (selectedPermissions.length === 0) {
      showMessage({
        message: 'Permission field is required — turn on at least one ✓',
        type: 'warning',
      });
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await rolesPermissionsService.createRoles({
        name: form.name.trim(),
        permissions: selectedPermissions,
      });
      const created = asRecord(
        (response as {data?: unknown})?.data ?? response,
      );
      const roleId = created.id;
      if (roleId != null && assignedUserIds.length) {
        await Promise.all(
          assignedUserIds.map(userId =>
            rolesPermissionsService
              .assignShift({role_id: roleId, user_id: userId})
              .catch(() => undefined),
          ),
        );
      }
      showMessage({message: 'Role created', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to create role'),
        type: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    assignedUserIds,
    currentStep,
    form.name,
    isSubmitting,
    navigation,
    selectedPermissions,
  ]);

  const summary = useMemo(
    () => ({
      summaryName: form.name.trim() || '—',
      summaryPreset: PRESET_LABELS[form.preset],
      summaryPermissions: String(permissionCount),
      summaryMembers: String(assignedUserIds.length),
      summaryStatus: form.activeOnCreation ? 'Active' : 'Inactive',
      reviewName: form.name.trim() || 'Untitled role',
      reviewDescription: form.description.trim() || '—',
      reviewPermissions: `${permissionCount} / ${TOTAL_PERMISSIONS}`,
      reviewMembers: `${assignedUserIds.length} assigned`,
    }),
    [form, permissionCount, assignedUserIds.length],
  );

  return {
    currentStep,
    steps: STEPS,
    form,
    presets: PRESETS,
    permissionColumns: PERMISSION_COLUMNS,
    permissionRows,
    assignableUsers,
    assignedUserIds,
    ...summary,
    canGoPrevious: currentStep > 0,
    isLastStep: currentStep === 3,
    isSubmitting,
    setName,
    setDescription,
    setActiveOnCreation,
    setPreset,
    toggleGrant,
    toggleAssignUser,
    onStepPress,
    onBackPress,
    onPreviousPress,
    onContinuePress,
  };
}
