import {apiClient, endpoints} from '../api';

export const settingsShowroomProfileService = {
  async listShowroomProfile(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.settingsShowroomProfile.listShowroomProfile, {params});
    return data;
  },
  async updateShowroomProfile(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.settingsShowroomProfile.updateShowroomProfile, body);
    return data;
  },
  async uploadLogo(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.settingsShowroomProfile.uploadLogo, body);
    return data;
  },
};
