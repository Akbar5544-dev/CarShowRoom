import {apiClient, endpoints} from '../api';

export const accountingSalesService = {
  async listSales(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingSales.listSales, {params});
    return data;
  },
  async createSales(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingSales.createSales, body);
    return data;
  },
  async getSalesById(carSale: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingSales.getSalesById(carSale), {params});
    return data;
  },
  async updateSalesById(carSale: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingSales.updateSalesById(carSale), body);
    return data;
  },
  async deleteSalesById(carSale: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingSales.deleteSalesById(carSale));
    return data;
  },
};
