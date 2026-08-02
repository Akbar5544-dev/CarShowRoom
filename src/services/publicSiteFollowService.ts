import {apiClient, endpoints} from '../api';

export const publicSiteFollowService = {
  async listPublicFollows(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteFollow.listPublicFollows, {params});
    return data;
  },
  async createPublicFollows(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.publicSiteFollow.createPublicFollows, body);
    return data;
  },
  async deletePublicFollowsById(showroom: string | number) {
    const {data} = await apiClient.delete(endpoints.publicSiteFollow.deletePublicFollowsById(showroom));
    return data;
  },
};
