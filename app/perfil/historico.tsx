import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { CARROS_MOCK } from '../../constants/data';

interface HistoricoItem {
  id: string;
  carId: string;
  viewedAt: Date;
}

// Mock de histórico
const MOCK_HISTORICO: HistoricoItem[] = CARROS_MOCK.slice(0, 6).map((car, index) => ({
  id: `hist-${car.id}`,
  carId: car.id,
  viewedAt: new Date(Date.now() - index * 3600000 * 24), // últimos dias
}));

export default function HistoricoScreen() {
  const router = useRouter();

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' });
    }
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
    });

  const renderItem = ({ item }: { item: HistoricoItem }) => {
    const car = CARROS_MOCK.find((c) => c.id === item.carId);
    if (!car) return null;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(`/detalhes/${car.id}`)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: car.imagemPrincipal }} style={styles.carImage} />

        <View style={styles.carInfo}>
          <Text style={styles.carName} numberOfLines={1}>
            {car.marca} {car.modelo}
          </Text>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{car.ano}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {(car.quilometragem / 1000).toFixed(0)}k km
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(car.preco)}</Text>
            <View style={styles.viewedBadge}>
              <Ionicons name="eye-outline" size={12} color={Colors.primary} />
              <Text style={styles.viewedText}>{formatDate(item.viewedAt)}</Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons name="time-outline" size={32} color={Colors.primary} />
          <View style={styles.headerTexts}>
            <Text style={styles.headerTitle}>Histórico de Visualizações</Text>
            <Text style={styles.headerSubtitle}>
              {MOCK_HISTORICO.length}{' '}
              {MOCK_HISTORICO.length === 1 ? 'carro visualizado' : 'carros visualizados'}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={MOCK_HISTORICO}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="eye-off-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhum histórico ainda</Text>
            <Text style={styles.emptySubtext}>
              Os carros que você visualizar aparecerão aqui
            </Text>
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
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  carImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  viewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  viewedText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
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
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
