import {apiClient, endpoints} from '../api';

export const publicSiteSavedVehiclesService = {
  async listPublicSavedVehicles(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteSavedVehicles.listPublicSavedVehicles, {params});
    return data;
  },
  async createPublicSavedVehicles(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.publicSiteSavedVehicles.createPublicSavedVehicles, body);
    return data;
  },
  async deletePublicSavedVehiclesById(vehicle: string | number) {
    const {data} = await apiClient.delete(endpoints.publicSiteSavedVehicles.deletePublicSavedVehiclesById(vehicle));
    return data;
  },
};
