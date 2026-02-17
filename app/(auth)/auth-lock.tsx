import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function AuthLockScreen() {
  const { user, logout, authenticateWithBiometrics, unlock, isLocked } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);


  // 🔥 useRef para animações
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateEntrance();
  }, []);

  // 🔑 Redireciona automaticamente quando o user é definido
/*   useEffect(() => {
    if (user) {
      console.log('[AUTH-LOCK] Usuário autenticado:', user);
      switch (user.role?.toUpperCase()) {
        case 'ADMIN':
          router.replace('/(admin)/(tabs)');
          break;
        case 'STAND':
          router.replace('/(vendedorstand)/(tabs)');
          break;
        case 'VENDEDOR':
          router.replace('/(vendedorinformal)/(tabs)');
          break;
        default:
          router.replace('/(tabs)/welcome');
      }
    }
  }, [user]);
 */
  useEffect(() => {
  if (user && !isLocked) {
    console.log('[AUTH-LOCK] Usuário autenticado:', user);
    switch (user.role?.toUpperCase()) {
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
    }
  }
}, [user, isLocked]);


  const animateEntrance = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔐 Função de autenticação biométrica
  async function handleBiometricAuth() {
    try {
      setIsAuthenticating(true);

      const success = await authenticateWithBiometrics();

      if (!success) {
        Alert.alert(
          'Falha na Autenticação',
          'Não foi possível autenticar. Tente novamente.'
        );
        return;
      }

      // 🔥 Animação de sucesso
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        // ✅ apenas desbloqueia; o redirecionamento acontece no useEffect([user])
        unlock();
        console.log('[AUTH-LOCK] unlock() chamado, aguardando user...');
      });

    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao autenticar.');
    } finally {
      setTimeout(() => {
        setIsAuthenticating(false);
      }, 700);
    }
  }

  return (
    <LinearGradient
      colors={
        Colors.gradientPrimary.length >= 2
          ? (Colors.gradientPrimary as unknown as readonly [string, string, ...string[]])
          : ['#000000', '#FFFFFF']
      }
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.avatar}
            >
              <Ionicons name="person" size={48} color={Colors.surface} />
            </LinearGradient>
          </View>

          {/* Texto */}
          <Text style={styles.greeting}>Bem-vindo de volta 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.subtitle}>
            Autentique-se para continuar
          </Text>

          {/* Botão biometria */}
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
            disabled={isAuthenticating}
            activeOpacity={0.8}
          >
            <View style={styles.biometricIconContainer}>
              <Ionicons
                name="finger-print"
                size={64}
                color={Colors.surface}
                style={isAuthenticating && styles.authenticatingIcon}
              />
            </View>

            <Text style={styles.biometricLabel}>
              {isAuthenticating ? 'Autenticando...' : 'Usar Biometria'}
            </Text>
          </TouchableOpacity>

          {/* Alternativas */}
          <View style={styles.alternatives}>
            <TouchableOpacity
              style={styles.alternativeButton}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Ionicons name="key-outline" size={18} color={Colors.surface} />
              <Text style={styles.alternativeText}>
                Entrar com senha
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.alternativeButton}
              onPress={async () => {
                Alert.alert(
                  'Sair',
                  'Tem certeza que deseja sair?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Sair',
                      style: 'destructive',
                      onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="log-out-outline" size={18} color={Colors.surface} />
              <Text style={styles.alternativeText}>
                Trocar conta
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark"
            size={16}
            color="rgba(255,255,255,0.7)"
          />
          <Text style={styles.footerText}>
            Seus dados estão protegidos
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', paddingHorizontal: Spacing.xl },
  avatarContainer: { marginBottom: Spacing.xl },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  greeting: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.surface, marginBottom: Spacing.xs },
  userName: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.surface, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.9)', marginBottom: Spacing.xxl },
  biometricButton: { alignItems: 'center', marginBottom: Spacing.xl },
  biometricIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  authenticatingIcon: { opacity: 0.6 },
  biometricLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.surface },
  alternatives: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  alternativeButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  alternativeText: { fontSize: FontSize.sm, color: Colors.surface, textDecorationLine: 'underline' },
  divider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.3)' },
  footer: { position: 'absolute', bottom: Spacing.xl, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  footerText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
});

/* 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing.xxl,
  },
  biometricButton: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  biometricIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  authenticatingIcon: {
    opacity: 0.6,
  },
  biometricLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
  alternatives: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  alternativeText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    textDecorationLine: 'underline',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
}); */