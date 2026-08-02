import axios from 'axios';
import {API_BASE_URL} from '../constants';
import {clearAuthSession, getAuthToken} from './tokenStorage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      // Let RN set multipart boundary
      if (config.headers) {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
    } else if (config.data != null && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      await clearAuthSession();
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const err = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
        errors?: Record<string, string[] | string>;
      };
    };
    message?: string;
  };

  const data = err.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) {
      return String(first[0]);
    }
    if (typeof first === 'string') {
      return first;
    }
  }

  if (data?.message) {
    return data.message;
  }
  if (data?.error) {
    return data.error;
  }
  if (err.message) {
    return err.message;
  }
  return fallback;
}
