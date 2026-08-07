import {apiClient, endpoints} from '../api';
import type {
  ApiSuccess,
  AuthLoginData,
  AuthLoginPayload,
  AuthRegisterPayload,
} from '../api';

export const authService = {
  async register(body: AuthRegisterPayload | FormData) {
    const {data} = await apiClient.post<ApiSuccess<AuthLoginData>>(
      endpoints.auth.register,
      body,
    );
    return data;
  },

  async login(body: AuthLoginPayload) {
    const {data} = await apiClient.post<ApiSuccess<AuthLoginData>>(
      endpoints.auth.login,
      body,
    );
    return data;
  },

  async getMe(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.auth.getMe, {params});
    return data;
  },

  async logout() {
    const {data} = await apiClient.post(endpoints.auth.logout);
    return data;
  },

  async forgotPassword(body: {email: string}) {
    const {data} = await apiClient.post(endpoints.auth.forgotPassword, body);
    return data;
  },

  async verifyResetCode(body: {email: string; code: string}) {
    const {data} = await apiClient.post(endpoints.auth.verifyResetCode, body);
    return data;
  },

  async resetPassword(body: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }) {
    const {data} = await apiClient.post(endpoints.auth.resetPassword, body);
    return data;
  },
};
