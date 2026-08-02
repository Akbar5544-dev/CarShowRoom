import {apiClient, endpoints} from '../api';

export const superAdminSubscriptionPlansService = {
  async listSuperAdminPlans(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminSubscriptionPlans.listSuperAdminPlans, {params});
    return data;
  },
  async createSuperAdminPlans(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.superAdminSubscriptionPlans.createSuperAdminPlans, body);
    return data;
  },
  async getSuperAdminPlansById(subscriptionPlan: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminSubscriptionPlans.getSuperAdminPlansById(subscriptionPlan), {params});
    return data;
  },
  async updateSuperAdminPlansById(subscriptionPlan: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.superAdminSubscriptionPlans.updateSuperAdminPlansById(subscriptionPlan), body);
    return data;
  },
  async deleteSuperAdminPlansById(subscriptionPlan: string | number) {
    const {data} = await apiClient.delete(endpoints.superAdminSubscriptionPlans.deleteSuperAdminPlansById(subscriptionPlan));
    return data;
  },
};
