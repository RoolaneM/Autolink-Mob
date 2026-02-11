import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

export default function TermosScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="document-text" size={48} color={Colors.primary} />
          <Text style={styles.headerTitle}>Termos de Uso</Text>
          <Text style={styles.headerSubtitle}>
            Última atualização: 11 de Fevereiro de 2026
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Section
            number="1"
            title="Aceitação dos Termos"
            content="Ao acessar e usar a plataforma AutoLinkMZ, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços."
          />

          <Section
            number="2"
            title="Descrição do Serviço"
            content="A AutoLinkMZ é uma plataforma digital que conecta compradores e vendedores de veículos em Moçambique. Nós facilitamos a negociação, mas não somos parte das transações entre usuários."
            items={[
              'Anúncios de veículos novos e usados',
              'Ferramentas de busca e filtros avançados',
              'Sistema de mensagens entre usuários',
              'Simulador de financiamento',
              'Agendamento de test drives',
            ]}
          />

          <Section
            number="3"
            title="Cadastro e Conta"
            content="Para usar determinadas funcionalidades, você deve criar uma conta fornecendo informações precisas e atualizadas."
            items={[
              'Você é responsável por manter a confidencialidade da sua senha',
              'Não compartilhe suas credenciais de acesso',
              'Notifique-nos imediatamente sobre qualquer uso não autorizado',
              'Você deve ter pelo menos 18 anos para criar uma conta',
            ]}
          />

          <Section
            number="4"
            title="Responsabilidades dos Usuários"
            content="Ao usar a plataforma, você se compromete a:"
            items={[
              'Fornecer informações verdadeiras e precisas',
              'Não publicar conteúdo falso, enganoso ou fraudulento',
              'Respeitar os direitos de propriedade intelectual',
              'Não usar a plataforma para atividades ilegais',
              'Manter comunicação respeitosa com outros usuários',
              'Não fazer spam ou enviar mensagens não solicitadas',
            ]}
          />

          <Section
            number="5"
            title="Anúncios de Veículos"
            content="Para vendedores e stands:"
            items={[
              'Você garante que tem o direito de vender o veículo anunciado',
              'As informações do anúncio devem ser precisas e completas',
              'Fotos devem ser reais e representar fielmente o veículo',
              'Preços devem ser apresentados de forma clara',
              'Documentação do veículo deve estar em ordem',
              'Reservamo-nos o direito de remover anúncios inadequados',
            ]}
          />

          <Section
            number="6"
            title="Transações"
            content="Importante sobre compra e venda:"
            items={[
              'A AutoLinkMZ não é parte das transações entre usuários',
              'Não somos responsáveis pela qualidade dos veículos',
              'Recomendamos inspeção técnica antes da compra',
              'Verifique toda a documentação do veículo',
              'Realize pagamentos de forma segura',
              'Guarde todos os comprovantes e contratos',
            ]}
          />

          <Section
            number="7"
            title="Taxas e Pagamentos"
            content="Informações sobre cobranças:"
            items={[
              'O cadastro básico é gratuito para compradores',
              'Vendedores informais podem ter taxas por anúncio',
              'Stands parceiros têm planos de assinatura',
              'Taxas podem ser alteradas com aviso prévio de 30 dias',
              'Não processamos pagamentos de veículos',
            ]}
          />

          <Section
            number="8"
            title="Propriedade Intelectual"
            content="Todo o conteúdo da plataforma AutoLinkMZ, incluindo logotipos, design, textos e código, é protegido por direitos autorais e outras leis de propriedade intelectual."
          />

          <Section
            number="9"
            title="Limitação de Responsabilidade"
            content="A AutoLinkMZ não se responsabiliza por:"
            items={[
              'Informações imprecisas fornecidas por usuários',
              'Danos ou defeitos em veículos anunciados',
              'Transações realizadas entre usuários',
              'Perda de dados ou interrupção do serviço',
              'Atos de terceiros ou caso fortuito',
            ]}
          />

          <Section
            number="10"
            title="Suspensão e Encerramento"
            content="Podemos suspender ou encerrar sua conta se:"
            items={[
              'Você violar estes Termos de Uso',
              'Houver suspeita de fraude ou atividade ilegal',
              'Seu comportamento prejudicar outros usuários',
              'A pedido de autoridades competentes',
            ]}
          />

          <Section
            number="11"
            title="Modificações dos Termos"
            content="Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas por email ou através da plataforma. O uso continuado após as alterações constitui aceitação dos novos termos."
          />

          <Section
            number="12"
            title="Lei Aplicável e Jurisdição"
            content="Estes Termos de Uso são regidos pelas leis da República de Moçambique. Qualquer disputa será resolvida nos tribunais competentes de Maputo, Moçambique."
          />

          <Section
            number="13"
            title="Contato"
            content="Para questões sobre estes Termos de Uso, entre em contato:"
            items={[
              'Email: legal@autolinkmz.co.mz',
              'Telefone: +258 84 000 0000',
              'Endereço: Av. Julius Nyerere, Maputo',
            ]}
          />

          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.footerTitle}>Compromisso AutoLinkMZ</Text>
            <Text style={styles.footerText}>
              Trabalhamos continuamente para garantir uma plataforma segura e
              transparente para todos os nossos usuários.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  number,
  title,
  content,
  items,
}: {
  number: string;
  title: string;
  content: string;
  items?: string[];
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <Text style={styles.sectionContent}>{content}</Text>

      {items && items.length > 0 && (
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  sectionContent: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  itemsList: {
    marginTop: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: Spacing.sm,
  },
  itemText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  footerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  footerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});