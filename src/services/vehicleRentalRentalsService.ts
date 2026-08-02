import {apiClient, endpoints} from '../api';

export const vehicleRentalRentalsService = {
  async listRentals(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleRentalRentals.listRentals, {params});
    return data;
  },
  async createRentals(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleRentalRentals.createRentals, body);
    return data;
  },
  async getRentalsById(rental: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleRentalRentals.getRentalsById(rental), {params});
    return data;
  },
  async updateRentalsById(rental: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.vehicleRentalRentals.updateRentalsById(rental), body);
    return data;
  },
  async deleteRentalsById(rental: string | number) {
    const {data} = await apiClient.delete(endpoints.vehicleRentalRentals.deleteRentalsById(rental));
    return data;
  },
  async returnRental(rental: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleRentalRentals.returnRental(rental), body);
    return data;
  },
};
