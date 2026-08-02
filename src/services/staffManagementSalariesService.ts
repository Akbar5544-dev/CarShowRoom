import {apiClient, endpoints} from '../api';

export const staffManagementSalariesService = {
  async listSalaries(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementSalaries.listSalaries, {params});
    return data;
  },
  async createSalaries(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementSalaries.createSalaries, body);
    return data;
  },
  async getSalariesById(salary: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementSalaries.getSalariesById(salary), {params});
    return data;
  },
  async updateSalariesById(salary: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.staffManagementSalaries.updateSalariesById(salary), body);
    return data;
  },
  async deleteSalariesById(salary: string | number) {
    const {data} = await apiClient.delete(endpoints.staffManagementSalaries.deleteSalariesById(salary));
    return data;
  },
};
