import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSize,
  FontWeight,
  Spacing,
} from '../constants/Colors';
import { Car } from '../types';

const { width } = Dimensions.get('window');

interface CarDetailsProps {
  car: Car;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export default function CarDetails({
  car,
  isFavorite = false,
  onFavoritePress,
}: CarDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 🔥 NORMALIZAÇÃO DEFINITIVA DAS IMAGENS
  const images = useMemo(() => {
    if (car.images && car.images.length > 0) {
      return car.images;
    }

    if (car.imagemPrincipal) {
      return [car.imagemPrincipal];
    }

    return [];
  }, [car]);

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
    });

  const formatKm = (km: number) => `${(km / 1000).toFixed(0)} mil km`;

  const handlePrevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Galeria */}
      <View style={styles.imageContainer}>
        {images.length > 0 ? (
          <Image
            source={{ uri: images[currentImageIndex] }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name="image-outline" size={60} color="#999" />
            <Text style={{ color: '#999' }}>Sem imagem disponível</Text>
          </View>
        )}

        {car.destaque && (
          <View style={styles.badgeDestaque}>
            <Ionicons name="star" size={14} color="#FFF" />
            <Text style={styles.badgeText}>Destaque</Text>
          </View>
        )}

        {onFavoritePress && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite ? Colors.favorite : '#FFF'}
            />
          </TouchableOpacity>
        )}

        {/* Navegação */}
        {images.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonLeft]}
              onPress={handlePrevImage}
            >
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.navButtonRight]}
              onPress={handleNextImage}
            >
              <Ionicons name="chevron-forward" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {images.length}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Thumbnails */}
      {images.length > 1 && (
        <View style={styles.thumbnailContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.thumbnail,
                  index === currentImageIndex &&
                  styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Cabeçalho com Categoria */}
        <View style={styles.categoryBadge}>
          <Ionicons name="car-sport-outline" size={16} color={Colors.primary} />
          <Text style={styles.categoryText}>{car.categoria}</Text>
        </View>

        <Text style={styles.title}>
          {car.marca} {car.modelo}
        </Text>

        <View style={styles.priceSection}>
          <View>
            <Text style={styles.priceLabel}>Preço</Text>
            <Text style={styles.price}>{formatPrice(car.preco)}</Text>
          </View>
          <View style={styles.transmissionBadge}>
            <Ionicons name="settings-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.transmissionText}>{car.transmissao}</Text>
          </View>
        </View>

        {/* Cards de Informações Principais */}
        <View style={styles.infoCardsContainer}>
          <InfoCard
            icon="calendar-outline"
            label="Ano"
            value={String(car.ano)}
          />
          <InfoCard
            icon="speedometer-outline"
            label="Quilometragem"
            value={formatKm(car.quilometragem)}
          />
          <InfoCard
            icon="water-outline"
            label="Combustível"
            value={car.combustivel}
          />
          <InfoCard
            icon="color-palette-outline"
            label="Cor"
            value={car.cor}
          />
        </View>

        {/* Especificações Técnicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
          <View style={styles.specsGrid}>
            <SpecRow icon="car-outline" label="Portas" value={`${car.portas} portas`} />
            <SpecRow icon="location-outline" label="Localização" value={`${car.cidade}, ${car.estado}`} />
          </View>
        </View>

        {/* Descrição */}
        {car.descricao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o Veículo</Text>
            <Text style={styles.description}>{car.descricao}</Text>
          </View>
        )}

        {/* Opcionais */}
        {car.opcionais && car.opcionais.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipamentos e Opcionais</Text>
            <View style={styles.optionalsGrid}>
              {car.opcionais.map((opcional, index) => (
                <View key={index} style={styles.optionalItem}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                  <Text style={styles.optionalText}>{opcional}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Informações do Vendedor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendedor</Text>
          <View style={styles.vendorCard}>
            <View style={styles.vendorAvatar}>
              <Ionicons name="person" size={28} color={Colors.primary} />
            </View>
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{car.vendedor.nome}</Text>
              <Text style={styles.vendorPhone}>{car.vendedor.telefone}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardIconContainer}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.infoCardLabel}>{label}</Text>
      <Text style={styles.infoCardValue}>{value}</Text>
    </View>
  );
}

function SpecRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.specRow}>
      <View style={styles.specRowLeft}>
        <Ionicons name={icon} size={18} color={Colors.textSecondary} />
        <Text style={styles.specRowLabel}>{label}</Text>
      </View>
      <Text style={styles.specRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    width,
    height: 300,
    position: 'relative',
  },
  noImage: {
    width: '100%',
    height: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
  },
  badgeDestaque: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonLeft: {
    left: Spacing.md,
  },
  navButtonRight: {
    right: Spacing.md,
  },
  imageCounter: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  thumbnailContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: Spacing.lg,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  priceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  transmissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  transmissionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  infoCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoCardLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  specsGrid: {
    gap: Spacing.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  specRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  specRowLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  specRowValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 24,
  },
  optionalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  optionalText: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  vendorAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  vendorPhone: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});