import {apiClient, endpoints} from '../api';

export const settingsStaffProfileService = {
  async getProfile(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.settingsStaffProfile.getProfile,
      {params},
    );
    return data;
  },

  async updateProfile(body?: {
    name?: string;
    phone?: string | null;
    language?: string | null;
  }) {
    const {data} = await apiClient.put(
      endpoints.settingsStaffProfile.updateProfile,
      body,
    );
    return data;
  },

  async changePassword(body: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    const {data} = await apiClient.post(
      endpoints.settingsStaffProfile.changePassword,
      body,
    );
    return data;
  },
};
