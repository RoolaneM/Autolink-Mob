import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { api } from '../../../services/api';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  maxCars: number;
  unlimited: boolean;
  features: string[];
  recommended?: boolean;
}

interface UserSubscription {
  id: number;
  plan: Plan;
  startDate: string;
  endDate: string;
  active: boolean;
}

export default function CheckoutScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar planos
      const { data: plansData } = await api.get('/assinaturas/plans');
      setPlans(plansData);

      // Carregar assinatura atual
      try {
        const { data: subData } = await api.get('/assinaturas/me');
        setCurrentSubscription(subData);
      } catch (error) {
        // Usuário ainda não tem assinatura
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os planos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number, planName: string) => {
    Alert.alert(
      'Confirmar Assinatura',
      `Deseja assinar o plano ${planName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setSubscribing(true);
              await api.post('/assinaturas/subscribe', { planId });
              
              Alert.alert('Sucesso!', 'Assinatura realizada com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => loadData(),
                },
              ]);
            } catch (error: any) {
              const message = error.response?.data?.message || 'Erro ao processar assinatura';
              Alert.alert('Erro', message);
            } finally {
              setSubscribing(false);
            }
          },
        },
      ]
    );
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando planos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="diamond" size={32} color={Colors.primary} />
          <Text style={styles.headerTitle}>Planos e Assinaturas</Text>
          <Text style={styles.headerSubtitle}>
            Escolha o melhor plano para seu negócio
          </Text>
        </View>

        {/* Assinatura Atual */}
        {currentSubscription && currentSubscription.active && (
          <View style={styles.currentPlanContainer}>
            <View style={styles.currentPlanHeader}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.currentPlanTitle}>Plano Atual</Text>
            </View>

            <View style={styles.currentPlanCard}>
              <View style={styles.currentPlanInfo}>
                <Text style={styles.currentPlanName}>
                  {currentSubscription.plan.name}
                </Text>
                <Text style={styles.currentPlanPrice}>
                  {currentSubscription.plan.price.toLocaleString('pt-MZ', {
                    style: 'currency',
                    currency: 'MZN',
                  })}
                </Text>
              </View>

              <View style={styles.currentPlanDetails}>
                <View style={styles.currentPlanDetail}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.currentPlanDetailText}>
                    {getDaysRemaining(currentSubscription.endDate)} dias restantes
                  </Text>
                </View>

                <View style={styles.currentPlanDetail}>
                  <Ionicons name="car-sport-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.currentPlanDetailText}>
                    {currentSubscription.plan.unlimited
                      ? 'Anúncios ilimitados'
                      : `Até ${currentSubscription.plan.maxCars} anúncios`}
                  </Text>
                </View>
              </View>

              <View style={styles.expiryWarning}>
                <Ionicons name="time-outline" size={16} color={Colors.warning} />
                <Text style={styles.expiryText}>
                  Expira em {new Date(currentSubscription.endDate).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Lista de Planos */}
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Escolha seu Plano</Text>

          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSubscribe={handleSubscribe}
              isCurrentPlan={currentSubscription?.plan.id === plan.id}
              subscribing={subscribing}
            />
          ))}
        </View>

        {/* Benefícios */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Todos os planos incluem</Text>

          <BenefitItem icon="shield-checkmark" text="Verificação de perfil" />
          <BenefitItem icon="analytics" text="Estatísticas detalhadas" />
          <BenefitItem icon="chatbubbles" text="Sistema de mensagens" />
          <BenefitItem icon="image" text="Upload de múltiplas fotos" />
          <BenefitItem icon="people" text="Suporte prioritário" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({
  plan,
  onSubscribe,
  isCurrentPlan,
  subscribing,
}: {
  plan: Plan;
  onSubscribe: (id: number, name: string) => void;
  isCurrentPlan: boolean;
  subscribing: boolean;
}) {
  return (
    <View
      style={[
        styles.planCard,
        plan.recommended && styles.planCardRecommended,
        isCurrentPlan && styles.planCardCurrent,
      ]}
    >
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>RECOMENDADO</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.planPriceContainer}>
          <Text style={styles.planPrice}>
            {plan.price.toLocaleString('pt-MZ', {
              style: 'currency',
              currency: 'MZN',
            })}
          </Text>
          <Text style={styles.planDuration}>/{plan.durationDays} dias</Text>
        </View>
      </View>

      <View style={styles.planFeatures}>
        <View style={styles.planFeature}>
          <Ionicons name="car-sport" size={20} color={Colors.primary} />
          <Text style={styles.planFeatureText}>
            {plan.unlimited ? 'Anúncios ilimitados' : `Até ${plan.maxCars} anúncios`}
          </Text>
        </View>

        {plan.features?.map((feature, index) => (
          <View key={index} style={styles.planFeature}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.planFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {isCurrentPlan ? (
        <View style={styles.currentBadge}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.surface} />
          <Text style={styles.currentBadgeText}>Plano Atual</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            plan.recommended && styles.subscribeButtonRecommended,
          ]}
          onPress={() => onSubscribe(plan.id, plan.name)}
          disabled={subscribing}
          activeOpacity={0.8}
        >
          {subscribing ? (
            <ActivityIndicator color={Colors.surface} size="small" />
          ) : (
            <Text style={styles.subscribeButtonText}>Assinar Agora</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

function BenefitItem({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  currentPlanContainer: {
    padding: Spacing.md,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  currentPlanTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  currentPlanCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  currentPlanInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  currentPlanName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  currentPlanPrice: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  currentPlanDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  currentPlanDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  currentPlanDetailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  expiryWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  expiryText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
  },
  plansContainer: {
    padding: Spacing.md,
  },
  plansTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planCardRecommended: {
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  planCardCurrent: {
    borderColor: Colors.success,
    backgroundColor: '#F0FFF4',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  planHeader: {
    marginBottom: Spacing.md,
  },
  planName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  planDuration: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  planFeatures: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planFeatureText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  subscribeButtonRecommended: {
    backgroundColor: Colors.primary,
  },
  subscribeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  currentBadgeText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  benefitsContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  benefitsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
});