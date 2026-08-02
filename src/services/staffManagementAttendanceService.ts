import {apiClient, endpoints} from '../api';

export const staffManagementAttendanceService = {
  async listAttendance(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementAttendance.listAttendance, {params});
    return data;
  },
  async createAttendance(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.staffManagementAttendance.createAttendance, body);
    return data;
  },
  async getAttendanceById(staffAttendance: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.staffManagementAttendance.getAttendanceById(staffAttendance), {params});
    return data;
  },
  async updateAttendanceById(staffAttendance: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.staffManagementAttendance.updateAttendanceById(staffAttendance), body);
    return data;
  },
  async deleteAttendanceById(staffAttendance: string | number) {
    const {data} = await apiClient.delete(endpoints.staffManagementAttendance.deleteAttendanceById(staffAttendance));
    return data;
  },
};
