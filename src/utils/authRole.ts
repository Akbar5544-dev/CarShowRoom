import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AuthUser} from '../api';
import {STORAGE_KEYS} from '../constants';

export type AuthRole = 'admin' | 'customer';

const CUSTOMER_HINTS = ['customer', 'buyer', 'renter', 'public'];
const ADMIN_HINTS = ['admin', 'showroom', 'owner', 'dealer', 'staff'];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isAuthRole(value: unknown): value is AuthRole {
  return value === 'admin' || value === 'customer';
}

/**
 * Role explicitly reported by the API. Returns null when the payload carries no
 * role information, so the caller can fall back to the locally chosen role.
 */
export function resolveApiRole(
  user: AuthUser | null | undefined,
  roles?: string[] | null,
): AuthRole | null {
  const candidates: string[] = [];
  if (Array.isArray(roles)) {
    candidates.push(...roles.filter(item => typeof item === 'string'));
  }
  if (user) {
    const rawRole = user.role ?? user.user_role ?? user.user_type ?? user.type;
    if (typeof rawRole === 'string') {
      candidates.push(rawRole);
    }
    if (Array.isArray(user.roles)) {
      candidates.push(
        ...user.roles.filter((item): item is string => typeof item === 'string'),
      );
    }
  }

  const haystack = candidates.join(' ').toLowerCase().trim();
  if (!haystack) {
    return null;
  }
  if (CUSTOMER_HINTS.some(hint => haystack.includes(hint))) {
    return 'customer';
  }
  if (ADMIN_HINTS.some(hint => haystack.includes(hint))) {
    return 'admin';
  }
  return null;
}

export function isCustomerRole(
  user: AuthUser | null | undefined,
  roles?: string[] | null,
): boolean {
  return resolveApiRole(user, roles) === 'customer';
}

export function withAuthRole(user: AuthUser, role: AuthRole): AuthUser {
  return {
    ...user,
    role,
  };
}

/** Role of the session that is currently signed in. */
export async function setActiveAuthRole(role: AuthRole): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_ROLE, role);
  } catch {
    // ignore persistence errors
  }
}

export async function getActiveAuthRole(): Promise<AuthRole | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_ROLE);
    return isAuthRole(stored) ? stored : null;
  } catch {
    return null;
  }
}

export async function rememberAuthRole(
  email: string,
  role: AuthRole,
): Promise<void> {
  const key = normalizeEmail(email);
  if (!key) {
    return;
  }
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_ROLE_MAP);
    const map = raw ? (JSON.parse(raw) as Record<string, AuthRole>) : {};
    map[key] = role;
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUTH_ROLE_MAP,
      JSON.stringify(map),
    );
  } catch {
    // ignore persistence errors
  }
}

export async function recallAuthRole(email: string): Promise<AuthRole | null> {
  const key = normalizeEmail(email);
  if (!key) {
    return null;
  }
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_ROLE_MAP);
    if (!raw) {
      return null;
    }
    const map = JSON.parse(raw) as Record<string, AuthRole>;
    const stored = map[key];
    return isAuthRole(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Login role. The role chosen at sign up on this device wins over anything the
 * API reports, so a customer account never lands on the showroom app.
 */
export async function resolveLoginRole(
  email: string,
  user: AuthUser | null | undefined,
  roles?: string[] | null,
): Promise<AuthRole> {
  return (
    (await recallAuthRole(email)) ?? resolveApiRole(user, roles) ?? 'admin'
  );
}

/** Role for an already signed-in session being restored on app start. */
export async function resolveRestoredRole(
  email: string,
  user: AuthUser | null | undefined,
  cachedUser?: AuthUser | null,
  roles?: string[] | null,
): Promise<AuthRole> {
  const active = await getActiveAuthRole();
  if (active) {
    return active;
  }
  const cachedRole = cachedUser?.role;
  if (isAuthRole(cachedRole)) {
    return cachedRole;
  }
  return (
    (await recallAuthRole(email)) ?? resolveApiRole(user, roles) ?? 'admin'
  );
}