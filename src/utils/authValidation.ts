const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  terms?: string;
};

export function validateAuthEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) {
    return 'Please fill the gmail';
  }
  if (!EMAIL_REGEX.test(value)) {
    return 'Enter a valid gmail';
  }
  return undefined;
}

export function validateAuthPassword(
  password: string,
  options?: {minLength?: number},
): string | undefined {
  if (!password.trim()) {
    return 'Please enter password';
  }
  const minLength = options?.minLength;
  if (minLength && password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return undefined;
}

export function validateAuthFullName(fullName: string): string | undefined {
  if (!fullName.trim()) {
    return 'Please enter full name';
  }
  return undefined;
}

export function validateAuthPhone(phone: string): string | undefined {
  if (!phone.trim()) {
    return 'Please enter phone number';
  }
  return undefined;
}

export function validateLoginForm(email: string, password: string): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateAuthEmail(email);
  const passwordError = validateAuthPassword(password);
  if (emailError) {
    errors.email = emailError;
  }
  if (passwordError) {
    errors.password = passwordError;
  }
  return errors;
}

export function validateSignUpForm(
  email: string,
  fullName: string,
  password: string,
  options?: {
    phone?: string;
    requireTerms?: boolean;
    agreedToTerms?: boolean;
  },
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateAuthEmail(email);
  const fullNameError = validateAuthFullName(fullName);
  const passwordError = validateAuthPassword(password, {minLength: 8});
  if (emailError) {
    errors.email = emailError;
  }
  if (fullNameError) {
    errors.fullName = fullNameError;
  }
  if (passwordError) {
    errors.password = passwordError;
  }
  if (options?.phone !== undefined) {
    const phoneError = validateAuthPhone(options.phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
  }
  if (options?.requireTerms && !options.agreedToTerms) {
    errors.terms = 'Please agree to the Terms of Service';
  }
  return errors;
}
