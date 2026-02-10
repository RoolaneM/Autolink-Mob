import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/Colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFilterPress,
  placeholder = "Buscar marca, modelo..."
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {onFilterPress && (
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
  },
});