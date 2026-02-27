import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors, FontSize } from '../../../constants/Colors';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
        },
      }}
    >
      {/* DASHBOARD */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />

      {/* USERS */}
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* STANDS */}
      <Tabs.Screen
        name="stands"
        options={{
          title: 'Stands',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />

      {/* VENDEDORES */}
      <Tabs.Screen
        name="vendedores"
        options={{
          title: 'Vendedores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}