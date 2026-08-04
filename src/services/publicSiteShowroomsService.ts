import {apiClient, endpoints} from '../api';

export const publicSiteShowroomsService = {
  async listPublicShowrooms(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteShowrooms.listPublicShowrooms,
      {params},
    );
    return data;
  },
  async getPublicShowroomsById(
    slug: string | number,
    params?: Record<string, unknown>,
  ) {
    const {data} = await apiClient.get(
      endpoints.publicSiteShowrooms.getPublicShowroomsById(slug),
      {params},
    );
    return data;
  },
  async listRatings(showroom: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteShowrooms.listRatings(showroom),
      {params},
    );
    return data;
  },
  async storeRating(showroom: string | number, body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteShowrooms.storeRating(showroom),
      body,
    );
    return data;
  },
  async myRating(showroom: string | number) {
    const {data} = await apiClient.get(
      endpoints.publicSiteShowrooms.myRating(showroom),
    );
    return data;
  },
};
