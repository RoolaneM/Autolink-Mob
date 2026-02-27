import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { user, logout, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (isLoading || !user) {
    return null;
  }

  const menuItems = [
    {
      id: '1',
      icon: 'person-outline' as const,
      title: 'Meus Dados',
      subtitle: 'Nome, email e telefone',
      color: Colors.primary,
      onPress: () => router.push('/perfil/meusdados'),
    },
    {
      id: '2',
      icon: 'heart-outline' as const,
      title: 'Favoritos',
      subtitle: '5 carros salvos',
      color: Colors.error,
      onPress: () => router.push('/favoritos'),
    },
    {
      id: '3',
      icon: 'time-outline' as const,
      title: 'Histórico',
      subtitle: '15 carros visualizados',
      color: Colors.warning,
      onPress: () => router.push('/perfil/historico'),
    },
    {
      id: '4',
      icon: 'notifications-outline' as const,
      title: 'Notificações',
      subtitle: 'Gerencie suas preferências',
      color: Colors.info,
      onPress: () => router.push('/perfil/notificacoes'),
    },
    {
      id: '5',
      icon: 'help-circle-outline' as const,
      title: 'Ajuda e Suporte',
      subtitle: 'Central de ajuda',
      color: Colors.success,
      onPress: () => router.push('/ajuda'),
    },
    {
      id: '6',
      icon: 'information-circle-outline' as const,
      title: 'Sobre o App',
      subtitle: 'Versão 1.0.0',
      color: Colors.secondary,
      onPress: () => router.push('/sobre'),
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              }
            ]}
          >
            {/* Avatar com animação */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user?.name || 'U')}</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={Colors.surface} />
              </TouchableOpacity>
              
              {/* Badge de verificado */}
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              </View>
            </View>

            <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email ?? ''}</Text>

            {/* Botão Editar Perfil */}
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => router.push('/perfil/meusdados')}
            >
              <Ionicons name="create-outline" size={18} color={Colors.surface} />
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* Estatísticas com Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} activeOpacity={0.7}>
            <View style={[styles.statIconContainer, { backgroundColor: `${Colors.error}20` }]}>
              <Ionicons name="heart" size={24} color={Colors.error} />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} activeOpacity={0.7}>
            <View style={[styles.statIconContainer, { backgroundColor: `${Colors.info}20` }]}>
              <Ionicons name="eye" size={24} color={Colors.info} />
            </View>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Visualizados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} activeOpacity={0.7}>
            <View style={[styles.statIconContainer, { backgroundColor: `${Colors.warning}20` }]}>
              <Ionicons name="car-sport" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Test Drives</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items com animação */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 50],
                  })
                }]
              }}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

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
          <Text style={styles.footerText}>AutoLink MZ</Text>
          <Text style={styles.footerVersion}>Versão 1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2026 Todos os direitos reservados</Text>
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
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  userName: {
    fontSize: FontSize.xxl + 2,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSize.md,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.lg,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editProfileText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
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
  menuIconContainer: {
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    marginTop: Spacing.lg,
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
    paddingHorizontal: Spacing.md,
  },
  footerText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  footerVersion: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  footerCopyright: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
});