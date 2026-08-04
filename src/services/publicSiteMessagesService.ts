import {apiClient, endpoints} from '../api';

export const publicSiteMessagesService = {
  async unreadCount(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteMessages.unreadCount, {
      params,
    });
    return data;
  },
  async list(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteMessages.list, {
      params,
    });
    return data;
  },
  async create(body?: Record<string, unknown>) {
    const {data} = await apiClient.post(endpoints.publicSiteMessages.create, body);
    return data;
  },
  async show(conversation: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteMessages.show(conversation),
      {params},
    );
    return data;
  },
  async send(conversation: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(
      endpoints.publicSiteMessages.send(conversation),
      body,
    );
    return data;
  },
};
