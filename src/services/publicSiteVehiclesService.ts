import {apiClient, endpoints} from '../api';

export const publicSiteVehiclesService = {
  async listPublicVehicles(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteVehicles.listPublicVehicles,
      {params},
    );
    return data;
  },
  async getPublicVehiclesFilters(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteVehicles.getPublicVehiclesFilters,
      {params},
    );
    return data;
  },
  async getPublicVehiclesById(
    vehicle: string | number,
    params?: Record<string, unknown>,
  ) {
    const {data} = await apiClient.get(
      endpoints.publicSiteVehicles.getPublicVehiclesById(vehicle),
      {params},
    );
    return data;
  },
  async createTestDrive(
    vehicle: string | number,
    body?: Record<string, unknown>,
  ) {
    const {data} = await apiClient.post(
      endpoints.publicSiteVehicles.createTestDrive(vehicle),
      body,
    );
    return data;
  },
};
