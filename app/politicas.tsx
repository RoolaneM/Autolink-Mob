import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

export default function PoliticasScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
          <Text style={styles.headerTitle}>Política de Privacidade</Text>
          <Text style={styles.headerSubtitle}>
            Última atualização: 11 de Fevereiro de 2026
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.intro}>
            <Text style={styles.introText}>
              A AutoLinkMZ valoriza e respeita sua privacidade. Esta Política de
              Privacidade explica como coletamos, usamos, armazenamos e protegemos suas
              informações pessoais.
            </Text>
          </View>

          <Section
            number="1"
            title="Informações que Coletamos"
            content="Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:"
          />

          <SubSection
            title="1.1 Informações Fornecidas por Você"
            items={[
              'Nome completo, email e telefone',
              'Endereço e localização',
              'Documentos de identificação (BI)',
              'Fotos de perfil e documentos',
              'Informações de veículos (anúncios)',
              'Mensagens e comunicações',
            ]}
          />

          <SubSection
            title="1.2 Informações Coletadas Automaticamente"
            items={[
              'Endereço IP e dados de localização',
              'Tipo de dispositivo e sistema operacional',
              'Navegador e configurações de idioma',
              'Páginas visitadas e tempo de navegação',
              'Interações com anúncios',
              'Dados de cookies',
            ]}
          />

          <SubSection
            title="1.3 Informações de Terceiros"
            items={[
              'Dados de redes sociais (se você conectar sua conta)',
              'Informações de verificação de identidade',
              'Dados de instituições financeiras (para financiamento)',
            ]}
          />

          <Section
            number="2"
            title="Como Usamos Suas Informações"
            content="Utilizamos suas informações para:"
            items={[
              'Criar e gerenciar sua conta',
              'Processar e publicar anúncios',
              'Facilitar comunicação entre usuários',
              'Verificar identidade e prevenir fraudes',
              'Processar transações e pagamentos',
              'Enviar notificações importantes',
              'Melhorar nossos serviços',
              'Personalizar sua experiência',
              'Realizar análises e estatísticas',
              'Cumprir obrigações legais',
            ]}
          />

          <Section
            number="3"
            title="Compartilhamento de Informações"
            content="Compartilhamos suas informações apenas quando necessário:"
          />

          <SubSection
            title="3.1 Com Outros Usuários"
            items={[
              'Informações de anúncios são públicas',
              'Nome e foto de perfil em conversas',
              'Informações de contato (quando você aceita)',
            ]}
          />

          <SubSection
            title="3.2 Com Parceiros de Negócio"
            items={[
              'Instituições financeiras (para financiamento)',
              'Seguradoras (para cotações)',
              'Provedores de verificação de identidade',
            ]}
          />

          <SubSection
            title="3.3 Com Prestadores de Serviços"
            items={[
              'Hospedagem de dados e servidores',
              'Serviços de email e SMS',
              'Processamento de pagamentos',
              'Análise e métricas',
            ]}
          />

          <SubSection
            title="3.4 Requisitos Legais"
            items={[
              'Cumprimento de leis e regulamentos',
              'Resposta a processos legais',
              'Proteção de direitos e segurança',
              'Investigação de fraudes',
            ]}
          />

          <Section
            number="4"
            title="Armazenamento e Segurança"
            content="Levamos a segurança dos seus dados a sério:"
            items={[
              'Dados armazenados em servidores seguros',
              'Criptografia de dados sensíveis',
              'Acesso restrito a informações pessoais',
              'Monitoramento contínuo de segurança',
              'Backups regulares',
              'Conformidade com padrões internacionais',
            ]}
          />

          <Section
            number="5"
            title="Seus Direitos"
            content="Você tem direito a:"
            items={[
              'Acessar suas informações pessoais',
              'Corrigir dados incorretos',
              'Solicitar exclusão de dados',
              'Opor-se ao processamento',
              'Portabilidade de dados',
              'Retirar consentimento a qualquer momento',
              'Apresentar reclamação',
            ]}
          />

          <Section
            number="6"
            title="Retenção de Dados"
            content="Mantemos suas informações pelo tempo necessário para:"
            items={[
              'Fornecer nossos serviços',
              'Cumprir obrigações legais',
              'Resolver disputas',
              'Fazer cumprir acordos',
            ]}
          />

          <View style={styles.subsection}>
            <Text style={styles.subsectionContent}>
              Após a exclusão da conta, dados pessoais são removidos em até 90 dias,
              exceto quando a retenção for exigida por lei.
            </Text>
          </View>

          <Section
            number="7"
            title="Cookies e Tecnologias Similares"
            content="Usamos cookies para:"
            items={[
              'Manter você conectado',
              'Lembrar suas preferências',
              'Analisar uso da plataforma',
              'Personalizar conteúdo',
              'Melhorar desempenho',
            ]}
          />

          <View style={styles.subsection}>
            <Text style={styles.subsectionContent}>
              Você pode controlar cookies nas configurações do navegador, mas isso pode
              afetar algumas funcionalidades.
            </Text>
          </View>

          <Section
            number="8"
            title="Privacidade de Menores"
            content="Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se descobrirmos que coletamos dados de menores, tomaremos medidas para excluí-los."
          />

          <Section
            number="9"
            title="Transferências Internacionais"
            content="Seus dados podem ser transferidos e processados em outros países. Garantimos proteção adequada através de:"
            items={[
              'Cláusulas contratuais padrão',
              'Certificações de privacidade',
              'Medidas de segurança apropriadas',
            ]}
          />

          <Section
            number="10"
            title="Alterações nesta Política"
            content="Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas por:"
            items={[
              'Email para usuários registrados',
              'Aviso na plataforma',
              'Notificação no aplicativo',
            ]}
          />

          <Section
            number="11"
            title="Entre em Contato"
            content="Para questões sobre privacidade ou para exercer seus direitos:"
            items={[
              'Email: privacidade@autolinkmz.co.mz',
              'Telefone: +258 84 000 0000',
              'Endereço: Av. Julius Nyerere, Maputo',
              'Horário: Segunda a Sexta, 8h-17h',
            ]}
          />

          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Ionicons name="lock-closed" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.footerTitle}>Seu Direito à Privacidade</Text>
            <Text style={styles.footerText}>
              Estamos comprometidos em proteger suas informações pessoais e garantir
              transparência em como as utilizamos. Sua confiança é fundamental para nós.
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

function SubSection({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>{title}</Text>
      <View style={styles.itemsList}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.bullet} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
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
  intro: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  introText: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
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
  subsection: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  subsectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subsectionContent: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
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