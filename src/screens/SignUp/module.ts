import type {AuthRole} from '../../utils/authRole';
import type {PickedMedia} from '../../utils/mediaPicker';

export type SignUpFieldErrors = {
  email?: string;
  fullName?: string;
  showroomName?: string;
  phone?: string;
  password?: string;
  terms?: string;
};

export type SignUpRoleOption = {
  id: AuthRole;
  title: string;
  description: string;
};

export const COUNTRY_OPTIONS = ['Pakistan', 'UAE', 'Saudi Arabia', 'UK', 'USA'] as const;

export const CITY_OPTIONS: Record<string, string[]> = {
  Pakistan: [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Abbottabad',
    'Sialkot',
  ],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam'],
  UK: ['London', 'Manchester', 'Birmingham'],
  USA: ['New York', 'Los Angeles', 'Houston'],
};

export type SignUpController = {
  role: AuthRole;
  roleOptions: SignUpRoleOption[];
  fullName: string;
  showroomName: string;
  logo: PickedMedia | null;
  country: string | null;
  city: string | null;
  address: string;
  email: string;
  phone: string;
  password: string;
  passwordVisible: boolean;
  agreedToTerms: boolean;
  cityOptions: string[];
  errors: SignUpFieldErrors;
  loading: boolean;
  setRole: (role: AuthRole) => void;
  setFullName: (value: string) => void;
  setShowroomName: (value: string) => void;
  onPickLogo: () => void;
  onClearLogo: () => void;
  setCountry: (value: string | null) => void;
  setCity: (value: string | null) => void;
  setAddress: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  onTogglePassword: () => void;
  onToggleTerms: () => void;
  onCreateAccount: () => void;
  onLoginPress: () => void;
  onGooglePress: () => void;
  onApplePress: () => void;
};
