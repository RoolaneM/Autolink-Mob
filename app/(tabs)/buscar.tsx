import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarCard from '../../components/CarCard';
import SearchBar from '../../components/SearchBar';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import useCarStore from '../../store/useCarStore';

export default function BuscarScreen() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    getCarrosFiltrados,
    toggleFavorito,
    isFavorito,
    filtros,
  } = useCarStore();

  const [sortBy, setSortBy] = useState<'relevancia' | 'menor-preco' | 'maior-preco' | 'mais-novo'>('relevancia');

  const carrosFiltrados = getCarrosFiltrados();

  // Ordenação
  const carrosOrdenados = [...carrosFiltrados].sort((a, b) => {
    switch (sortBy) {
      case 'menor-preco':
        return a.preco - b.preco;
      case 'maior-preco':
        return b.preco - a.preco;
      case 'mais-novo':
        return b.ano - a.ano;
      default:
        return 0;
    }
  });

  const filtrosAtivos = Object.keys(filtros).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Carros</Text>
      </View>

      {/* Barra de Busca */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => router.push('/filtros')}
      />

      {/* Filtros Ativos e Ordenação */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => router.push('/filtros')}
        >
          <Ionicons name="options-outline" size={16} color={Colors.primary} />
          <Text style={styles.filterChipText}>
            Filtros {filtrosAtivos > 0 && `(${filtrosAtivos})`}
          </Text>
        </TouchableOpacity>

        <View style={styles.sortContainer}>
          <Ionicons name="swap-vertical-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.sortLabel}>Ordenar:</Text>
          <TouchableOpacity onPress={() => {
            const options: Array<typeof sortBy> = ['relevancia', 'menor-preco', 'maior-preco', 'mais-novo'];
            const currentIndex = options.indexOf(sortBy);
            setSortBy(options[(currentIndex + 1) % options.length]);
          }}>
            <Text style={styles.sortValue}>
              {sortBy === 'relevancia' && 'Relevância'}
              {sortBy === 'menor-preco' && 'Menor Preço'}
              {sortBy === 'maior-preco' && 'Maior Preço'}
              {sortBy === 'mais-novo' && 'Mais Novo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {carrosOrdenados.length} {carrosOrdenados.length === 1 ? 'carro encontrado' : 'carros encontrados'}
        </Text>
      </View>

      {/* Lista de Carros */}
      <FlatList
        data={carrosOrdenados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => router.push(`/detalhes/${item.id}`)}
            onFavoritePress={() => toggleFavorito(item.id)}
            isFavorite={isFavorito(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Nenhum resultado encontrado' : 'Comece sua busca'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Tente ajustar sua busca ou filtros'
                : 'Digite uma marca ou modelo acima'}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  sortValue: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  resultsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
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
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});