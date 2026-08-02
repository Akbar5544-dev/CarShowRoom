import {apiClient, endpoints} from '../api';

export const notificationsService = {
  async listNotifications(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.notifications.listNotifications, {params});
    return data;
  },
  async markRead(notification: string | number) {
    const {data} = await apiClient.post(endpoints.notifications.markRead(notification));
    return data;
  },
  async markAllRead() {
    const {data} = await apiClient.post(endpoints.notifications.markAllRead);
    return data;
  },
  async deleteNotificationsById(notification: string | number) {
    const {data} = await apiClient.delete(endpoints.notifications.deleteNotificationsById(notification));
    return data;
  },
};
