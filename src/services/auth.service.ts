import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../config/api.config';
import { apiService } from './api.service';

interface RegisterData {
  displayName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ChangePasswordData {
  uid: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserPayload {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  image?: string;
  createdAt?: string;
  token?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<UserPayload> {
    const response = await apiService.post<UserPayload>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    if (response.payload.token) {
      await AsyncStorage.setItem('authToken', response.payload.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.payload));
    }
    
    return response.payload;
  },

  async login(data: LoginData): Promise<UserPayload> {
    const response = await apiService.post<UserPayload>(
      ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    if (response.payload.token) {
      await AsyncStorage.setItem('authToken', response.payload.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.payload));
    }
    
    return response.payload;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiService.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  },
};