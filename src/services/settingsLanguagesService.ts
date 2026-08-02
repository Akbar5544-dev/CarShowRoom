import {apiClient, endpoints} from '../api';

export const settingsLanguagesService = {
  async listLanguages(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.settingsLanguages.listLanguages, {params});
    return data;
  },
  async createLanguages(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.settingsLanguages.createLanguages, body);
    return data;
  },
  async updateLanguagesById(language: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.settingsLanguages.updateLanguagesById(language), body);
    return data;
  },
  async deleteLanguagesById(language: string | number) {
    const {data} = await apiClient.delete(endpoints.settingsLanguages.deleteLanguagesById(language));
    return data;
  },
};
