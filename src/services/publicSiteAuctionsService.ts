import {apiClient, endpoints} from '../api';

export const publicSiteAuctionsService = {
  async listAuctions(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteAuctions.listAuctions,
      {params},
    );
    return data;
  },
  async getById(auction: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteAuctions.getById(auction),
      {params},
    );
    return data;
  },
  async listBids(auction: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteAuctions.listBids(auction),
      {params},
    );
    return data;
  },
  async watch(auction: string | number) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuctions.watch(auction),
    );
    return data;
  },
  async unwatch(auction: string | number) {
    const {data} = await apiClient.delete(
      endpoints.publicSiteAuctions.unwatch(auction),
    );
    return data;
  },
  async placeBid(auction: string | number, body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteAuctions.placeBid(auction),
      body,
    );
    return data;
  },
};
