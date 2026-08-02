import type {AuthRole} from '../../utils/authRole';

export type SignUpFieldErrors = {
  email?: string;
  fullName?: string;
  phone?: string;
  password?: string;
  terms?: string;
};

export type SignUpRoleOption = {
  id: AuthRole;
  title: string;
  description: string;
};

export type SignUpController = {
  role: AuthRole;
  roleOptions: SignUpRoleOption[];
  fullName: string;
  email: string;
  phone: string;
  password: string;
  passwordVisible: boolean;
  agreedToTerms: boolean;
  errors: SignUpFieldErrors;
  loading: boolean;
  setRole: (role: AuthRole) => void;
  setFullName: (value: string) => void;
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
