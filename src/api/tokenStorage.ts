import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants';

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
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
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_ROLE);
}
