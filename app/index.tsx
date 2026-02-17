import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function LoadingScreen() {
    const { isLoading, isAuthenticated, user } = useAuth();

    // Animações
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]).start(() => {

                    // 🔵 PRIMEIRA VEZ
                    if (!user) {
                        router.replace('/(tabs)/welcome');
                        return;
                    }

                    // 🟡 Precisa biometria
                    if (!isAuthenticated) {
                        router.replace('/(auth)/auth-lock');
                        return;
                    }

                    // 🟢 AUTENTICADO → REDIRECIONAR POR ROLE
                    switch (user.role) {
                        case 'ADMIN':
                            router.replace('/(admin)/(tabs)');
                            break;

                        case 'STAND':
                            router.replace('/(vendedorstand)/(tabs)');
                            break;

                        case 'VENDEDOR':
                            router.replace('/(vendedorinformal)/(tabs)');
                            break;

                        case 'USER':
                        default:
                            router.replace('/(tabs)/welcome');
                            break;
                    }

                });
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [isLoading, isAuthenticated, user]);


    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={
                (Colors.gradientPrimary.length >= 2
                    ? Colors.gradientPrimary
                    : ['#000000', '#FFFFFF']) as unknown as readonly [
                        string,
                        string,
                        ...string[]
                    ]
            }
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            transform: [{ rotate: spin }],
                        },
                    ]}
                >
                    <View style={styles.logoCircle}>
                        <Ionicons name="car-sport" size={64} color={Colors.surface} />
                    </View>
                </Animated.View>

                <Text style={styles.appName}>AutoLinkMZ</Text>
                <Text style={styles.tagline}>
                    Conectando você ao carro dos seus sonhos
                </Text>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.surface} />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={styles.footerText}>Versão 1.0.0</Text>
                <Text style={styles.footerCopyright}>© 2026 AutoLinkMZ</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: Spacing.xl,
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        elevation: 8,
    },
    appName: {
        fontSize: FontSize.xxxl + 8,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        marginBottom: Spacing.xs,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: Spacing.xxl,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    loadingText: {
        fontSize: FontSize.sm,
        color: Colors.surface,
        marginTop: Spacing.md,
        fontWeight: FontWeight.medium,
    },
    footer: {
        position: 'absolute',
        bottom: Spacing.xxl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: Spacing.xs,
    },
    footerCopyright: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.6)',
    },
});
