import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
  trend?: string; // ex: "+12%" ou "-5%"
  onPress?: () => void;
}

export default function StatCard({
  icon,
  value,
  label,
  color = Colors.primary,
  trend,
  onPress,
}: StatCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.startsWith('-') ? 'trending-down' : 'trending-up';
  };

  const getTrendColor = () => {
    if (!trend) return Colors.textSecondary;
    return trend.startsWith('-') ? Colors.error : Colors.success;
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!onPress}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Icon with gradient background */}
          <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
            <View style={[styles.iconInner, { backgroundColor: `${color}25` }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
          </View>

          {/* Value */}
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            {trend && (
              <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}15` }]}>
                <Ionicons name={getTrendIcon()!} size={12} color={getTrendColor()} />
                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                  {trend}
                </Text>
              </View>
            )}
          </View>

          {/* Label */}
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>

          {/* Bottom accent */}
          <View style={[styles.accent, { backgroundColor: color }]} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  trendText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
});