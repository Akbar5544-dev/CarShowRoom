import type {IconName} from '../../../assets/iconXml';

export type SettingsItemId =
  | 'profile'
  | 'company'
  | 'languages'
  | 'notifications'
  | 'security'
  | 'theme'
  | 'backup'
  | 'logout';

export type SettingsItem = {
  id: SettingsItemId;
  title: string;
  subtitle: string;
  icon: IconName;
};

export type SettingsController = {
  userName: string;
  dateLabel: string;
  items: SettingsItem[];
  activeId: SettingsItemId;
  onBackPress: () => void;
  onItemPress: (id: SettingsItemId) => void;
};
