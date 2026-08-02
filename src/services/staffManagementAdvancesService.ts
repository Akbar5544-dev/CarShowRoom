import {apiClient, endpoints} from '../api';

export const staffManagementAdvancesService = {
  async listAdvances(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementAdvances.listAdvances, {params});
    return data;
  },
  async createAdvances(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementAdvances.createAdvances, body);
    return data;
  },
  async getAdvancesById(staffAdvance: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementAdvances.getAdvancesById(staffAdvance), {params});
    return data;
  },
  async updateAdvancesById(staffAdvance: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.staffManagementAdvances.updateAdvancesById(staffAdvance), body);
    return data;
  },
  async deleteAdvancesById(staffAdvance: string | number) {
    const {data} = await apiClient.delete(endpoints.staffManagementAdvances.deleteAdvancesById(staffAdvance));
    return data;
  },
};
