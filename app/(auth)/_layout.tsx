import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="registro-cliente"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="registro-stand"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="registro-vendedor"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="auth-lock"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="recuperar-senha"
        options={{
          title: 'Recuperar Senha',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}