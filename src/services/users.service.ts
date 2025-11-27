import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

interface UpdateUserData {
  displayName?: string;
  username?: string;
  email?: string;
}

interface User {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  createdAt: string;
}

export const usersService = {
  async get(userId: string): Promise<User> {
    const response = await apiService.get<User>(
      ENDPOINTS.USERS.GET(userId)
    );
    return response.payload;
  },

  async update(userId: string, data: UpdateUserData): Promise<User> {
    const response = await apiService.put<User>(
      ENDPOINTS.USERS.UPDATE(userId),
      data
    );
    return response.payload;
  },
};