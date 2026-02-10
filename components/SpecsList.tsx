import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import { Car } from '../types';

interface SpecsListProps {
  car: Car;
}

export default function SpecsList({ car }: SpecsListProps) {
  const specs = [
    {
      icon: 'calendar-outline' as const,
      label: 'Ano',
      value: car.ano.toString(),
    },
    {
      icon: 'speedometer-outline' as const,
      label: 'Quilometragem',
      value: `${(car.quilometragem / 1000).toFixed(0)}mil km`,
    },
    {
      icon: 'water-outline' as const,
      label: 'Combustível',
      value: car.combustivel,
    },
    {
      icon: 'settings-outline' as const,
      label: 'Câmbio',
      value: car.transmissao,
    },
    {
      icon: 'color-palette-outline' as const,
      label: 'Cor',
      value: car.cor,
    },
    {
      icon: 'car-outline' as const,
      label: 'Portas',
      value: car.portas.toString(),
    },
    {
      icon: 'layers-outline' as const,
      label: 'Categoria',
      value: car.categoria,
    },
    {
      icon: 'location-outline' as const,
      label: 'Localização',
      value: `${car.cidade}, ${car.estado}`,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Especificações</Text>
      
      <View style={styles.specsGrid}>
        {specs.map((spec, index) => (
          <View key={index} style={styles.specItem}>
            <View style={styles.specIconContainer}>
              <Ionicons name={spec.icon} size={20} color={Colors.primary} />
            </View>
            <View style={styles.specTextContainer}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Opcionais */}
      {car.opcionais && car.opcionais.length > 0 && (
        <View style={styles.optionalsSection}>
          <Text style={styles.title}>Opcionais</Text>
          <View style={styles.optionalsGrid}>
            {car.opcionais.map((opcional, index) => (
              <View key={index} style={styles.optionalItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.optionalText}>{opcional}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  specsGrid: {
    gap: Spacing.sm,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  specIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  specTextContainer: {
    flex: 1,
  },
  specLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  specValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  optionalsSection: {
    marginTop: Spacing.lg,
  },
  optionalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  optionalText: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
});