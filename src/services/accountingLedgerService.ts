import {apiClient, endpoints} from '../api';

export const accountingLedgerService = {
  async listLedger(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingLedger.listLedger, {params});
    return data;
  },
  async getLedgerSummary(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingLedger.getLedgerSummary, {params});
    return data;
  },
};
