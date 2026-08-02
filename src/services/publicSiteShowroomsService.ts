import {apiClient, endpoints} from '../api';

export const publicSiteShowroomsService = {
  async listPublicShowrooms(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteShowrooms.listPublicShowrooms, {params});
    return data;
  },
  async getPublicShowroomsById(slug: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteShowrooms.getPublicShowroomsById(slug), {params});
    return data;
  },
};
