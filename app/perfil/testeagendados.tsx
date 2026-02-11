import AlertCard from '@/components/AlertCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { CARROS_MOCK } from '../../constants/data';

interface Agendamento {
  id: string;
  carId: string;
  data: Date;
  horario: string;
  local: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'realizado';
}

const MOCK_AGENDAMENTOS: Agendamento[] = [
  {
    id: '1',
    carId: CARROS_MOCK[0].id,
    data: new Date(2026, 1, 15),
    horario: '10:00',
    local: 'Maputo',
    status: 'confirmado',
  },
  {
    id: '2',
    carId: CARROS_MOCK[1].id,
    data: new Date(2026, 1, 20),
    horario: '14:00',
    local: 'Matola',
    status: 'pendente',
  },
  {
    id: '3',
    carId: CARROS_MOCK[2].id,
    data: new Date(2026, 1, 8),
    horario: '11:00',
    local: 'Maputo',
    status: 'realizado',
  },
];

export default function TestesAgendadosScreen() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState(MOCK_AGENDAMENTOS);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-MZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return Colors.success;
      case 'pendente':
        return Colors.warning;
      case 'cancelado':
        return Colors.error;
      case 'realizado':
        return Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'realizado':
        return 'Realizado';
      default:
        return status;
    }
  };

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    actions: [] as any[],
  });

  const handleCancelar = (id: string) => {
    setAlertConfig({
      visible: true,
      title: 'Cancelar Test Drive',
      message: 'Tem certeza que deseja cancelar este agendamento?',
      actions: [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: () => {
            setAgendamentos((prev) =>
              prev.map((ag) => (ag.id === id ? { ...ag, status: 'cancelado' as const } : ag))
            );
          },
        },
      ]
    });
      
  };

  const handleReagendar = () => {
    router.push('/agendamento');
  };

  const pendentes = agendamentos.filter(
    (a) => a.status === 'pendente' || a.status === 'confirmado'
  );
  const realizados = agendamentos.filter(
    (a) => a.status === 'realizado' || a.status === 'cancelado'
  );

  const renderItem = ({ item }: { item: Agendamento }) => {
    const car = CARROS_MOCK.find((c) => c.id === item.carId);
    if (!car) return null;

    const isPast = item.status === 'realizado' || item.status === 'cancelado';

    return (
      <TouchableOpacity
        style={[styles.agendamentoCard, isPast && styles.agendamentoCardPast]}
        onPress={() => router.push(`/detalhes/${car.id}`)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: car.imagemPrincipal }} style={styles.carImage} />

        <View style={styles.agendamentoContent}>
          <Text style={styles.carName} numberOfLines={1}>
            {car.marca} {car.modelo}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {formatDate(item.data)} às {item.horario}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{item.local}</Text>
          </View>

          <View style={styles.bottomRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(item.status)}20` },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getStatusLabel(item.status)}
              </Text>
            </View>

            {(item.status === 'pendente' || item.status === 'confirmado') && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelar(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons name="calendar" size={32} color={Colors.primary} />
          <View style={styles.headerTexts}>
            <Text style={styles.headerTitle}>Test Drives Agendados</Text>
            <Text style={styles.headerSubtitle}>
              {pendentes.length}{' '}
              {pendentes.length === 1 ? 'agendamento ativo' : 'agendamentos ativos'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.novoButton} onPress={handleReagendar}>
          <Ionicons name="add" size={20} color={Colors.surface} />
          <Text style={styles.novoButtonText}>Novo Test Drive</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {pendentes.length > 0 && (
              <Text style={styles.sectionTitle}>Próximos</Text>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhum test drive agendado</Text>
            <Text style={styles.emptySubtext}>
              Agende um test drive para experimentar o carro dos seus sonhos
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleReagendar}>
              <Text style={styles.emptyButtonText}>Agendar Test Drive</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <AlertCard
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={() =>
          setAlertConfig((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  novoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  novoButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
  listContent: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  agendamentoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agendamentoCardPast: {
    opacity: 0.6,
  },
  carImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  agendamentoContent: {
    flex: 1,
  },
  carName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  cancelButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    fontWeight: FontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
});
