import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { CARROS_MOCK } from '../../constants/data';

interface ChatItem {
  id: string;
  carId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  vendedorNome: string;
}

const MOCK_CHATS: ChatItem[] = CARROS_MOCK.slice(0, 5).map((car, index) => ({
  id: car.id,
  carId: car.id,
  lastMessage:
    index === 0
      ? 'Olá! O carro ainda está disponível?'
      : index === 1
      ? 'Podemos agendar uma visita para amanhã?'
      : index === 2
      ? 'Qual o valor final com desconto?'
      : 'Obrigado pelas informações!',
  timestamp: index === 0 ? 'Agora' : index === 1 ? '10min' : index === 2 ? '1h' : '2h',
  unread: index < 2 ? index + 1 : 0,
  vendedorNome: car.vendedor.nome,
}));

export default function ChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const openChat = (carId: string) => {
    router.push(`/mensagem/chatvendedor?id=${carId}`);
  };

  const filteredChats = MOCK_CHATS.filter((chat) => {
    const car = CARROS_MOCK.find((c) => c.id === chat.carId);
    if (!car) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      car.marca.toLowerCase().includes(searchLower) ||
      car.modelo.toLowerCase().includes(searchLower) ||
      chat.vendedorNome.toLowerCase().includes(searchLower)
    );
  });

  const renderItem = ({ item }: { item: ChatItem }) => {
    const car = CARROS_MOCK.find((c) => c.id === item.carId);
    if (!car) return null;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => openChat(item.carId)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: car.imagemPrincipal }} style={styles.carImage} />
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.carName} numberOfLines={1}>
              {car.marca} {car.modelo}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <Text style={styles.vendedorName} numberOfLines={1}>
            {item.vendedorNome}
          </Text>

          <Text
            style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <Text style={styles.headerSubtitle}>
          {filteredChats.length} {filteredChats.length === 1 ? 'conversa' : 'conversas'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversas..."
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

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma mensagem ainda'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Tente buscar por outra marca ou modelo'
                : 'Comece a conversar com vendedores'}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  imageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
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
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  carName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  vendedorName: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  lastMessageUnread: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
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
