import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { CARROS_MOCK } from '../../../constants/data';

interface Message {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteAvatar?: string;
  carId: string;
  carMarca: string;
  carModelo: string;
  carImagem: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online?: boolean;
}

// Mock de mensagens - substitua pela sua API quando disponível
const MOCK_MESSAGES: Message[] = CARROS_MOCK.slice(0, 5).map((car, index) => ({
  id: `msg-${index}`,
  clienteId: `cliente-${index}`,
  clienteNome: `Cliente ${index + 1}`,
  carId: car.id,
  carMarca: car.marca,
  carModelo: car.modelo,
  carImagem: car.imagemPrincipal,
  lastMessage:
    index === 0
      ? 'Olá! O carro ainda está disponível?'
      : index === 1
      ? 'Podemos agendar uma visita?'
      : index === 2
      ? 'Aceita troca?'
      : index === 3
      ? 'Qual o melhor preço à vista?'
      : 'Obrigado pelas informações!',
  timestamp: new Date(Date.now() - index * 3600000),
  unread: index < 3 ? index + 1 : 0,
  online: index < 2,
}));

export default function MensagensScreen() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aqui você carregaria as mensagens da API
    // const { data } = await api.get('/messages');
    // setMessages(data);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredMessages = messages.filter((msg) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      msg.clienteNome.toLowerCase().includes(searchLower) ||
      msg.carMarca.toLowerCase().includes(searchLower) ||
      msg.carModelo.toLowerCase().includes(searchLower) ||
      msg.lastMessage.toLowerCase().includes(searchLower)
    );
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `Há ${hours}h`;
    if (days === 1) return 'Ontem';
    if (days < 7) return `Há ${days} dias`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const unreadCount = messages.filter((m) => m.unread > 0).length;

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[styles.messageCard, item.unread > 0 && styles.messageCardUnread]}
      onPress={() =>
        router.push({
          pathname: '/(vendedorstand)/paginas/chatcliente',
          params: {
            clienteId: item.clienteId,
            clienteNome: item.clienteNome,
            carId: item.carId,
          },
        })
      }
      activeOpacity={0.7}
    >
      {/* Avatar do Cliente */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color={Colors.primary} />
        </View>
        {item.online && <View style={styles.onlineBadge} />}
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>

      {/* Conteúdo */}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.clienteName, item.unread > 0 && styles.clienteNameUnread]}>
            {item.clienteNome}
          </Text>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>

        <View style={styles.carInfo}>
          <Ionicons name="car-sport" size={14} color={Colors.textSecondary} />
          <Text style={styles.carText} numberOfLines={1}>
            {item.carMarca} {item.carModelo}
          </Text>
        </View>

        <Text
          style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]}
          numberOfLines={2}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Imagem do Carro */}
      <Image source={{ uri: item.carImagem }} style={styles.carImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Mensagens</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0
              ? `${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}`
              : 'Todas lidas'}
          </Text>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar mensagens..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de Mensagens */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
            <Ionicons name="chatbubbles-outline" size={80} color={Colors.textLight} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Nenhuma mensagem encontrada' : 'Nenhuma mensagem ainda'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Tente buscar por outro termo'
                : 'Quando clientes entrarem em contato, você verá aqui'}
            </Text>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    marginBottom: Spacing.md,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  listContent: {
    padding: Spacing.md,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageCardUnread: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: Colors.surface,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  messageContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  clienteName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  clienteNameUnread: {
    fontWeight: FontWeight.bold,
  },
  messageTime: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  carText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  lastMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  lastMessageUnread: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
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
  },
});