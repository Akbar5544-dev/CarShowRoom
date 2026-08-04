import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants';
import type {AuthRole} from '../utils/authRole';

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export async function getShowroomToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.SHOWROOM_TOKEN);
}

export async function getCustomerToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
}

/**
 * Resolve which bearer token to send for a request.
 * `/public/*` routes use the customer token; everything else uses showroom token.
 * Falls back to the active session token.
 */
export async function getAuthTokenForRequest(
  url?: string,
): Promise<string | null> {
  const path = String(url ?? '');
  const isPublic = path.includes('/public/');
  if (isPublic) {
    return (
      (await getCustomerToken()) ||
      (await getAuthToken())
    );
  }
  return (
    (await getShowroomToken()) ||
    (await getAuthToken())
  );
}

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/** Persist token into the role-specific slot + active session token. */
export async function setAuthTokenForRole(
  token: string,
  role: AuthRole,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  if (role === 'customer') {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMER_TOKEN, token);
  } else {
    await AsyncStorage.setItem(STORAGE_KEYS.SHOWROOM_TOKEN, token);
  }
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

export async function setAuthUser(user: unknown): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export async function getAuthUser<T = unknown>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.SHOWROOM_TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.USER),
    AsyncStorage.removeItem(STORAGE_KEYS.AUTH_ROLE),
  ]);
}
