import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';

interface Notification {
  id: string;
  type: 'message' | 'sale' | 'system' | 'promo';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function NotificacoesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'Nova mensagem',
      description: 'João está interessado no seu Toyota Corolla',
      time: 'Há 2 min',
      read: false,
    },
    {
      id: '2',
      type: 'sale',
      title: 'Carro vendido! 🎉',
      description: 'Parabéns! Seu Honda Civic foi vendido',
      time: 'Há 1 hora',
      read: false,
    },
    {
      id: '3',
      type: 'system',
      title: 'Anúncio publicado',
      description: 'Seu Mercedes-Benz Classe C está ativo',
      time: 'Ontem',
      read: true,
    },
    {
      id: '4',
      type: 'promo',
      title: 'Destaque seu anúncio',
      description: 'Aumente suas vendas em até 3x',
      time: '2 dias atrás',
      read: true,
    },
  ]);

  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    messageNotifications: true,
    saleNotifications: true,
    promotionNotifications: false,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Carregar notificações da API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return { name: 'chatbubbles', color: Colors.primary };
      case 'sale':
        return { name: 'cart', color: Colors.success };
      case 'system':
        return { name: 'information-circle', color: Colors.info };
      case 'promo':
        return { name: 'megaphone', color: Colors.warning };
      default:
        return { name: 'notifications', color: Colors.textSecondary };
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.notificationDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Ionicons name="close-circle-outline" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificações</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </Text>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done" size={20} color={Colors.primary} />
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>Você está em dia!</Text>
          </View>
        }
      />

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Preferências</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait-outline" size={20} color={Colors.primary} />
              <Text style={styles.settingLabel}>Notificações Push</Text>
            </View>
            <Switch
              value={settings.pushEnabled}
              onValueChange={(v) => setSettings({ ...settings, pushEnabled: v })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
              <Text style={styles.settingLabel}>Notificações por Email</Text>
            </View>
            <Switch
              value={settings.emailEnabled}
              onValueChange={(v) => setSettings({ ...settings, emailEnabled: v })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubbles-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>Mensagens</Text>
            </View>
            <Switch
              value={settings.messageNotifications}
              onValueChange={(v) => setSettings({ ...settings, messageNotifications: v })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="megaphone-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>Promoções</Text>
            </View>
            <Switch
              value={settings.promotionNotifications}
              onValueChange={(v) => setSettings({ ...settings, promotionNotifications: v })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  listContent: {
    padding: Spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
  },
  unreadCard: {
    borderLeftColor: Colors.primary,
    backgroundColor: `${Colors.primary}05`,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.xs,
  },
  notificationDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  notificationTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  settingsSection: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  settingsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  settingCard: {
    marginBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
});