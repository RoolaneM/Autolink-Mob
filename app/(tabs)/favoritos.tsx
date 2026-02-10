import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarCard from '../../components/CarCard';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import useCarStore from '../../store/useCarStore';

export default function FavoritosScreen() {
  const router = useRouter();
  const { getFavoritos, toggleFavorito, isFavorito } = useCarStore();
  
  const carrosFavoritos = getFavoritos();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {carrosFavoritos.length} {carrosFavoritos.length === 1 ? 'carro salvo' : 'carros salvos'}
        </Text>
      </View>

      {/* Lista de Favoritos */}
      <FlatList
        data={carrosFavoritos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
            <Ionicons name="heart-outline" size={80} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
            <Text style={styles.emptySubtext}>
              Comece a adicionar carros aos seus favoritos{'\n'}
              tocando no ícone de coração
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
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 3,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});