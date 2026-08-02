export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginController = {
  email: string;
  password: string;
  passwordVisible: boolean;
  rememberMe: boolean;
  errors: LoginFieldErrors;
  loading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onTogglePassword: () => void;
  onToggleRememberMe: () => void;
  onForgotPasswordPress: () => void;
  onLogin: () => void;
  onSignUpPress: () => void;
  onGooglePress: () => void;
  onApplePress: () => void;
};
