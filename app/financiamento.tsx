import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import useCarStore from '../store/useCarStore';

export default function FinanciamentoScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams();
  const { getCarById } = useCarStore();

  const car = carId ? getCarById(carId as string) : null;
  const valorCarro = car?.preco || 100000;

  const [entrada, setEntrada] = useState(valorCarro * 0.2); // 20% padrão
  const [numeroParcelas, setNumeroParcelas] = useState(48);
  const [taxaJuros, setTaxaJuros] = useState(1.5); // 1.5% a.m.

  const calcularFinanciamento = () => {
    const valorFinanciado = valorCarro - entrada;
    const taxaMensal = taxaJuros / 100;
    const coeficiente =
      (taxaMensal * Math.pow(1 + taxaMensal, numeroParcelas)) /
      (Math.pow(1 + taxaMensal, numeroParcelas) - 1);
    const valorParcela = valorFinanciado * coeficiente;
    const valorTotal = entrada + valorParcela * numeroParcelas;

    return {
      valorFinanciado,
      valorParcela,
      valorTotal,
      jurosTotal: valorTotal - valorCarro,
    };
  };

  const resultado = calcularFinanciamento();

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
    });

  const opcoesEntrada = [10, 20, 30, 40, 50];
  const opcoesParcelas = [12, 24, 36, 48, 60];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simular Financiamento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informações do Carro */}
        {car && (
          <View style={styles.carInfo}>
            <Ionicons name="car-sport" size={32} color={Colors.primary} />
            <View style={styles.carInfoText}>
              <Text style={styles.carInfoTitle}>
                {car.marca} {car.modelo}
              </Text>
              <Text style={styles.carInfoPrice}>{formatCurrency(valorCarro)}</Text>
            </View>
          </View>
        )}

        {/* Entrada */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Valor da Entrada</Text>
            <Text style={styles.sectionValue}>{formatCurrency(entrada)}</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={valorCarro * 0.8}
            value={entrada}
            onValueChange={setEntrada}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />

          <View style={styles.percentageButtons}>
            {opcoesEntrada.map((percent) => (
              <TouchableOpacity
                key={percent}
                style={[
                  styles.percentButton,
                  Math.abs(entrada - (valorCarro * percent) / 100) < 1000 &&
                    styles.percentButtonActive,
                ]}
                onPress={() => setEntrada((valorCarro * percent) / 100)}
              >
                <Text
                  style={[
                    styles.percentButtonText,
                    Math.abs(entrada - (valorCarro * percent) / 100) < 1000 &&
                      styles.percentButtonTextActive,
                  ]}
                >
                  {percent}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Número de Parcelas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Número de Parcelas</Text>
            <Text style={styles.sectionValue}>{numeroParcelas}x</Text>
          </View>

          <View style={styles.parcelasButtons}>
            {opcoesParcelas.map((parcelas) => (
              <TouchableOpacity
                key={parcelas}
                style={[
                  styles.parcelaButton,
                  numeroParcelas === parcelas && styles.parcelaButtonActive,
                ]}
                onPress={() => setNumeroParcelas(parcelas)}
              >
                <Text
                  style={[
                    styles.parcelaButtonText,
                    numeroParcelas === parcelas && styles.parcelaButtonTextActive,
                  ]}
                >
                  {parcelas}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Taxa de Juros */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Taxa de Juros (a.m.)</Text>
            <Text style={styles.sectionValue}>{taxaJuros.toFixed(2)}%</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={3.5}
            step={0.1}
            value={taxaJuros}
            onValueChange={setTaxaJuros}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0.5%</Text>
            <Text style={styles.sliderLabel}>3.5%</Text>
          </View>
        </View>

        {/* Resultado */}
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Resumo do Financiamento</Text>

          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor do Veículo</Text>
              <Text style={styles.resultValue}>{formatCurrency(valorCarro)}</Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Entrada</Text>
              <Text style={styles.resultValue}>{formatCurrency(entrada)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor Financiado</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(resultado.valorFinanciado)}
              </Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.resultRowHighlight}>
              <Text style={styles.resultLabelHighlight}>Valor da Parcela</Text>
              <Text style={styles.resultValueHighlight}>
                {formatCurrency(resultado.valorParcela)}
              </Text>
            </View>

            <View style={styles.resultRowSubtitle}>
              <Text style={styles.resultSubtitle}>
                {numeroParcelas}x de {formatCurrency(resultado.valorParcela)}
              </Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total de Juros</Text>
              <Text style={[styles.resultValue, { color: Colors.warning }]}>
                {formatCurrency(resultado.jurosTotal)}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor Total</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(resultado.valorTotal)}
              </Text>
            </View>
          </View>

          {/* Aviso */}
          <View style={styles.warningBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.warning} />
            <Text style={styles.warningText}>
              Esta é apenas uma simulação. Os valores reais podem variar de acordo com a
              instituição financeira e análise de crédito.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="chatbubbles" size={20} color={Colors.surface} />
          <Text style={styles.contactButtonText}>Falar com Vendedor</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  carInfoText: {
    flex: 1,
  },
  carInfoTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  carInfoPrice: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  section: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  sectionValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  sliderLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  percentageButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  percentButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  percentButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  percentButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  percentButtonTextActive: {
    color: Colors.surface,
  },
  parcelasButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  parcelaButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  parcelaButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  parcelaButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  parcelaButtonTextActive: {
    color: Colors.surface,
  },
  resultSection: {
    padding: Spacing.md,
  },
  resultTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  resultCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  resultLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  resultRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
  },
  resultLabelHighlight: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  resultValueHighlight: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  resultRowSubtitle: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  resultSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  resultDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  contactButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});