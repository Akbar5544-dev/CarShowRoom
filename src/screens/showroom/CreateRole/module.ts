import type {IconName} from '../../../assets/iconXml';

export type CreateRoleStepId = 0 | 1 | 2 | 3;

export type RolePresetId = 'blank' | 'viewer' | 'manager' | 'administrator';

export type RolePreset = {
  id: RolePresetId;
  title: string;
  description: string;
  icon: IconName;
};

export type CreateRoleForm = {
  name: string;
  description: string;
  activeOnCreation: boolean;
  preset: RolePresetId;
};

export type PermissionRoleColumn =
  | 'superAdmin'
  | 'fleetManager'
  | 'accountant'
  | 'rentalAgent'
  | 'support';

export type PermissionModuleRow = {
  id: string;
  label: string;
  grants: Record<PermissionRoleColumn, boolean>;
};

export type AssignableUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
};

export type CreateRoleController = {
  currentStep: CreateRoleStepId;
  steps: {id: CreateRoleStepId; label: string}[];
  form: CreateRoleForm;
  presets: RolePreset[];
  permissionColumns: {id: PermissionRoleColumn; label: string}[];
  permissionRows: PermissionModuleRow[];
  assignableUsers: AssignableUser[];
  assignedUserIds: string[];
  summaryName: string;
  summaryPreset: string;
  summaryPermissions: string;
  summaryMembers: string;
  summaryStatus: string;
  reviewName: string;
  reviewDescription: string;
  reviewPermissions: string;
  reviewMembers: string;
  canGoPrevious: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setActiveOnCreation: (value: boolean) => void;
  setPreset: (preset: RolePresetId) => void;
  toggleGrant: (moduleId: string, columnId: PermissionRoleColumn) => void;
  toggleAssignUser: (userId: string) => void;
  onStepPress: (step: CreateRoleStepId) => void;
  onBackPress: () => void;
  onPreviousPress: () => void;
  onContinuePress: () => void;
};
