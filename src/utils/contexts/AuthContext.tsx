import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

interface User {
  uid: string;
  email: string;
  displayName: string;
  username: string;
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
  }) => {
    try {
      setIsLoading(true);
      const userData = await authService.register(data);
      setUser({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        username: userData.username,
      });
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
    });
  } catch (error: any) {
    // Propagar el error original si tiene response
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // Si es un error de axios sin response, podría ser problema de red
    if (error.message?.includes('Network')) {
      throw new Error('Error de conexión. Verificá tu internet.');
    }
    
    // Error genérico
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