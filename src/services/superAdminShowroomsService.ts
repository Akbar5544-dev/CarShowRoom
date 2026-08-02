import {apiClient, endpoints} from '../api';

export const superAdminShowroomsService = {
  async listSuperAdminShowrooms(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminShowrooms.listSuperAdminShowrooms, {params});
    return data;
  },
  async createSuperAdminShowrooms(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.superAdminShowrooms.createSuperAdminShowrooms, body);
    return data;
  },
  async getSuperAdminShowroomsById(showroom: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminShowrooms.getSuperAdminShowroomsById(showroom), {params});
    return data;
  },
  async updateSuperAdminShowroomsById(showroom: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.superAdminShowrooms.updateSuperAdminShowroomsById(showroom), body);
    return data;
  },
  async deleteSuperAdminShowroomsById(showroom: string | number) {
    const {data} = await apiClient.delete(endpoints.superAdminShowrooms.deleteSuperAdminShowroomsById(showroom));
    return data;
  },
  async setStatus(showroom: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.superAdminShowrooms.setStatus(showroom), body);
    return data;
  },
};
