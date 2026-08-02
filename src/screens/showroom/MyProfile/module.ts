export type MyProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  timeZone: string;
};

export type MyProfileController = {
  userName: string;
  dateLabel: string;
  displayName: string;
  displayRole: string;
  avatarUri: string | null;
  form: MyProfileForm;
  setField: (key: keyof MyProfileForm, value: string) => void;
  onBackPress: () => void;
  onUploadPress: () => void;
  onRemovePress: () => void;
  onCameraPress: () => void;
  onCancelPress: () => void;
  onSavePress: () => void;
};
