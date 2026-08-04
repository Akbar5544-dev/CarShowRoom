import {apiClient, endpoints} from '../api';

export const publicSiteContactService = {
  async createContact(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteContact.createContact,
      body,
    );
    return data;
  },
};

export const publicSiteListingReportService = {
  async createReport(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(
      endpoints.publicSiteListingReport.createReport,
      body,
    );
    return data;
  },
};
