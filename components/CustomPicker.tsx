import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

interface PickerOption {
  id: number | string;
  nome: string;
  logo?: string;
}

interface CustomPickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onSelect: (option: PickerOption) => void;
  placeholder?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  searchable?: boolean;
}

export default function CustomPicker({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Selecione...',
  error,
  icon,
  searchable = false,
}: CustomPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt) => opt.nome === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.nome.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option: PickerOption) => {
    onSelect(option);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.pickerButton,
          error && styles.pickerButtonError,
          selectedOption && styles.pickerButtonSelected,
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={selectedOption ? Colors.primary : Colors.textSecondary}
            style={styles.iconLeft}
          />
        )}

        <Text
          style={[
            styles.pickerText,
            !selectedOption && styles.pickerPlaceholder,
          ]}
        >
          {selectedOption ? selectedOption.nome : placeholder}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color={Colors.textSecondary}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar..."
                  placeholderTextColor={Colors.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedOption?.id === item.id && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  {item.logo && (
                    <View style={styles.optionLogo}>
                      {/* Aqui você pode adicionar Image se tiver logos */}
                      <Ionicons
                        name="car-sport"
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                  )}

                  <Text
                    style={[
                      styles.optionText,
                      selectedOption?.id === item.id && styles.optionTextSelected,
                    ]}
                  >
                    {item.nome}
                  </Text>

                  {selectedOption?.id === item.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons
                    name="search-outline"
                    size={48}
                    color={Colors.textLight}
                  />
                  <Text style={styles.emptyText}>
                    Nenhuma opção encontrada
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.error,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 50,
  },
  pickerButtonError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  pickerButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  pickerText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  pickerPlaceholder: {
    color: Colors.textLight,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl * 2,
    borderTopRightRadius: BorderRadius.xl * 2,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  optionSelected: {
    backgroundColor: `${Colors.primary}10`,
  },
  optionLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});