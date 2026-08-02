import {apiClient, endpoints} from '../api';

export const vehicleManagementVehiclesService = {
  async listVehicles(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleManagementVehicles.listVehicles, {params});
    return data;
  },
  async createVehicles(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleManagementVehicles.createVehicles, body);
    return data;
  },
  async getVehiclesById(vehicle: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleManagementVehicles.getVehiclesById(vehicle), {params});
    return data;
  },
  async updateVehiclesById(vehicle: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.vehicleManagementVehicles.updateVehiclesById(vehicle), body);
    return data;
  },
  async deleteVehiclesById(vehicle: string | number) {
    const {data} = await apiClient.delete(endpoints.vehicleManagementVehicles.deleteVehiclesById(vehicle));
    return data;
  },
  async uploadImages(vehicle: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleManagementVehicles.uploadImages(vehicle), body);
    return data;
  },
  async deleteImage(vehicle: string | number, image: string | number) {
    const {data} = await apiClient.delete(endpoints.vehicleManagementVehicles.deleteImage(vehicle, image));
    return data;
  },
  async uploadDocuments(vehicle: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleManagementVehicles.uploadDocuments(vehicle), body);
    return data;
  },
  async deleteDocument(vehicle: string | number, document: string | number) {
    const {data} = await apiClient.delete(endpoints.vehicleManagementVehicles.deleteDocument(vehicle, document));
    return data;
  },
};
