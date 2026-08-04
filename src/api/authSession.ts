import {asRecord} from '../utils/apiHelpers';
import type {AuthUser} from './types';

/** Pull bearer token from showroom or public login/register payloads. */
export function extractAuthToken(payload: unknown): string | null {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const candidates = [
    data.token,
    data.access_token,
    root.token,
    root.access_token,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

/** Pull user object from auth payloads. */
export function extractAuthUser(payload: unknown): AuthUser {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const user = asRecord(data.user ?? root.user ?? data);
  return user as AuthUser;
}

export function extractAuthRoles(payload: unknown): string[] | null {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const roles = data.roles ?? root.roles;
  if (!Array.isArray(roles)) {
    return null;
  }
  return roles.filter((item): item is string => typeof item === 'string');
}
