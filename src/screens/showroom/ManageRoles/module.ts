import type {IconName} from '../../../assets/iconXml';

export type ManageRoleItem = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconBg: string;
  userCount: number;
};

export type ManageRolesController = {
  summary: string;
  roles: ManageRoleItem[];
  onBackPress: () => void;
  onCreateRolePress: () => void;
  onRoleMorePress: (roleId: string) => void;
  onManageRolePress: (roleId: string) => void;
};
