/* import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
 */


import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>

        {/* Tabs principais */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Perfil */}
        <Stack.Screen
          name="perfil/index"
          options={{
            title: 'Perfil',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="perfil/meusdados"
          options={{ title: 'Meus Dados' }}
        />

        <Stack.Screen
          name="perfil/testeagendados"
          options={{ title: 'Test Drives' }}
        />

        <Stack.Screen
          name="perfil/historico"
          options={{ title: 'Histórico' }}
        />

        <Stack.Screen
          name="perfil/notificacoes"
          options={{ title: 'Notificações' }}
        />

        <Stack.Screen
          name="ajuda"
          options={{ title: 'Ajuda e Suporte' }}
        />

        <Stack.Screen
          name="sobre"
          options={{ title: 'Sobre o App' }}
        />

         {/* Mensagens */}
        

        <Stack.Screen
          name="mensagem/chat"
          options={{ title: 'Meus Chats' }}
        />

        <Stack.Screen
          name="mensagem/chatvendedor"
          options={{ title: 'Chat Online' }}
        />

      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
