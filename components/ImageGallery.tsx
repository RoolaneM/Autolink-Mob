import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <View style={styles.container}>
      {/* Imagem Principal */}
      <View style={styles.mainImageContainer}>
        <Image 
          source={{ uri: images[currentIndex] }} 
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Navegação */}
        {images.length > 1 && (
          <>
            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonLeft]}
              onPress={handlePrevious}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.surface} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonRight]}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={24} color={Colors.surface} />
            </TouchableOpacity>

            {/* Contador */}
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {images.length}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Thumbnails */}
      {images.length > 1 && (
        <View style={styles.thumbnailsContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                index === currentIndex && styles.thumbnailActive,
              ]}
              onPress={() => setCurrentIndex(index)}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: image }} 
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
  },
  mainImageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
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
  counter: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  counterText: {
    color: Colors.surface,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
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
});