import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

interface FilterChip {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface FilterBarProps {
  filters: FilterChip[];
  selectedFilters: string[];
  onFilterPress: (id: string) => void;
}

export default function FilterBar({ filters, selectedFilters, onFilterPress }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => onFilterPress(filter.id)}
              activeOpacity={0.7}
            >
              {filter.icon && (
                <Ionicons 
                  name={filter.icon} 
                  size={16} 
                  color={isSelected ? Colors.surface : Colors.textSecondary} 
                  style={styles.chipIcon}
                />
              )}
              <Text style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
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
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  chipTextSelected: {
    color: Colors.surface,
  },
});