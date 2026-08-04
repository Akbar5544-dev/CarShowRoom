import type {ImageSourcePropType} from 'react-native';

export const FEED_PRIMARY = '#2563eb';
export const FEED_MUTED = '#6b7280';
export const FEED_BORDER = '#e5e7eb';
export const FEED_BG = '#f9fafb';

export type BackgroundThumb = {
  id: string;
  source: ImageSourcePropType | null;
  tint: string;
};

export type EditProfileController = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  city: string;
  address: string;
  profileSource: ImageSourcePropType | null;
  backgroundSource: ImageSourcePropType | null;
  backgroundTint: string;
  backgroundThumbs: BackgroundThumb[];
  selectedBgId: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhone: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setCity: (value: string) => void;
  setAddress: (value: string) => void;
  onBack: () => void;
  onSave: () => void;
  onChangeProfilePhoto: () => void;
  onChangeBackground: () => void;
  onSelectBackground: (id: string) => void;
  onUseCurrentLocation: () => void;
};
