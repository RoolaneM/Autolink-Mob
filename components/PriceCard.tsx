import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

interface PriceCardProps {
  preco: number;
  onSimularFinanciamento?: () => void;
  onAgendarTestDrive?: () => void;
  onContatar?: () => void;
}

export default function PriceCard({
  preco,
  onSimularFinanciamento,
  onAgendarTestDrive,
  onContatar,
}: PriceCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
    });
  };


  const calcularParcela = (valor: number) => {
    // Simulação simples: 48x com taxa de 1.5% a.m.
    const taxa = 0.015;
    const parcelas = 48;
    const parcelaSimples = (valor * taxa * Math.pow(1 + taxa, parcelas)) /
      (Math.pow(1 + taxa, parcelas) - 1);
    return parcelaSimples;
  };

  return (
    <View style={styles.container}>
      {/* Preço Principal */}
      <View style={styles.priceSection}>
        <Text style={styles.label}>Preço à vista</Text>
        <Text style={styles.price}>{formatPrice(preco)}</Text>
      </View>

      {/* Simulação de Parcela */}
      <TouchableOpacity
        style={styles.financingInfo}
        onPress={onSimularFinanciamento}
        activeOpacity={0.7}
      >
        <View style={styles.financingText}>
          <Text style={styles.financingLabel}>Ou em até 48x de</Text>
          <Text style={styles.financingValue}>
            {formatPrice(calcularParcela(preco))}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
      </TouchableOpacity>

      {/* Botões de Ação */}
      <View style={styles.buttonsContainer}>
        {onAgendarTestDrive && (
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={onAgendarTestDrive}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.buttonSecondaryText}>Test Drive</Text>
          </TouchableOpacity>
        )}

        {onContatar && (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onContatar}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-whatsapp" size={20} color={Colors.surface} />
            <Text style={styles.buttonPrimaryText}>Contatar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
  },
  priceSection: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  financingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  financingText: {
    flex: 1,
  },
  financingLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  financingValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  buttonSecondaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  buttonPrimary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
  },
  buttonPrimaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
});