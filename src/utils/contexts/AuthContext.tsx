import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

interface User {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  image?: string;
}

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
    register: (data: {
    displayName: string;
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
  register: async () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

    const register = async (data: {
    displayName: string;
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      const userData = {
        uid: response.uid,
        email: response.email,
        displayName: response.displayName,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: response.phoneNumber,
      };
      
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    const userData = await authService.login({ email, password });
    setUser({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      image: userData.image,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    if (error.message?.includes('Network')) {
      throw new Error('Error de conexión. Verificá tu internet.');
    }
    
    throw new Error(error.message || 'Credenciales incorrectas');
  } finally {
    setIsLoading(false);
  }
};

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUserData = await usersService.update(user.uid, data);
      const updatedUser = {
        uid: updatedUserData.uid,
        email: updatedUserData.email,
        displayName: updatedUserData.displayName,
        username: updatedUserData.username,
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        phoneNumber: updatedUserData.phoneNumber,
        image: updatedUserData.image,
      };
      
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar usuario';
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn, 
        signOut, 
        updateUser, 
        register, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};