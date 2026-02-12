import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

export default function PendenteStandScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={
          (Colors.gradientPrimary.length >= 2
            ? Colors.gradientPrimary
            : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
        }
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="time" size={80} color={Colors.surface} />
          </View>

          <Text style={styles.title}>Aguardando Aprovação</Text>

          <Text style={styles.description}>
            Seu registro de stand foi recebido com sucesso! Nossa equipe está
            analisando sua documentação.
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.infoText}>Documentos recebidos</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color={Colors.warning} />
              <Text style={styles.infoText}>Análise em andamento</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={24} color={Colors.info} />
              <Text style={styles.infoText}>Notificação por email</Text>
            </View>
          </View>

          <View style={styles.timelineBox}>
            <Text style={styles.timelineTitle}>O que acontece agora?</Text>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>1</Text>
              <Text style={styles.timelineText}>Verificação de documentos (24h)</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>2</Text>
              <Text style={styles.timelineText}>Análise de compliance (24h)</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>3</Text>
              <Text style={styles.timelineText}>Aprovação e ativação</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.buttonText}>Voltar ao Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="chatbubbles-outline" size={20} color={Colors.surface} />
            <Text style={styles.supportText}>Falar com Suporte</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.surface,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontWeight: FontWeight.medium,
  },
  timelineBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  timelineTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginBottom: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  timelineNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: FontWeight.bold,
  },
  timelineText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.surface,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  supportText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    textDecorationLine: 'underline',
  },
});