import type {IconName} from '../../../assets/iconXml';

export type RoleOverviewMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
};

export type RoleOverviewStat = {
  id: string;
  label: string;
  value: string;
  footer: string;
  icon: IconName;
};

export type RoleOverviewMatrixColumn = {
  id: string;
  label: string;
};

export type RoleOverviewMatrixRow = {
  id: string;
  label: string;
  grants: Record<string, boolean>;
};

export type RoleOverviewData = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconBg: string;
  status: 'Active' | 'Inactive';
  userCount: number;
  permissionsAllowed: number;
  modulesCount: number;
  activityEvents: string;
  stats: RoleOverviewStat[];
  matrixColumns: RoleOverviewMatrixColumn[];
  matrixRows: RoleOverviewMatrixRow[];
  members: RoleOverviewMember[];
};

export type RoleOverviewController = {
  role: RoleOverviewData | null;
  onBackPress: () => void;
  onDuplicatePress: () => void;
  onDeletePress: () => void;
  onEditPress: () => void;
  onAssignUserPress: () => void;
  onRemoveMemberPress: (memberId: string) => void;
};
