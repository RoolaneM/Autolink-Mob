import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'Como agendar um test drive?',
    answer:
      'Para agendar um test drive, acesse a página de detalhes do carro desejado e clique no botão "Agendar Test Drive". Preencha suas informações e escolha data e horário disponíveis.',
    icon: 'calendar-outline',
  },
  {
    id: '2',
    question: 'Como favoritar um carro?',
    answer:
      'Clique no ícone de coração no canto superior direito do card do carro ou na página de detalhes. Seus favoritos ficam salvos na aba "Favoritos".',
    icon: 'heart-outline',
  },
  {
    id: '3',
    question: 'Como editar meu perfil?',
    answer:
      'Acesse a aba "Perfil" e clique em "Meus Dados". Depois clique em "Editar Perfil" para alterar suas informações.',
    icon: 'person-outline',
  },
  {
    id: '4',
    question: 'Como funciona o financiamento?',
    answer:
      'Acesse a página do carro e clique em "Simular Financiamento". Ajuste a entrada, número de parcelas e veja os valores calculados automaticamente.',
    icon: 'calculator-outline',
  },
  {
    id: '5',
    question: 'Como entrar em contato com o vendedor?',
    answer:
      'Na página de detalhes do carro, você pode iniciar um chat, ligar diretamente ou enviar mensagem pelo WhatsApp clicando nos botões disponíveis.',
    icon: 'chatbubbles-outline',
  },
  {
    id: '6',
    question: 'Como vender meu carro?',
    answer:
      'Registre-se como vendedor informal ou stand e siga os passos de verificação. Após aprovação, você poderá adicionar seus anúncios.',
    icon: 'car-sport-outline',
  },
];

export default function AjudaScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQ = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSupport = () => {
    Alert.alert(
      'Falar com Suporte',
      'Como você gostaria de entrar em contato?',
      [
        {
          text: 'WhatsApp',
          onPress: () => Linking.openURL('https://wa.me/258840000000'),
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:suporte@autolinkmz.co.mz'),
        },
        {
          text: 'Telefone',
          onPress: () => Linking.openURL('tel:+258840000000'),
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons name="help-circle" size={32} color={Colors.primary} />
          <View style={styles.headerTexts}>
            <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
            <Text style={styles.headerSubtitle}>
              Como podemos ajudá-lo hoje?
            </Text>
          </View>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ajuda..."
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contato Rápido */}
        <View style={styles.quickContact}>
          <Text style={styles.sectionTitle}>Precisa de ajuda imediata?</Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={handleContactSupport}
          >
            <View style={styles.supportIcon}>
              <Ionicons name="headset" size={24} color={Colors.primary} />
            </View>
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Falar com Suporte</Text>
              <Text style={styles.supportSubtitle}>
                Estamos disponíveis 24/7 para ajudá-lo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>

          {filteredFAQ.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
              <Text style={styles.emptySubtext}>
                Tente buscar por outra palavra-chave
              </Text>
            </View>
          ) : (
            filteredFAQ.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.faqItem}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <View style={styles.faqIconContainer}>
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </View>

                  {isExpanded && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Outros Recursos */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Outros Recursos</Text>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
            <Text style={styles.resourceText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary} />
            <Text style={styles.resourceText}>Política de Privacidade</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.resourceText}>Sobre Nós</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://autolinkmz.co.mz/tutorial')}
          >
            <Ionicons name="play-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.resourceText}>Tutorial em Vídeo</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Contato Final */}
        <View style={styles.finalContact}>
          <Text style={styles.finalContactTitle}>Ainda precisa de ajuda?</Text>
          <Text style={styles.finalContactText}>
            Nossa equipe está pronta para ajudá-lo com qualquer dúvida
          </Text>

          <View style={styles.contactMethods}>
            <TouchableOpacity
              style={styles.contactMethod}
              onPress={() => Linking.openURL('mailto:suporte@autolinkmz.co.mz')}
            >
              <Ionicons name="mail" size={24} color={Colors.primary} />
              <Text style={styles.contactMethodText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactMethod}
              onPress={() => Linking.openURL('https://wa.me/258840000000')}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text style={styles.contactMethodText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactMethod}
              onPress={() => Linking.openURL('tel:+258840000000')}
            >
              <Ionicons name="call" size={24} color={Colors.primary} />
              <Text style={styles.contactMethodText}>Telefone</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  quickContact: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  faqSection: {
    padding: Spacing.md,
  },
  faqItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  faqIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  faqAnswer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingLeft: 68,
  },
  faqAnswerText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resourcesSection: {
    padding: Spacing.md,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  resourceText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  finalContact: {
    margin: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  finalContactTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  finalContactText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  contactMethods: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactMethod: {
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    minWidth: 90,
  },
  contactMethodText: {
    fontSize: FontSize.xs,
    color: Colors.text,
    marginTop: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
});