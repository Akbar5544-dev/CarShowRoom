import {apiClient, endpoints} from '../api';

export const accountingSuppliersService = {
  async listSuppliers(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingSuppliers.listSuppliers, {params});
    return data;
  },
  async createSuppliers(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingSuppliers.createSuppliers, body);
    return data;
  },
  async getSuppliersById(supplier: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingSuppliers.getSuppliersById(supplier), {params});
    return data;
  },
  async updateSuppliersById(supplier: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingSuppliers.updateSuppliersById(supplier), body);
    return data;
  },
  async deleteSuppliersById(supplier: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingSuppliers.deleteSuppliersById(supplier));
    return data;
  },
};
