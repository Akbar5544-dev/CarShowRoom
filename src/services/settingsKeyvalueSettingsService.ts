import {apiClient, endpoints} from '../api';

export const settingsKeyvalueSettingsService = {
  async listSettings(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.settingsKeyvalueSettings.listSettings, {params});
    return data;
  },
  async createSettings(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.settingsKeyvalueSettings.createSettings, body);
    return data;
  },
  async deleteSettingsById(setting: string | number) {
    const {data} = await apiClient.delete(endpoints.settingsKeyvalueSettings.deleteSettingsById(setting));
    return data;
  },
};
