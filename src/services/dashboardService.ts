import {apiClient, endpoints} from '../api';

export const dashboardService = {
  async getDashboard(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.dashboard.getDashboard, {params});
    return data;
  },
};
