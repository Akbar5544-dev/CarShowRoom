import {apiClient, endpoints} from '../api';

export const publicSiteAuthService = {
  async register(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.publicSiteAuth.register, body);
    return data;
  },
  async login(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.publicSiteAuth.login, body);
    return data;
  },
  async loginWithGoogle(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.loginWithGoogle,
      body,
    );
    return data;
  },
  async forgotPassword(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.forgotPassword,
      body,
    );
    return data;
  },
  async verifyResetCode(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.verifyResetCode,
      body,
    );
    return data;
  },
  async resetPassword(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.resetPassword,
      body,
    );
    return data;
  },
  async getMe(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteAuth.getMe, {
      params,
    });
    return data;
  },
  async logout() {
    const {data} = await apiClient.post(endpoints.publicSiteAuth.logout);
    return data;
  },
  async updateProfile(body?: Record<string, unknown>) {
    const {data} = await apiClient.put(
      endpoints.publicSiteAuth.updateProfile,
      body,
    );
    return data;
  },
  async updateAvatar(body?: FormData) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.updateAvatar,
      body,
    );
    return data;
  },
  async updateBackground(body?: FormData) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.updateBackground,
      body,
    );
    return data;
  },
  async updateSettings(body?: Record<string, unknown>) {
    const {data} = await apiClient.put(
      endpoints.publicSiteAuth.updateSettings,
      body,
    );
    return data;
  },
  async changePassword(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuth.changePassword,
      body,
    );
    return data;
  },
};
