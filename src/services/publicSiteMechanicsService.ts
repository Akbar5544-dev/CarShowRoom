import {apiClient, endpoints} from '../api';

export const publicSiteMechanicsService = {
  async listMechanics(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteMechanics.listMechanics,
      {params},
    );
    return data;
  },
  async getFilters(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteMechanics.getFilters, {
      params,
    });
    return data;
  },
  async getById(idOrSlug: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteMechanics.getById(idOrSlug),
      {params},
    );
    return data;
  },
};
