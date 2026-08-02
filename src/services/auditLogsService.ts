import {apiClient, endpoints} from '../api';

export const auditLogsService = {
  async listAuditLogs(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.auditLogs.listAuditLogs, {params});
    return data;
  },
};
