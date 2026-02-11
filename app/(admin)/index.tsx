import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function StandHomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name}! 👋</Text>
          <Text style={styles.subtitle}>Bem-vindo ao painel do administrador</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard icon="car-sport" value="12" label="Anúncios Ativos" color={Colors.primary} />
          <StatCard icon="eye" value="340" label="Visualizações" color={Colors.info} />
          <StatCard icon="chatbubbles" value="8" label="Mensagens" color={Colors.success} />
          <StatCard icon="cash" value="5" label="Vendas (mês)" color={Colors.warning} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <QuickAction icon="add-circle" title="Adicionar Carro" color={Colors.primary} />
          <QuickAction icon="create" title="Editar Anúncios" color={Colors.secondary} />
          <QuickAction icon="analytics" title="Ver Estatísticas" color={Colors.info} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label, color }: any) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, title, color }: any) {
  return (
    <TouchableOpacity style={styles.quickAction}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.quickActionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
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
    marginTop: Spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  quickActionText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
});