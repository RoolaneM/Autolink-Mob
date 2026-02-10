import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import { CATEGORIAS, COMBUSTIVEIS, CORES, MARCAS, TRANSMISSOES } from '../constants/data';
import useCarStore from '../store/useCarStore';
import { FilterOptions } from '../types';

export default function FiltrosScreen() {
  const router = useRouter();
  const { filtros, setFiltros } = useCarStore();

  const [localFiltros, setLocalFiltros] = useState<FilterOptions>(filtros);

  const handleApplyFilters = () => {
    setFiltros(localFiltros);
    router.back();
  };

  const handleResetFilters = () => {
    setLocalFiltros({});
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    setLocalFiltros((prev) => {
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray.length > 0 ? newArray : undefined };
    });
  };

  const isSelected = (key: keyof FilterOptions, value: string) => {
    const array = (localFiltros[key] as string[]) || [];
    return array.includes(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtros</Text>
        <TouchableOpacity onPress={handleResetFilters}>
          <Text style={styles.resetText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Faixa de Preço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faixa de Preço (MZN)</Text>
          <View style={styles.priceInputs}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.inputLabel}>Mínimo</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                keyboardType="numeric"
                value={localFiltros.precoMin?.toString() || ''}
                onChangeText={(text) =>
                  setLocalFiltros((prev) => ({
                    ...prev,
                    precoMin: text ? parseInt(text) : undefined,
                  }))
                }
              />
            </View>
            <Text style={styles.priceSeparator}>até</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.inputLabel}>Máximo</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Sem limite"
                keyboardType="numeric"
                value={localFiltros.precoMax?.toString() || ''}
                onChangeText={(text) =>
                  setLocalFiltros((prev) => ({
                    ...prev,
                    precoMax: text ? parseInt(text) : undefined,
                  }))
                }
              />
            </View>
          </View>
        </View>

        {/* Ano */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ano do Veículo</Text>
          <View style={styles.priceInputs}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.inputLabel}>De</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="2000"
                keyboardType="numeric"
                maxLength={4}
                value={localFiltros.anoMin?.toString() || ''}
                onChangeText={(text) =>
                  setLocalFiltros((prev) => ({
                    ...prev,
                    anoMin: text ? parseInt(text) : undefined,
                  }))
                }
              />
            </View>
            <Text style={styles.priceSeparator}>até</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.inputLabel}>Até</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="2024"
                keyboardType="numeric"
                maxLength={4}
                value={localFiltros.anoMax?.toString() || ''}
                onChangeText={(text) =>
                  setLocalFiltros((prev) => ({
                    ...prev,
                    anoMax: text ? parseInt(text) : undefined,
                  }))
                }
              />
            </View>
          </View>
        </View>

        {/* Quilometragem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quilometragem Máxima (km)</Text>
          <TextInput
            style={styles.fullInput}
            placeholder="Ex: 50000"
            keyboardType="numeric"
            value={localFiltros.quilometragemMax?.toString() || ''}
            onChangeText={(text) =>
              setLocalFiltros((prev) => ({
                ...prev,
                quilometragemMax: text ? parseInt(text) : undefined,
              }))
            }
          />
        </View>

        {/* Marca */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marca</Text>
          <View style={styles.chipsContainer}>
            {MARCAS.map((marca) => (
              <TouchableOpacity
                key={marca}
                style={[
                  styles.chip,
                  isSelected('marca', marca) && styles.chipSelected,
                ]}
                onPress={() => toggleArrayFilter('marca', marca)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected('marca', marca) && styles.chipTextSelected,
                  ]}
                >
                  {marca}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoria</Text>
          <View style={styles.chipsContainer}>
            {CATEGORIAS.map((categoria) => (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.chip,
                  isSelected('categoria', categoria) && styles.chipSelected,
                ]}
                onPress={() => toggleArrayFilter('categoria', categoria)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected('categoria', categoria) && styles.chipTextSelected,
                  ]}
                >
                  {categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Combustível */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combustível</Text>
          <View style={styles.chipsContainer}>
            {COMBUSTIVEIS.map((combustivel) => (
              <TouchableOpacity
                key={combustivel}
                style={[
                  styles.chip,
                  isSelected('combustivel', combustivel) && styles.chipSelected,
                ]}
                onPress={() => toggleArrayFilter('combustivel', combustivel)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected('combustivel', combustivel) && styles.chipTextSelected,
                  ]}
                >
                  {combustivel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transmissão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transmissão</Text>
          <View style={styles.chipsContainer}>
            {TRANSMISSOES.map((transmissao) => (
              <TouchableOpacity
                key={transmissao}
                style={[
                  styles.chip,
                  isSelected('transmissao', transmissao) && styles.chipSelected,
                ]}
                onPress={() => toggleArrayFilter('transmissao', transmissao)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected('transmissao', transmissao) && styles.chipTextSelected,
                  ]}
                >
                  {transmissao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cor</Text>
          <View style={styles.chipsContainer}>
            {CORES.map((cor) => (
              <TouchableOpacity
                key={cor}
                style={[
                  styles.chip,
                  isSelected('cor', cor) && styles.chipSelected,
                ]}
                onPress={() => toggleArrayFilter('cor', cor)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected('cor', cor) && styles.chipTextSelected,
                  ]}
                >
                  {cor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
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
  resetText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  section: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  priceInputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  priceInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceSeparator: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 20,
  },
  fullInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  chipTextSelected: {
    color: Colors.surface,
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});