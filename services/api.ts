import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

// Altere para o IP da sua máquina quando testar no dispositivo físico
// Ex: 'http://192.168.1.100:3000'
const BASE_URL = 'http://192.168.1.105:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Injeta o token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@autolink:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Trata 401 (não autorizado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Remove dados de autenticação
      await AsyncStorage.removeItem('@autolink:token');
      await AsyncStorage.removeItem('@autolink:user');
      
      // Redireciona para login
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

// Helper para upload de arquivos (FormData)
export const uploadApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Interceptor para uploadApi também
uploadApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@autolink:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);