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

  // ✅ IMPLEMENTADO
  const handleMarkAsSold = (carId: string, marca: string, modelo: string) => {
    Alert.alert(
      'Marcar como Vendido',
      `Confirma que ${marca} ${modelo} foi vendido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Venda',
          style: 'default',
          onPress: async () => {
            try {
              await CarService.markAsSold(carId); // ✅ IMPLEMENTADO
              Alert.alert('Sucesso', 'Carro marcado como vendido!');
              loadMyCars();
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error.response?.data?.message || 'Não foi possível marcar como vendido.'
              );
            }
          },
        },
      ]
    );
  };

  // ✅ IMPLEMENTADO
  const handleRelist = (carId: string, marca: string, modelo: string) => {
    Alert.alert(
      'Republicar Anúncio',
      `Deseja republicar ${marca} ${modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Republicar',
          style: 'default',
          onPress: async () => {
            try {
              await CarService.republishCar(carId); // ✅ IMPLEMENTADO
              Alert.alert('Sucesso', 'Carro republicado com sucesso!');
              loadMyCars();
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error.response?.data?.message || 'Não foi possível republicar.'
              );
            }
          },
        },
      ]
    );
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

  const renderItem = ({ item }: { item: Car }) => {
    const isSold = item.status === 'VENDIDO'; // ✅ AGORA FUNCIONA

    return (
      <View style={[styles.carCard, isSold && styles.carCardSold]}>
        {/* Imagem com Badge */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imagemPrincipal || undefined }}
            style={[styles.carImage, isSold && styles.carImageSold]}
            resizeMode="cover"
          />
          {isSold && (
            <View style={styles.soldBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.surface} />
              <Text style={styles.soldBadgeText}>VENDIDO</Text>
            </View>
          )}
        </View>

        <View style={styles.carContent}>
          {/* Header */}
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
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.carDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {(item.quilometragem / 1000).toFixed(0)}k km
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="eye-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{item.views || 0}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="chatbubbles-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{item.messages || 0}</Text>
            </View>
          </View>

          {/* Actions */}
          {!isSold ? (
            <View style={styles.carActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.soldButton]}
                onPress={() => handleMarkAsSold(item.id, item.marca, item.modelo)}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={styles.soldButtonText}>Vendido</Text>
              </TouchableOpacity>

  {/*             <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => router.push(`/(vendedorstand)/editar/${item.id}`)}
              >
                <Ionicons name="create-outline" size={16} color={Colors.primary} />
              </TouchableOpacity> */}

              <TouchableOpacity
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => router.push(`/detalhes/${item.id}`)}
              >
                <Ionicons name="eye-outline" size={16} color={Colors.info} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id, item.marca, item.modelo)}
              >
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.soldActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.relistButton]}
                onPress={() => handleRelist(item.id, item.marca, item.modelo)} // ✅ IMPLEMENTADO
              >
                <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
                <Text style={styles.relistButtonText}>Republicar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id, item.marca, item.modelo)}
              >
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

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
            {cars.length} {cars.length === 1 ? 'anúncio' : 'anúncios'}
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
            <Ionicons name="car-sport-outline" size={64} color={Colors.textLight} />
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
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.md,
  },
  carCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carCardSold: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: 180,
  },
  carImageSold: {
    opacity: 0.6,
  },
  soldBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  soldBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  carContent: {
    padding: Spacing.md,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  carTitleContainer: {
    flex: 1,
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
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  carActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  soldActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  soldButton: {
    backgroundColor: `${Colors.success}20`,
  },
  soldButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  editButton: {
    backgroundColor: `${Colors.primary}20`,
  },
  viewButton: {
    backgroundColor: `${Colors.info}20`,
  },
  deleteButton: {
    backgroundColor: `${Colors.error}20`,
  },
  relistButton: {
    backgroundColor: `${Colors.primary}20`,
    flex: 2,
  },
  relistButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  emptyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});