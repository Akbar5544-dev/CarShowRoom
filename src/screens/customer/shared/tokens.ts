export const C = {
  primary: '#2563eb',
  muted: '#6b7280',
  border: '#e5e7eb',
  bg: '#f9fafb',
  text: '#111827',
  green: '#16a34a',
  red: '#dc2626',
  orange: '#ea580c',
  white: '#ffffff',
  like: '#ef4444',
} as const;

export type AvatarTone =
  | 'sc'
  | 'aw'
  | 'am'
  | 'cc'
  | 'mech'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'j3'
  | 'j4';

export type ToneKey = AvatarTone;

export const AVATAR_COLORS: Record<AvatarTone, string> = {
  sc: '#dc2626',
  aw: '#2563eb',
  am: '#0ea5e9',
  cc: '#64748b',
  mech: '#0f766e',
  m2: '#b45309',
  m3: '#1d4ed8',
  m4: '#7c3aed',
  j3: '#0f766e',
  j4: '#ea580c',
};

export const TONES = AVATAR_COLORS;
