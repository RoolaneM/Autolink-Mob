import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { BorderRadius, Colors } from '../constants/Colors';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  style?: any;
}

export default function FavoriteButton({
  isFavorite,
  onPress,
  size = 24,
  backgroundColor = 'rgba(0,0,0,0.35)',
  style,
}: FavoriteButtonProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animação de "pulso"
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={size}
          color={isFavorite ? Colors.favorite : '#FFF'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});