export const APP_NAME = 'CarShowRoom';

export const API_BASE_URL =
'https://9c51-161-248-202-3.ngrok-free.app/api'
  // 'https://kashmirinterprises.com/car_showroom/public/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  /** Active showroom/admin Sanctum token */
  SHOWROOM_TOKEN: 'showroom_auth_token',
  /** Active customer / public Sanctum token */
  CUSTOMER_TOKEN: 'customer_auth_token',
  USER: 'user',
  /** Role picked at sign up / login for the active session. */
  AUTH_ROLE: 'auth_role',
  /** email -> role, so logging back in keeps the role chosen at sign up. */
  AUTH_ROLE_MAP: 'auth_role_map',
} as const;
