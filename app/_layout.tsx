/* import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(vendedorinformal)/(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(vendedorstand)/(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />

          <Stack.Screen name="perfil/meusdados" options={{ headerShown: false }} />
          <Stack.Screen name="perfil/testeagendados" options={{ headerShown: false }} />
          <Stack.Screen name="perfil/historico" options={{ headerShown: false }} />
          <Stack.Screen name="perfil/notificacoes" options={{ headerShown: false }} />
          <Stack.Screen name="ajuda" options={{ headerShown: false }} />
          <Stack.Screen name="sobre" options={{ headerShown: false }} />
          <Stack.Screen name="mensagem/chat" options={{ headerShown: false }} />
          <Stack.Screen name="mensagem/chatvendedor" options={{ headerShown: false }} />
          <Stack.Screen name="termos" options={{ headerShown: false }} />
          <Stack.Screen name="politicas" options={{ headerShown: false }} />
          <Stack.Screen name="pendente-stand" options={{ headerShown: false }} />
          <Stack.Screen name="pendente-vendedor" options={{ headerShown: false }} />
          <Stack.Screen name="selfie-camera" options={{ headerShown: false }} />


        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
 */


import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        
        {/* O Expo Router registra automaticamente todas as rotas */}
        <Stack screenOptions={{ headerShown: false }} />

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
