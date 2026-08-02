import {apiClient, endpoints} from '../api';

export const accountingBonusesService = {
  async listBonuses(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingBonuses.listBonuses, {params});
    return data;
  },
  async createBonuses(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingBonuses.createBonuses, body);
    return data;
  },
  async getBonusesById(bonus: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingBonuses.getBonusesById(bonus), {params});
    return data;
  },
  async updateBonusesById(bonus: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingBonuses.updateBonusesById(bonus), body);
    return data;
  },
  async deleteBonusesById(bonus: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingBonuses.deleteBonusesById(bonus));
    return data;
  },
  async approveBonusesById(bonus: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingBonuses.approveBonusesById(bonus), body);
    return data;
  },
};
