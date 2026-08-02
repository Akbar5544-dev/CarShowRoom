export type ScheduleToggleId =
  | 'daily'
  | 'cloudSync'
  | 'includeFiles'
  | 'emailOnFailure';

export type ScheduleItem = {
  id: ScheduleToggleId;
  title: string;
  subtitle: string;
  enabled: boolean;
};

export type BackupHistoryStatus = 'Success' | 'Failed';

export type BackupHistoryRow = {
  id: string;
  size: string;
  type: string;
  status: BackupHistoryStatus;
};

export type BackupRestoreController = {
  userName: string;
  dateLabel: string;
  storageUsed: string;
  storageTotal: string;
  storagePercent: number;
  lastBackupTitle: string;
  lastBackupMeta: string;
  retentionTitle: string;
  retentionMeta: string;
  scheduleItems: ScheduleItem[];
  history: BackupHistoryRow[];
  onToggleSchedule: (id: ScheduleToggleId, value: boolean) => void;
  onRestorePress: () => void;
  onDownloadPress: () => void;
  onRunBackupPress: () => void;
  onBackPress: () => void;
};
