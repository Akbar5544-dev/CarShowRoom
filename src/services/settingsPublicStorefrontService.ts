import {apiClient, endpoints} from '../api';

export const settingsPublicStorefrontService = {
  async listShowroomProfilePublic(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.settingsPublicStorefront.listShowroomProfilePublic, {params});
    return data;
  },
  async updateShowroomProfilePublic(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.settingsPublicStorefront.updateShowroomProfilePublic, body);
    return data;
  },
  async uploadLogo(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.settingsPublicStorefront.uploadLogo, body);
    return data;
  },
  async uploadCover(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.settingsPublicStorefront.uploadCover, body);
    return data;
  },
};
