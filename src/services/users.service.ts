import { ENDPOINTS } from '../config/api.config';
import { apiService } from './api.service';

interface UpdateUserData {
  displayName?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  image?: string;
  bio?: string;
  avatar?: string;
}

interface User {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  image?: string;
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