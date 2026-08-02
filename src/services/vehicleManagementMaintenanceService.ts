import {apiClient, endpoints} from '../api';

export const vehicleManagementMaintenanceService = {
  async getVehiclesByIdMaintenance(vehicle: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleManagementMaintenance.getVehiclesByIdMaintenance(vehicle), {params});
    return data;
  },
  async createVehiclesByIdMaintenance(vehicle: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleManagementMaintenance.createVehiclesByIdMaintenance(vehicle), body);
    return data;
  },
};
