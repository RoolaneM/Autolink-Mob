import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { CARROS_MOCK } from '../../../constants/data';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'vendedor' | 'cliente';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Olá! Vi seu anúncio e tenho interesse no carro.',
    sender: 'cliente',
    timestamp: new Date(Date.now() - 7200000),
    status: 'read',
  },
  {
    id: '2',
    text: 'Olá! Fico feliz com seu interesse. Como posso ajudá-lo?',
    sender: 'vendedor',
    timestamp: new Date(Date.now() - 7100000),
    status: 'read',
  },
  {
    id: '3',
    text: 'O carro ainda está disponível?',
    sender: 'cliente',
    timestamp: new Date(Date.now() - 7000000),
    status: 'read',
  },
  {
    id: '4',
    text: 'Sim! Está disponível e em excelentes condições. Gostaria de agendar uma visita?',
    sender: 'vendedor',
    timestamp: new Date(Date.now() - 6900000),
    status: 'read',
  },
];

export default function ChatClienteScreen() {
  const params = useLocalSearchParams<{
    clienteId: string;
    clienteNome: string;
    carId: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const car = CARROS_MOCK.find((c) => c.id === params.carId);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'vendedor',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simular resposta do cliente (opcional)
    setIsTyping(true);
    setTimeout(() => {
      const clienteMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Entendi! Obrigado pela resposta.',
        sender: 'cliente',
        timestamp: new Date(),
        status: 'read',
      };
      setMessages((prev) => [...prev, clienteMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isVendedor = item.sender === 'vendedor';
    const showTime =
      index === 0 ||
      messages[index - 1].sender !== item.sender ||
      item.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 300000;

    return (
      <View style={styles.messageWrapper}>
        <View
          style={[
            styles.messageContainer,
            isVendedor ? styles.vendedorMessage : styles.clienteMessage,
          ]}
        >
          {!isVendedor && (
            <View style={styles.clienteAvatar}>
              <Ionicons name="person" size={16} color={Colors.primary} />
            </View>
          )}

          <View style={[styles.messageBubble, isVendedor && styles.vendedorBubble]}>
            <Text style={[styles.messageText, isVendedor && styles.vendedorMessageText]}>
              {item.text}
            </Text>

            <View style={styles.messageFooter}>
              <Text style={[styles.messageTime, isVendedor && styles.vendedorMessageTime]}>
                {formatTime(item.timestamp)}
              </Text>

              {isVendedor && item.status && (
                <Ionicons
                  name={
                    item.status === 'read'
                      ? 'checkmark-done'
                      : item.status === 'delivered'
                      ? 'checkmark-done-outline'
                      : 'checkmark'
                  }
                  size={14}
                  color={item.status === 'read' ? Colors.info : 'rgba(255,255,255,0.8)'}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.clienteAvatar}>
            <Ionicons name="person" size={20} color={Colors.primary} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {params.clienteNome || 'Cliente'}
            </Text>
            {car && (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {car.marca} {car.modelo}
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Car Info Banner */}
        {car && (
          <TouchableOpacity
            style={styles.carBanner}
            onPress={() => router.push(`/detalhes/${car.id}`)}
          >
            <Image source={{ uri: car.imagemPrincipal }} style={styles.carBannerImage} />
            <View style={styles.carBannerInfo}>
              <Text style={styles.carBannerTitle}>
                {car.marca} {car.modelo}
              </Text>
              <Text style={styles.carBannerPrice}>
                {car.preco.toLocaleString('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.clienteAvatar}>
              <Ionicons name="person" size={16} color={Colors.primary} />
            </View>
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? Colors.surface : Colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  backButton: {
    marginRight: Spacing.xs,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  clienteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    padding: Spacing.xs,
  },
  carBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  carBannerImage: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
  },
  carBannerInfo: {
    flex: 1,
  },
  carBannerTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  carBannerPrice: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  messagesList: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  messageWrapper: {
    marginBottom: Spacing.sm,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  vendedorMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  clienteMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vendedorBubble: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 20,
  },
  vendedorMessageText: {
    color: Colors.surface,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  vendedorMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  typingBubble: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: 4,
    marginLeft: Spacing.xs,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.sm,
  },
  attachButton: {
    padding: Spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    fontSize: FontSize.md,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background,
  },
});