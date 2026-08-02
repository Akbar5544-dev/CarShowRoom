import {apiClient, endpoints} from '../api';

export const vehicleRentalRentOrdersService = {
  async listRentOrders(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleRentalRentOrders.listRentOrders, {params});
    return data;
  },
  async createRentOrders(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.vehicleRentalRentOrders.createRentOrders, body);
    return data;
  },
  async getRentOrdersById(rentOrder: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.vehicleRentalRentOrders.getRentOrdersById(rentOrder), {params});
    return data;
  },
  async updateRentOrdersById(rentOrder: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.vehicleRentalRentOrders.updateRentOrdersById(rentOrder), body);
    return data;
  },
  async deleteRentOrdersById(rentOrder: string | number) {
    const {data} = await apiClient.delete(endpoints.vehicleRentalRentOrders.deleteRentOrdersById(rentOrder));
    return data;
  },
};
