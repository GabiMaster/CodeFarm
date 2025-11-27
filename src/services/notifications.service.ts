import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationsService = {
  async get(userId: string): Promise<Notification[]> {
    const response = await apiService.get<Notification[]>(
      ENDPOINTS.NOTIFICATIONS.GET(userId)
    );
    return response.payload;
  },
};