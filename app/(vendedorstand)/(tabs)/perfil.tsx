import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatCard from '../../../components/StatCard';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

interface StandProfile {
  nomeStand: string;
  nuit: string;
  endereco: string;
  contacto: string;
  identidadeVerificada: boolean;
  totalCarros: number;
  carrosAtivos: number;
  totalVendas: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
}

export default function PerfilStandScreen() {
  const { user, logout, isLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [standData, setStandData] = useState<StandProfile>({
    nomeStand: 'Auto Stand Premium',
    nuit: '123456789',
    endereco: 'Av. Julius Nyerere, Maputo',
    contacto: '+258 84 123 4567',
    identidadeVerificada: true,
    totalCarros: 24,
    carrosAtivos: 18,
    totalVendas: 47,
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 156,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Carregar dados da API
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading || !user) {
    return null;
  }

  const menuSections = [
    {
      title: 'Gestão do Stand',
      items: [
        {
          id: '1',
          icon: 'business-outline' as const,
          title: 'Dados do Stand',
          subtitle: 'NUIT, Endereço, Contacto',
          color: Colors.primary,
          onPress: () => router.push('/(vendedorstand)/paginas/meuperfil'),
        },
        {
          id: '2',
          icon: 'car-sport-outline' as const,
          title: 'Meus Carros',
          subtitle: `${standData.carrosAtivos} ativos`,
          color: Colors.success,
          onPress: () => router.push('/(vendedorstand)/(tabs)/anuncios'),
        },
        {
          id: '3',
          icon: 'add-circle-outline' as const,
          title: 'Publicar Carro',
          subtitle: 'Novo anúncio',
          color: Colors.info,
          onPress: () => router.push('/(vendedorstand)/(tabs)/adicionar'),
        },
        {
          id: '4',
          icon: 'cash-outline' as const,
          title: 'Financeiro',
          subtitle: 'Vendas e comissões',
          color: Colors.warning,
          onPress: () => router.push('/(vendedorstand)/(tabs)/financeiro'),
        },
        {
          id: '',
          icon: 'card-outline' as const,
          title: 'Subscrição',
          subtitle: 'Plano e pagamentos',
          color: Colors.warning,
          onPress: () => router.push('/(vendedorstand)/paginas/checkout'),
        },
      ],
    },
    {
      title: 'Comunicação',
      items: [
        {
          id: '5',
          icon: 'chatbubbles-outline' as const,
          title: 'Mensagens',
          subtitle: '3 novas conversas',
          color: Colors.secondary,
          badge: 3,
          onPress: () => router.push('/(vendedorstand)/paginas/mensagens'),
        },
        {
          id: '6',
          icon: 'notifications-outline' as const,
          title: 'Notificações',
          subtitle: 'Gerencie alertas',
          color: Colors.info,
          onPress: () => router.push('/(vendedorstand)/paginas/notificacoes'),
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          id: '7',
          icon: 'help-circle-outline' as const,
          title: 'Central de Ajuda',
          subtitle: 'FAQs e tutoriais',
          color: Colors.success,
          onPress: () => router.push('/ajuda'),
        },
        {
          id: '8',
          icon: 'settings-outline' as const,
          title: 'Configurações',
          subtitle: 'Preferências do stand',
          color: Colors.textSecondary,
          onPress: () => router.push('/stand/configuracoes'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Header com Gradiente */}
        <LinearGradient
          colors={
            (Colors.gradientPrimary.length >= 2
              ? Colors.gradientPrimary
              : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
          }
          style={styles.header}
        >
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo do Stand */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="business" size={48} color={Colors.surface} />
              </View>

              {/* Badge de Verificado */}
              {standData.identidadeVerificada && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
                </View>
              )}
            </View>

            {/* Nome do Stand */}
            <Text style={styles.standName}>{standData.nomeStand}</Text>

            {/* Status */}
            <View style={styles.statusBadge}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
              <Text style={styles.statusText}>Stand Verificado</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {standData.avaliacaoMedia.toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({standData.totalAvaliacoes} avaliações)
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="car-sport"
            value={standData.carrosAtivos.toString()}
            label="Carros Ativos"
            color={Colors.primary}
            trend="+5%"
          />
          <StatCard
            icon="cart"
            value={standData.totalVendas.toString()}
            label="Total Vendas"
            color={Colors.success}
            trend="+12%"
          />
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações do Stand</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>NUIT</Text>
                <Text style={styles.infoValue}>{standData.nuit}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoValue}>{standData.endereco}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Contacto</Text>
                <Text style={styles.infoValue}>{standData.contacto}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <Animated.View
                key={item.id}
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>

                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>

                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}

                  <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            router.push('/login');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>AutoLink MZ - Área do Stand</Text>
          <Text style={styles.footerVersion}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl + 10,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  standName: {
    fontSize: FontSize.xxl + 4,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  ratingCount: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  infoSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  menuSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.error,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  footerVersion: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
});