import {apiClient, endpoints} from '../api';

export const publicSiteNotificationsService = {
  async unreadCount(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(
      endpoints.publicSiteNotifications.unreadCount,
      {params},
    );
    return data;
  },
  async list(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.publicSiteNotifications.list, {
      params,
    });
    return data;
  },
  async markAllRead() {
    const {data} = await apiClient.post(
      endpoints.publicSiteNotifications.markAllRead,
    );
    return data;
  },
  async markRead(notification: string | number) {
    const {data} = await apiClient.post(
      endpoints.publicSiteNotifications.markRead(notification),
    );
    return data;
  },
  async destroy(notification: string | number) {
    const {data} = await apiClient.delete(
      endpoints.publicSiteNotifications.destroy(notification),
    );
    return data;
  },
};
