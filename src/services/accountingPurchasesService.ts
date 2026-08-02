import {apiClient, endpoints} from '../api';

export const accountingPurchasesService = {
  async listPurchases(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingPurchases.listPurchases, {params});
    return data;
  },
  async createPurchases(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingPurchases.createPurchases, body);
    return data;
  },
  async getPurchasesById(carPurchase: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingPurchases.getPurchasesById(carPurchase), {params});
    return data;
  },
  async updatePurchasesById(carPurchase: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingPurchases.updatePurchasesById(carPurchase), body);
    return data;
  },
  async deletePurchasesById(carPurchase: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingPurchases.deletePurchasesById(carPurchase));
    return data;
  },
};
