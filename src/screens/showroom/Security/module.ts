export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type SessionId = 'mac' | 'iphone' | 'windows';

export type ActiveSession = {
  id: SessionId;
  device: string;
  meta: string;
  current?: boolean;
};

export type SecurityController = {
  userName: string;
  dateLabel: string;
  passwordForm: PasswordForm;
  authenticatorEnabled: boolean;
  smsBackupEnabled: boolean;
  sessions: ActiveSession[];
  isLoggingOut: boolean;
  setPasswordField: (key: keyof PasswordForm, value: string) => void;
  onToggleAuthenticator: (value: boolean) => void;
  onToggleSmsBackup: (value: boolean) => void;
  onUpdatePassword: () => void;
  onRevokeSession: (id: SessionId) => void;
  onBackPress: () => void;
  onLogoutPress: () => void;
};
