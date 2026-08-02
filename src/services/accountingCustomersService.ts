import {apiClient, endpoints} from '../api';

export const accountingCustomersService = {
  async listCustomers(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingCustomers.listCustomers, {params});
    return data;
  },
  async createCustomers(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingCustomers.createCustomers, body);
    return data;
  },
  async getCustomersById(customer: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingCustomers.getCustomersById(customer), {params});
    return data;
  },
  async updateCustomersById(customer: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingCustomers.updateCustomersById(customer), body);
    return data;
  },
  async deleteCustomersById(customer: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingCustomers.deleteCustomersById(customer));
    return data;
  },
};
