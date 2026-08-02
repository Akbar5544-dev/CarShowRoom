import type {MetricCardData} from '../../../components';
import type {IconName} from '../../../assets/iconXml';

export type RoleAvatar = {
  id: string;
  initials: string;
  color: string;
};

export type RoleCardData = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconBg: string;
  userCount: number;
  avatars: RoleAvatar[];
  extraCount?: number;
};

export type RolesPermissionsController = {
  summary: string;
  metrics: MetricCardData[];
  roles: RoleCardData[];
  onBackPress: () => void;
  onActivityLogsPress: () => void;
  onManagePress: () => void;
  onRoleMorePress: (roleId: string) => void;
};
