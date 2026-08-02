import {apiClient, endpoints} from '../api';

export const publicSiteJobsService = {
  async listPublicJobs(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteJobs.listPublicJobs, {
      params,
    });
    return data;
  },
  async getPublicJobsFilters(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteJobs.getPublicJobsFilters,
      {params},
    );
    return data;
  },
  async getPublicJobsById(
    idOrSlug: string | number,
    params?: Record<string, unknown>,
  ) {
    const {data} = await apiClient.get(
      endpoints.publicSiteJobs.getPublicJobsById(idOrSlug),
      {params},
    );
    return data;
  },
  async applyPublicJobsById(
    idOrSlug: string | number,
    body?: Record<string, unknown> | FormData,
  ) {
    const {data} = await apiClient.post(
      endpoints.publicSiteJobs.applyPublicJobsById(idOrSlug),
      body,
    );
    return data;
  },
};
