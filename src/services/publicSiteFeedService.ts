import {apiClient, endpoints} from '../api';

export const publicSiteFeedService = {
  async listFeed(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteFeed.listFeed, {
      params,
    });
    return data;
  },
  async listComments(vehicle: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteFeed.listComments(vehicle),
      {params},
    );
    return data;
  },
  async like(vehicle: string | number) {
    const {data} = await apiClient.post(endpoints.publicSiteFeed.like(vehicle));
    return data;
  },
  async unlike(vehicle: string | number) {
    const {data} = await apiClient.delete(
      endpoints.publicSiteFeed.unlike(vehicle),
    );
    return data;
  },
  async share(vehicle: string | number, body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteFeed.share(vehicle),
      body,
    );
    return data;
  },
  async storeComment(vehicle: string | number, body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteFeed.storeComment(vehicle),
      body,
    );
    return data;
  },
  async destroyComment(comment: string | number) {
    const {data} = await apiClient.delete(
      endpoints.publicSiteFeed.destroyComment(comment),
    );
    return data;
  },
  async likedVehicles(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteFeed.likedVehicles, {
      params,
    });
    return data;
  },
  async sharedVehicles(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteFeed.sharedVehicles, {
      params,
    });
    return data;
  },
};
