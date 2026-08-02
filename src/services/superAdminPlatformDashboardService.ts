import {apiClient, endpoints} from '../api';

export const superAdminPlatformDashboardService = {
  async listSuperAdminDashboard(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.superAdminPlatformDashboard.listSuperAdminDashboard, {params});
    return data;
  },
};
