import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';

interface Notificacao {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'promocao' | 'testdrive' | 'novocarro' | 'mensagem';
}

const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: '1',
    title: 'Test Drive Confirmado',
    message: 'Seu test drive para o Toyota Corolla foi confirmado para 15 Fev às 10:00',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    type: 'testdrive',
  },
  {
    id: '2',
    title: 'Nova Mensagem',
    message: 'João Silva respondeu sua mensagem sobre o Honda Civic',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    type: 'mensagem',
  },
  {
    id: '3',
    title: 'Novo Carro Disponível',
    message: 'Um novo Jeep Compass foi adicionado perto de você em Maputo',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    type: 'novocarro',
  },
  {
    id: '4',
    title: 'Promoção Especial',
    message: 'Financiamento com taxa reduzida esta semana! Até 48x sem entrada',
    timestamp: new Date(Date.now() - 172800000),
    read: true,
    type: 'promocao',
  },
  {
    id: '5',
    title: 'Novo Carro do seu Interesse',
    message: 'Encontramos um Toyota Hilux 2020 que pode te interessar',
    timestamp: new Date(Date.now() - 259200000),
    read: true,
    type: 'novocarro',
  },
];

export default function NotificacoesScreen() {
  const [notificacoes, setNotificacoes] = useState(MOCK_NOTIFICACOES);
  const [preferencias, setPreferencias] = useState({
    promocoes: true,
    testdrives: true,
    novoscarros: true,
    mensagens: true,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'testdrive':
        return { name: 'calendar', color: Colors.info };
      case 'mensagem':
        return { name: 'chatbubbles', color: Colors.primary };
      case 'novocarro':
        return { name: 'car-sport', color: Colors.success };
      case 'promocao':
        return { name: 'pricetag', color: Colors.warning };
      default:
        return { name: 'notifications', color: Colors.primary };
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `Há ${hours}h`;
    if (days === 1) return 'Ontem';
    return `Há ${days} dias`;
  };

  const markAsRead = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotificacoes((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notificacoes.filter((n) => !n.read).length;

  const renderItem = ({ item }: { item: Notificacao }) => {
    const icon = getIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.notifItem, !item.read && styles.notifItemUnread]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>

        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.notifMessage} numberOfLines={2}>
            {item.message}
          </Text>

          <Text style={styles.notifTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Notificações</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0
                ? `${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}`
                : 'Todas lidas'}
            </Text>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Marcar todas como lidas</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de Notificações */}
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>Você está em dia com tudo!</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.preferences}>
            <Text style={styles.preferencesTitle}>Preferências de Notificação</Text>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="pricetag-outline" size={22} color={Colors.primary} />
                <Text style={styles.preferenceText}>Promoções</Text>
              </View>
              <Switch
                value={preferencias.promocoes}
                onValueChange={(value) =>
                  setPreferencias({ ...preferencias, promocoes: value })
                }
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
                <Text style={styles.preferenceText}>Test Drives</Text>
              </View>
              <Switch
                value={preferencias.testdrives}
                onValueChange={(value) =>
                  setPreferencias({ ...preferencias, testdrives: value })
                }
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="car-sport-outline" size={22} color={Colors.primary} />
                <Text style={styles.preferenceText}>Novos Carros</Text>
              </View>
              <Switch
                value={preferencias.novoscarros}
                onValueChange={(value) =>
                  setPreferencias({ ...preferencias, novoscarros: value })
                }
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="chatbubbles-outline" size={22} color={Colors.primary} />
                <Text style={styles.preferenceText}>Mensagens</Text>
              </View>
              <Switch
                value={preferencias.mensagens}
                onValueChange={(value) =>
                  setPreferencias({ ...preferencias, mensagens: value })
                }
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>
          </View>
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
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  markAllButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  markAllText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  notifItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  notifItemUnread: {
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  notifTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  notifTitleUnread: {
    fontWeight: FontWeight.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.xs,
  },
  notifMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  notifTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
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
  },
  preferences: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  preferencesTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  preferenceText: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
});
