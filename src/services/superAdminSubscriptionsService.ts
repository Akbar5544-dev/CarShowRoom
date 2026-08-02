import {apiClient, endpoints} from '../api';

export const superAdminSubscriptionsService = {
  async listSuperAdminSubscriptions(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminSubscriptions.listSuperAdminSubscriptions, {params});
    return data;
  },
  async createSuperAdminSubscriptions(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.superAdminSubscriptions.createSuperAdminSubscriptions, body);
    return data;
  },
  async getSuperAdminSubscriptionsById(subscription: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminSubscriptions.getSuperAdminSubscriptionsById(subscription), {params});
    return data;
  },
  async updateSuperAdminSubscriptionsById(subscription: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.superAdminSubscriptions.updateSuperAdminSubscriptionsById(subscription), body);
    return data;
  },
  async deleteSuperAdminSubscriptionsById(subscription: string | number) {
    const {data} = await apiClient.delete(endpoints.superAdminSubscriptions.deleteSuperAdminSubscriptionsById(subscription));
    return data;
  },
};
