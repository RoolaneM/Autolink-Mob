import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

export default function SobreScreen() {
    const handleSocialMedia = (platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin') => {
        const urls = {
            facebook: 'https://facebook.com/autolinkmz',
            instagram: 'https://instagram.com/autolinkmz',
            twitter: 'https://twitter.com/autolinkmz',
            linkedin: 'https://linkedin.com/company/autolinkmz',
        };
        Linking.openURL(urls[platform]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <LinearGradient
                    colors={
                        (Colors.gradientPrimary.length >= 2
                            ? Colors.gradientPrimary
                            : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
                    }
                    style={styles.hero}
                >
                    <Ionicons name="car-sport" size={64} color={Colors.surface} />
                    <Text style={styles.heroTitle}>AutoLinkMZ</Text>
                    <Text style={styles.heroSubtitle}>
                        A maior plataforma de compra e venda de carros em Moçambique
                    </Text>
                    <Text style={styles.version}>Versão 1.0.0</Text>
                </LinearGradient>

                {/* Missão */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="rocket-outline" size={28} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Nossa Missão</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        Facilitar a compra e venda de veículos em Moçambique, conectando vendedores
                        e compradores de forma segura, transparente e eficiente. Queremos transformar
                        a experiência de negociação de carros no país.
                    </Text>
                </View>

                {/* Valores */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark-outline" size={28} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Nossos Valores</Text>
                    </View>

                    <View style={styles.valuesList}>
                        <ValueItem
                            icon="checkmark-circle"
                            title="Transparência"
                            description="Informações claras e honestas em todos os anúncios"
                        />
                        <ValueItem
                            icon="people"
                            title="Confiança"
                            description="Verificação rigorosa de vendedores e documentos"
                        />
                        <ValueItem
                            icon="flash"
                            title="Inovação"
                            description="Tecnologia de ponta para melhor experiência"
                        />
                        <ValueItem
                            icon="heart"
                            title="Compromisso"
                            description="Dedicados ao sucesso dos nossos usuários"
                        />
                    </View>
                </View>

                {/* Estatísticas */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Em Números</Text>
                    <View style={styles.statsGrid}>
                        <StatCard icon="car-sport" value="5000+" label="Carros" />
                        <StatCard icon="people" value="10k+" label="Usuários" />
                        <StatCard icon="storefront" value="200+" label="Stands" />
                        <StatCard icon="trending-up" value="98%" label="Satisfação" />
                    </View>
                </View>

                {/* Equipe */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="people-outline" size={28} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Nossa Equipe</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        Somos uma equipe apaixonada de profissionais moçambicanos dedicados a
                        revolucionar o mercado automóvel no país. Com experiência em tecnologia,
                        vendas e atendimento ao cliente, trabalhamos todos os dias para oferecer
                        o melhor serviço.
                    </Text>
                </View>

                {/* Contato */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="mail-outline" size={28} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Entre em Contato</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL('mailto:contato@autolinkmz.co.mz')}
                    >
                        <Ionicons name="mail" size={20} color={Colors.primary} />
                        <Text style={styles.contactText}>contato@autolinkmz.co.mz</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL('tel:+258840000000')}
                    >
                        <Ionicons name="call" size={20} color={Colors.primary} />
                        <Text style={styles.contactText}>+258 84 000 0000</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL('https://autolinkmz.co.mz')}
                    >
                        <Ionicons name="globe" size={20} color={Colors.primary} />
                        <Text style={styles.contactText}>www.autolinkmz.co.mz</Text>
                    </TouchableOpacity>
                </View>

                {/* Redes Sociais */}
                <View style={styles.socialSection}>
                    <Text style={styles.sectionTitle}>Siga-nos</Text>
                    <View style={styles.socialButtons}>
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
                            onPress={() => handleSocialMedia('facebook')}
                        >
                            <Ionicons name="logo-facebook" size={28} color={Colors.surface} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
                            onPress={() => handleSocialMedia('instagram')}
                        >
                            <Ionicons name="logo-instagram" size={28} color={Colors.surface} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                            onPress={() => handleSocialMedia('twitter')}
                        >
                            <Ionicons name="logo-twitter" size={28} color={Colors.surface} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#0A66C2' }]}
                            onPress={() => handleSocialMedia('linkedin')}
                        >
                            <Ionicons name="logo-linkedin" size={28} color={Colors.surface} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 AutoLinkMZ</Text>
                    <Text style={styles.footerSubtext}>
                        Todos os direitos reservados
                    </Text>
                    <Text style={styles.footerSubtext}>
                        Feito com ❤️ em Moçambique
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ValueItem({
    icon,
    title,
    description,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
}) {
    return (
        <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
                <Ionicons name={icon} size={24} color={Colors.primary} />
            </View>
            <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>{title}</Text>
                <Text style={styles.valueDescription}>{description}</Text>
            </View>
        </View>
    );
}

function StatCard({
    icon,
    value,
    label,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
}) {
    return (
        <View style={styles.statCard}>
            <Ionicons name={icon} size={32} color={Colors.primary} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl * 2,
        paddingHorizontal: Spacing.md,
    },
    heroTitle: {
        fontSize: FontSize.xxxl + 8,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    heroSubtitle: {
        fontSize: FontSize.md,
        color: Colors.surface,
        textAlign: 'center',
        opacity: 0.95,
        marginBottom: Spacing.md,
    },
    version: {
        fontSize: FontSize.sm,
        color: Colors.surface,
        opacity: 0.8,
    },
    section: {
        padding: Spacing.md,
        marginTop: Spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.text,
    },
    sectionText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    valuesList: {
        gap: Spacing.md,
    },
    valueItem: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    valueIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    valueContent: {
        flex: 1,
    },
    valueTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.text,
        marginBottom: 4,
    },
    valueDescription: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    statsSection: {
        padding: Spacing.md,
        marginTop: Spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        marginTop: Spacing.sm,
    },
    statLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    contactText: {
        fontSize: FontSize.md,
        color: Colors.text,
    },
    socialSection: {
        padding: Spacing.md,
        marginTop: Spacing.md,
        alignItems: 'center',
    },
    socialButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
        marginTop: Spacing.lg,
    },
    footerText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    footerSubtext: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 4,
    },
});