import {apiClient, endpoints} from '../api';

export const rolesPermissionsService = {
  async listRoles(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.rolesPermissions.listRoles, {params});
    return data;
  },
  async createRoles(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.rolesPermissions.createRoles, body);
    return data;
  },
  async listPermissions(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.rolesPermissions.listPermissions, {params});
    return data;
  },
  async getRolesById(role: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.rolesPermissions.getRolesById(role), {params});
    return data;
  },
  async updateRolesById(role: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.rolesPermissions.updateRolesById(role), body);
    return data;
  },
  async deleteRolesById(role: string | number) {
    const {data} = await apiClient.delete(endpoints.rolesPermissions.deleteRolesById(role));
    return data;
  },
  async assignShift(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.rolesPermissions.assignShift, body);
    return data;
  },
};
