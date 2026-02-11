import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';


/* ================== TIPOS ================== */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'VENDEDOR' | 'STAND';
  phone?: string;
  // Adicione outros campos conforme necessário
}

interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  authenticateWithBiometrics?: () => Promise<boolean>; // ⚡ Adicione aqui
}

/* ================== CONTEXT ================== */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/* ================== PROVIDER ================== */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  /* ====== CARREGAR SESSÃO AO INICIAR ====== */
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedToken = await AsyncStorage.getItem('@autolink:token');
      const storedUser = await AsyncStorage.getItem('@autolink:user');

      if (storedToken && storedUser) {
        const biometricOk = await authenticateWithBiometrics();

        if (!biometricOk) {
          await logout();
          return;
        }

        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
    } finally {
      setIsLoading(false);
    }
  }


  /* ====== LOGIN ====== */
  async function login(email: string, password: string): Promise<AuthUser> {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      // Salvar token e usuário
      await AsyncStorage.setItem('@autolink:token', data.accessToken);
      await AsyncStorage.setItem('@autolink:user', JSON.stringify(data.user));

      setToken(data.accessToken);
      setUser(data.user);

      // Redirecionar baseado no role
      redirectByRole(data.user.role);

      return data.user;
    } catch (error: any) {
      // Propagar erro para tratar na tela
      throw error;
    }
  }

  async function authenticateWithBiometrics() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      return true; // Se não tiver biometria, deixa entrar
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para continuar',
      fallbackLabel: 'Usar senha',
    });

    return result.success;
  }

  /* ====== LOGOUT ====== */
  async function logout() {
    try {
      // Limpar dados
      await AsyncStorage.removeItem('@autolink:token');
      await AsyncStorage.removeItem('@autolink:user');

      setUser(null);
      setToken(null);

      // Redirecionar para login
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  /* ====== REDIRECIONAR POR ROLE ====== */
  function redirectByRole(role: string) {
    switch (role) {
      case 'ADMIN':
        router.replace('/(admin)');
        break;
      case 'STAND':
        router.replace('/(vendedorstand)');
        break;
      case 'VENDEDOR':
        router.replace('/(vendedorinformal)');
        break;
      case 'USER':
      default:
        router.replace('/(tabs)');
        break;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        authenticateWithBiometrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}




/* ================== HOOK ================== */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}