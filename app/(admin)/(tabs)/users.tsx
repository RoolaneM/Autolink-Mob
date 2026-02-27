import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseStyles } from '../pagina/styles';

import { Colors, Spacing } from '../../../constants/Colors';
import { AdminUser, getPendingUsers, verifyUser } from '../../../services/adminService';

export default function UsersScreen() {
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getPendingUsers();
      setData(res);
    } catch {
      Alert.alert('Erro', 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const handleVerify = async (id: number) => {
    try {
      await verifyUser(id);
      Alert.alert('Sucesso', 'Usuário verificado');
      load();
    } catch {
      Alert.alert('Erro', 'Não foi possível verificar');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.user.name}</Text>
              <Text style={styles.email}>{item.user.email}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleVerify(item.user.id)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-done" size={40} color={Colors.success} />
            <Text style={styles.emptyText}>Nenhum usuário pendente</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = baseStyles();


