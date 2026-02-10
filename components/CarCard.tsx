import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import { Car } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (Spacing.md * 2);

interface CarCardProps {
  car: Car;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite?: boolean;
}

export default function CarCard({ car, onPress, onFavoritePress, isFavorite = false }: CarCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
    });
  };


  const formatKm = (km: number) => {
    return `${(km / 1000).toFixed(0)}mil km`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Imagem */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: car.imagemPrincipal }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badge de Destaque */}
        {car.destaque && (
          <View style={styles.badgeDestaque}>
            <Ionicons name="star" size={12} color="#FFF" />
            <Text style={styles.badgeText}>Destaque</Text>
          </View>
        )}

        {/* Botão de Favorito */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? Colors.favorite : "#FFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Informações */}
      <View style={styles.infoContainer}>
        {/* Título */}
        <Text style={styles.title} numberOfLines={1}>
          {car.marca} {car.modelo}
        </Text>

        {/* Ano/KM */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{car.ano}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{formatKm(car.quilometragem)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{car.combustivel}</Text>
          </View>
        </View>

        {/* Localização */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{car.cidade}, {car.estado}</Text>
        </View>

        {/* Preço */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(car.preco)}</Text>
          <View style={styles.transmissionBadge}>
            <Text style={styles.transmissionText}>{car.transmissao}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeDestaque: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  locationText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  transmissionBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  transmissionText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});