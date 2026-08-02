import {apiClient, endpoints} from '../api';

export const vehicleManagementCategoriesService = {
  async listCategories(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleManagementCategories.listCategories, {params});
    return data;
  },
  async createCategories(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleManagementCategories.createCategories, body);
    return data;
  },
  async getCategoriesById(carCategory: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleManagementCategories.getCategoriesById(carCategory), {params});
    return data;
  },
  async updateCategoriesById(carCategory: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.vehicleManagementCategories.updateCategoriesById(carCategory), body);
    return data;
  },
  async deleteCategoriesById(carCategory: string | number) {
    const {data} = await apiClient.delete(endpoints.vehicleManagementCategories.deleteCategoriesById(carCategory));
    return data;
  },
  async uploadImage(carCategory: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleManagementCategories.uploadImage(carCategory), body);
    return data;
  },
};
