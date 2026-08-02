import {apiClient, endpoints} from '../api';

export const publicSiteEnquiriesService = {
  async createPublicEnquiries(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.publicSiteEnquiries.createPublicEnquiries, body);
    return data;
  },
};
