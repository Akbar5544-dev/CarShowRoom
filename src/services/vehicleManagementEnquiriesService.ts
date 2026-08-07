import {apiClient, endpoints} from '../api';

export const vehicleManagementEnquiriesService = {
  async listEnquiries(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.vehicleManagementEnquiries.listEnquiries,
      {params},
    );
    return data;
  },

  async getEnquiryById(
    enquiry: string | number,
    params?: Record<string, unknown>,
  ) {
    const {data} = await apiClient.get(
      endpoints.vehicleManagementEnquiries.getEnquiryById(enquiry),
      {params},
    );
    return data;
  },

  async replyEnquiry(
    enquiry: string | number,
    body: {message: string} | Record<string, unknown>,
  ) {
    const {data} = await apiClient.post(
      endpoints.vehicleManagementEnquiries.replyEnquiry(enquiry),
      body,
    );
    return data;
  },

  async markEnquiryRead(enquiry: string | number) {
    const {data} = await apiClient.post(
      endpoints.vehicleManagementEnquiries.markEnquiryRead(enquiry),
    );
    return data;
  },
};
