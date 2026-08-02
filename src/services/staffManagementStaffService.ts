import {apiClient, endpoints} from '../api';

export const staffManagementStaffService = {
  async listStaff(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementStaff.listStaff, {params});
    return data;
  },
  async createStaff(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementStaff.createStaff, body);
    return data;
  },
  async getStaffById(staff: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementStaff.getStaffById(staff), {params});
    return data;
  },
  async updateStaffById(staff: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.staffManagementStaff.updateStaffById(staff), body);
    return data;
  },
  async deleteStaffById(staff: string | number) {
    const {data} = await apiClient.delete(endpoints.staffManagementStaff.deleteStaffById(staff));
    return data;
  },
  async uploadPhoto(staff: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementStaff.uploadPhoto(staff), body);
    return data;
  },
  async uploadDocuments(staff: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementStaff.uploadDocuments(staff), body);
    return data;
  },
};
