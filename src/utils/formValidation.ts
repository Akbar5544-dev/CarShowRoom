export type FieldErrors = Record<string, string>;

export function isBlank(value: unknown): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (typeof value === 'number') {
    return Number.isNaN(value);
  }
  return false;
}

export function requiredError(label: string): string {
  return `${label} is required`;
}

/** Build error map from required field checks. First failure per key wins. */
export function buildFieldErrors(
  checks: Array<{
    key: string;
    value: unknown;
    label: string;
    validate?: (value: unknown) => string | undefined;
  }>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const check of checks) {
    if (errors[check.key]) {
      continue;
    }
    if (isBlank(check.value)) {
      errors[check.key] = requiredError(check.label);
      continue;
    }
    const custom = check.validate?.(check.value);
    if (custom) {
      errors[check.key] = custom;
    }
  }
  return errors;
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function clearFieldError(
  errors: FieldErrors,
  key: string,
): FieldErrors {
  if (!errors[key]) {
    return errors;
  }
  const next = {...errors};
  delete next[key];
  return next;
}
