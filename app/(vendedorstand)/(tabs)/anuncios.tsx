import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { Car, CarService } from '../../../services/CarService';

export default function MeusAnunciosScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMyCars();
  }, []);

  const loadMyCars = async () => {
    try {
      setLoading(true);
      const carsData = await CarService.getMyCars();
      setCars(carsData);
    } catch (error) {
      console.error('Erro ao carregar carros:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus anúncios.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyCars();
    setRefreshing(false);
  };

  const handleDelete = (carId: string, marca: string, modelo: string) => {
    Alert.alert(
      'Remover Anúncio',
      `Tem certeza que deseja remover o ${marca} ${modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await CarService.deleteCar(carId);
              Alert.alert('Sucesso', 'Anúncio removido com sucesso!');
              loadMyCars();
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error.response?.data?.message || 'Não foi possível remover o anúncio.'
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Car }) => (
    <View style={styles.carCard}>
      <Image
        source={{ uri: item.imagemPrincipal || undefined }}
        style={styles.carImage}
        resizeMode="cover"
      />

      <View style={styles.carContent}>
        <View style={styles.carHeader}>
          <View style={styles.carTitleContainer}>
            <Text style={styles.carTitle} numberOfLines={1}>
              {item.marca} {item.modelo}
            </Text>
            <Text style={styles.carSubtitle}>{item.ano}</Text>
          </View>

          <Text style={styles.carPrice}>
            {item.preco.toLocaleString('pt-MZ', {
              style: 'currency',
              currency: 'MZN',
            })}
          </Text>
        </View>

        <View style={styles.carDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {(item.quilometragem / 1000).toFixed(0)}k km
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="eye-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{item.views || 0} visualizações</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="chatbubbles-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{item.messages || 0} mensagens</Text>
          </View>
        </View>

        <View style={styles.carActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
          /* onPress={() => router.push(`/editar-carro/${item.id}`)} */
          >
            <Ionicons name="create-outline" size={18} color={Colors.primary} />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id, item.marca, item.modelo)}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
            <Text style={styles.deleteButtonText}>Remover</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => router.push(`/detalhes/${item.id}`)}
          >
            <Ionicons name="eye-outline" size={18} color={Colors.info} />
            <Text style={styles.viewButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando anúncios...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Anúncios</Text>
          <Text style={styles.headerSubtitle}>
            {cars.length} {cars.length === 1 ? 'anúncio ativo' : 'anúncios ativos'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(vendedorstand)/(tabs)/adicionar')}
        >
          <Ionicons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="car-sport-outline" size={80} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhum anúncio ainda</Text>
            <Text style={styles.emptySubtext}>
              Comece adicionando seu primeiro carro
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(vendedorstand)/(tabs)/adicionar')}
            >
              <Ionicons name="add-circle" size={20} color={Colors.surface} />
              <Text style={styles.emptyButtonText}>Adicionar Carro</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    padding: Spacing.md,
  },
  carCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.background,
  },
  carContent: {
    padding: Spacing.md,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  carTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  carTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  carSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  carPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  carDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  carActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  editButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  editButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  deleteButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.surface,
  },
  deleteButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  viewButton: {
    borderColor: Colors.info,
    backgroundColor: Colors.surface,
  },
  viewButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.info,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
});