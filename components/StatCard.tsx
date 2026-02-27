import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
  trend?: string;
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
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
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
        styles.container,
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
              borderLeftColor: color,
            },
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={20} color={color} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Value & Trend */}
            <View style={styles.valueRow}>
              <Text style={styles.value}>{value}</Text>
              {trend && (
                <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}15` }]}>
                  <Ionicons name={getTrendIcon()!} size={10} color={getTrendColor()} />
                  <Text style={[styles.trendText, { color: getTrendColor() }]}>
                    {trend}
                  </Text>
                </View>
              )}
            </View>

            {/* Label */}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '47%',
    maxWidth: '50%',
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  trendText: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
});