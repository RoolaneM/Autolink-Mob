import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarCard from '../../components/CarCard';
import FilterBar from '../../components/FilterBar';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { CATEGORIAS } from '../../constants/data';
import useCarStore from '../../store/useCarStore';

export default function HomeScreen() {
  const router = useRouter();
  const { carros, loadCarros, toggleFavorito, isFavorito } = useCarStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Carrega carros da API ao montar
  useEffect(() => {
    loadCarros();
  }, []);

  const categoryFilters = CATEGORIAS.map(cat => ({
    id: cat,
    label: cat,
    icon: getCategoryIcon(cat),
  }));

  function getCategoryIcon(categoria: string): keyof typeof Ionicons.glyphMap {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      'Sedan': 'car-outline',
      'SUV': 'car-sport-outline',
      'Hatch': 'car-outline',
      'Pickup': 'git-compare-outline',
      'Esportivo': 'flash-outline',
      'Minivan': 'bus-outline',
    };
    return icons[categoria] || 'car-outline';
  }

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Aplica filtro por categoria usando o estado local
  const carrosFiltrados = selectedCategories.length > 0
    ? carros.filter(car => selectedCategories.includes(car.categoria))
    : carros;

  const carrosDestaque = carrosFiltrados.filter(car => car.destaque);
  const carrosRecentes = carrosFiltrados.filter(car => !car.destaque);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={
          (Colors.gradientPrimary.length >= 2
            ? Colors.gradientPrimary
            : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
        }
        style={styles.header}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>AutoLink MZ</Text>
            </View>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => router.push('/mensagem/chat')}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Filtros de Categoria */}
      <FilterBar
        filters={categoryFilters}
        selectedFilters={selectedCategories}
        onFilterPress={handleCategoryFilter}
      />

      {/* Lista de Carros */}
      <FlatList
        data={carrosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {carrosDestaque.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Em Destaque</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => router.push(`./detalhes/${item.id}`)}
            onFavoritePress={() => toggleFavorito(item.id)}
            isFavorite={isFavorito(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhum carro encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente ajustar os filtros
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
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  messageButton: {
    padding: 8,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
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
  },
});
