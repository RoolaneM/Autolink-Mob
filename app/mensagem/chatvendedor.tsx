import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { CARROS_MOCK } from '../../constants/data';
import { Car } from '../../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'vendedor';
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Olá! Estou interessado neste carro. Poderia me dar mais informações?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    text: 'Olá! Que bom saber do seu interesse! Este veículo está em excelentes condições. O que gostaria de saber?',
    sender: 'vendedor',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: '3',
    text: 'O carro aceita financiamento?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: '4',
    text: 'Sim! Trabalhamos com as principais instituições financeiras. Podemos fazer uma simulação sem compromisso.',
    sender: 'vendedor',
    timestamp: new Date(Date.now() - 3300000),
  },
];

export default function ChatVendedorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const car = CARROS_MOCK.find((item: Car) => item.id === id);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simular resposta do vendedor
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        'Entendi! Vou verificar isso para você.',
        'Com certeza! Posso te ajudar com isso.',
        'Ótima pergunta! Deixa eu te explicar...',
        'Sim, está disponível. Quer agendar uma visita?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const vendedorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'vendedor',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, vendedorMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender === 'user';
    const showTime =
      index === 0 ||
      messages[index - 1].sender !== item.sender ||
      item.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 300000;

    return (
      <View style={styles.messageWrapper}>
        <View
          style={[
            styles.messageContainer,
            isUser ? styles.userMessage : styles.vendedorMessage,
          ]}
        >
          {!isUser && (
            <View style={styles.vendedorAvatar}>
              <Ionicons name="person" size={16} color={Colors.primary} />
            </View>
          )}
          <View style={[styles.messageBubble, isUser && styles.userBubble]}>
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {item.text}
            </Text>
            {showTime && (
              <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
                {formatTime(item.timestamp)}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!car) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.notFoundText}>Carro não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton2}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Image source={{ uri: car.imagemPrincipal }} style={styles.carImage} />

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {car.marca} {car.modelo}
            </Text>
            <Text style={styles.headerSubtitle}>{car.vendedor.nome}</Text>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Lista de mensagens */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Indicador de digitação */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.vendedorAvatar}>
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
  backButton2: {
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
  carImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
  },
  moreButton: {
    padding: Spacing.xs,
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
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  vendedorMessage: {
    alignSelf: 'flex-start',
  },
  vendedorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
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
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.surface,
  },
  messageTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
});
