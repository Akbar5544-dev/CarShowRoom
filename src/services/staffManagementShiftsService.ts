import {apiClient, endpoints} from '../api';

export const staffManagementShiftsService = {
  async listShifts(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementShifts.listShifts, {params});
    return data;
  },
  async createShifts(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementShifts.createShifts, body);
    return data;
  },
  async getShiftsById(shift: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementShifts.getShiftsById(shift), {params});
    return data;
  },
  async updateShiftsById(shift: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.staffManagementShifts.updateShiftsById(shift), body);
    return data;
  },
  async deleteShiftsById(shift: string | number) {
    const {data} = await apiClient.delete(endpoints.staffManagementShifts.deleteShiftsById(shift));
    return data;
  },
  async assignShift(shift: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementShifts.assignShift(shift), body);
    return data;
  },
};
