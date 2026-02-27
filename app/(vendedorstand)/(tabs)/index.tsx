import StatCard from '@/components/StatCard';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

export default function StandHomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name}</Text>
            <Text style={styles.subtitle}>Painel do Stand</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid - 2x2 */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="car-sport"
              value={12}
              label="Anúncios Ativos"
              color={Colors.primary}
            />
            <StatCard
              icon="eye"
              value={340}
              label="Visualizações"
              color={Colors.info}
              trend="+8%"
            />
            <StatCard
              icon="chatbubbles"
              value={8}
              label="Mensagens"
              color={Colors.success}
            />
            <StatCard
              icon="cash"
              value={5}
              label="Vendas (mês)"
              color={Colors.warning}
              trend="+2"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <QuickAction 
              icon="add-circle" 
              title="Adicionar" 
              subtitle="Novo carro"
              color={Colors.primary} 
            />
            <QuickAction 
              icon="create" 
              title="Editar" 
              subtitle="Anúncios"
              color={Colors.secondary} 
            />
            <QuickAction 
              icon="analytics" 
              title="Estatísticas" 
              subtitle="Ver mais"
              color={Colors.info} 
            />
            <QuickAction 
              icon="settings" 
              title="Configurar" 
              subtitle="Conta"
              color={Colors.textSecondary} 
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade Recente</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver tudo</Text>
            </TouchableOpacity>
          </View>
          
          <ActivityItem
            icon="eye"
            title="Nova visualização"
            subtitle="Toyota Corolla 2020"
            time="Há 5 min"
            color={Colors.info}
          />
          <ActivityItem
            icon="chatbubble"
            title="Nova mensagem"
            subtitle="Honda Civic 2019"
            time="Há 12 min"
            color={Colors.success}
          />
          <ActivityItem
            icon="heart"
            title="Favoritado"
            subtitle="Mazda CX-5 2021"
            time="Há 1h"
            color={Colors.error}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, title, subtitle, color }: any) {
  return (
    <TouchableOpacity style={styles.quickAction}>
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function ActivityItem({ icon, title, subtitle, time, color }: any) {
  return (
    <TouchableOpacity style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  statsContainer: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  section: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  activityTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
});