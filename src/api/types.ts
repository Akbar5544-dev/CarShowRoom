export type ApiSuccess<T> = {
  message?: string;
  data: T;
};

export type AuthUser = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

export type AuthLoginData = {
  user: AuthUser;
  roles?: string[];
  permissions?: string[];
  token: string;
};

export type AuthRegisterPayload = {
  showroom_name: string;
  owner_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'customer';
  country?: string;
  city?: string;
  address?: string;
};

export type AuthLoginPayload = {
  email: string;
  password: string;
};
