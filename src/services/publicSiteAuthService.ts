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
    const {data} = await apiClient.post(endpoints.publicSiteAuth.loginWithGoogle, body);
    return data;
  },
  async getMe(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteAuth.getMe, {params});
    return data;
  },
  async logout() {
    const {data} = await apiClient.post(endpoints.publicSiteAuth.logout);
    return data;
  },
};
