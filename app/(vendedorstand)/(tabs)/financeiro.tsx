import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatCard from '../../../components/StatCard'; // ✅ IMPORTAR
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';

interface FinanceiroData {
    totalVendas: number;
    vendasMes: number;
    comissoes: number;
    pendentes: number;
    carrosAtivos: number;
    visualizacoes: number;
}

interface Transacao {
    id: string;
    tipo: 'venda' | 'comissao' | 'assinatura';
    descricao: string;
    valor: number;
    data: Date;
    status: 'concluida' | 'pendente' | 'cancelada';
}

const MOCK_FINANCEIRO: FinanceiroData = {
    totalVendas: 15,
    vendasMes: 3,
    comissoes: 125000,
    pendentes: 25000,
    carrosAtivos: 12,
    visualizacoes: 3400,
};

const MOCK_TRANSACOES: Transacao[] = [
    {
        id: '1',
        tipo: 'venda',
        descricao: 'Toyota Corolla 2020',
        valor: 1500000,
        data: new Date(2026, 1, 10),
        status: 'concluida',
    },
    {
        id: '2',
        tipo: 'comissao',
        descricao: 'Comissão da venda',
        valor: -75000,
        data: new Date(2026, 1, 10),
        status: 'concluida',
    },
    {
        id: '3',
        tipo: 'venda',
        descricao: 'Honda Civic 2019',
        valor: 1200000,
        data: new Date(2026, 1, 5),
        status: 'concluida',
    },
];

export default function FinanceiroScreen() {
    const [data, setData] = useState<FinanceiroData>(MOCK_FINANCEIRO);
    const [transacoes, setTransacoes] = useState<Transacao[]>(MOCK_TRANSACOES);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-MZ', {
            style: 'currency',
            currency: 'MZN',
            maximumFractionDigits: 0,
        });
    };

    const getTransacaoIcon = (tipo: string) => {
        switch (tipo) {
            case 'venda':
                return { name: 'cart', color: Colors.success };
            case 'comissao':
                return { name: 'trending-down', color: Colors.warning };
            case 'assinatura':
                return { name: 'diamond', color: Colors.primary };
            default:
                return { name: 'cash', color: Colors.text };
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
            >
                {/* Header */}
                <LinearGradient
                    colors={
                        (Colors.gradientPrimary.length >= 2
                            ? Colors.gradientPrimary
                            : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
                    }
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>Financeiro</Text>
                            <Text style={styles.headerSubtitle}>Visão geral do seu desempenho</Text>
                        </View>
                        <TouchableOpacity style={styles.exportButton}>
                            <Ionicons name="download-outline" size={20} color={Colors.surface} />
                        </TouchableOpacity>
                    </View>

                    {/* Total Balance */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Saldo Total</Text>
                        <Text style={styles.balanceValue}>{formatCurrency(data.comissoes)}</Text>
                        <Text style={styles.balancePending}>
                            {formatCurrency(data.pendentes)} pendente
                        </Text>
                    </View>
                </LinearGradient>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {['mes', 'trimestre', 'ano'].map((period) => (
                        <TouchableOpacity
                            key={period}
                            style={[
                                styles.periodButton,
                                selectedPeriod === period && styles.periodButtonActive,
                            ]}
                            onPress={() => setSelectedPeriod(period as any)}
                        >
                            <Text
                                style={[
                                    styles.periodButtonText,
                                    selectedPeriod === period && styles.periodButtonTextActive,
                                ]}
                            >
                                {period === 'mes' ? 'Mês' : period === 'trimestre' ? 'Trimestre' : 'Ano'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats Grid - USANDO StatCard ✨ */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsGrid}>
                        <StatCard
                            icon="cart"
                            label="Vendas Totais"
                            value={data.totalVendas.toString()}
                            color={Colors.success}
                            trend="+12%"
                        />
                        <StatCard
                            icon="trending-up"
                            label="Vendas (mês)"
                            value={data.vendasMes.toString()}
                            color={Colors.primary}
                            trend="+23%"
                        />
                        <StatCard
                            icon="car-sport"
                            label="Carros Ativos"
                            value={data.carrosAtivos.toString()}
                            color={Colors.info}
                            trend="+5%"
                        />
                        <StatCard
                            icon="eye"
                            label="Visualizações"
                            value={data.visualizacoes.toString()}
                            color={Colors.warning}
                            trend="+18%"
                        />
                    </View>

                </View>

                {/* Chart Section */}
                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionTitle}>Desempenho de Vendas</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>Ver tudo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chartPlaceholder}>
                        <Ionicons name="bar-chart" size={48} color={Colors.textLight} />
                        <Text style={styles.chartPlaceholderText}>
                            Gráfico de vendas (implementar com biblioteca)
                        </Text>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View style={styles.transacoesSection}>
                    <View style={styles.transacoesHeader}>
                        <Text style={styles.sectionTitle}>Transações Recentes</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>

                    {transacoes.map((transacao) => {
                        const icon = getTransacaoIcon(transacao.tipo);
                        const isNegative = transacao.valor < 0;

                        return (
                            <View key={transacao.id} style={styles.transacaoCard}>
                                <View style={[styles.transacaoIcon, { backgroundColor: `${icon.color}20` }]}>
                                    <Ionicons name={icon.name as any} size={24} color={icon.color} />
                                </View>

                                <View style={styles.transacaoInfo}>
                                    <Text style={styles.transacaoDescricao}>{transacao.descricao}</Text>
                                    <Text style={styles.transacaoData}>
                                        {transacao.data.toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                        })}
                                    </Text>
                                </View>

                                <View style={styles.transacaoRight}>
                                    <Text
                                        style={[
                                            styles.transacaoValor,
                                            isNegative ? styles.transacaoValorNegative : styles.transacaoValorPositive,
                                        ]}
                                    >
                                        {isNegative ? '' : '+'}
                                        {formatCurrency(Math.abs(transacao.valor))}
                                    </Text>
                                    <View
                                        style={[
                                            styles.transacaoStatus,
                                            transacao.status === 'concluida' && styles.statusConcluida,
                                            transacao.status === 'pendente' && styles.statusPendente,
                                        ]}
                                    >
                                        <Text style={styles.statusText}>
                                            {transacao.status === 'concluida' ? 'Concluída' : 'Pendente'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ❌ REMOVER função StatCard inline

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: Spacing.lg,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    headerTitle: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.surface,
        opacity: 0.9,
        marginTop: Spacing.xs,
    },
    exportButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceCard: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
    },
    balanceLabel: {
        fontSize: FontSize.sm,
        color: Colors.surface,
        opacity: 0.9,
        marginBottom: Spacing.xs,
    },
    balanceValue: {
        fontSize: FontSize.xxxl + 4,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        marginBottom: Spacing.xs,
    },
    balancePending: {
        fontSize: FontSize.sm,
        color: Colors.surface,
        opacity: 0.8,
    },
    periodSelector: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    periodButton: {
        flex: 1,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: Colors.primary,
    },
    periodButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textSecondary,
    },
    periodButtonTextActive: {
        color: Colors.surface,
    },
    /*     statsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: Spacing.md,
            gap: Spacing.sm,
        }, */
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    // ❌ REMOVER: statCard, statIcon, statValue, statLabel
    chartSection: {
        padding: Spacing.md,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.text,
    },
    statsContainer: {
        padding: Spacing.md,
    },
    viewAllText: {
        fontSize: FontSize.sm,
        color: Colors.primary,
        fontWeight: FontWeight.semibold,
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartPlaceholderText: {
        marginTop: Spacing.sm,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    transacoesSection: {
        padding: Spacing.md,
    },
    transacoesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    transacaoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    transacaoIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    transacaoInfo: {
        flex: 1,
    },
    transacaoDescricao: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        marginBottom: 2,
    },
    transacaoData: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    transacaoRight: {
        alignItems: 'flex-end',
    },
    transacaoValor: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        marginBottom: 4,
    },
    transacaoValorPositive: {
        color: Colors.success,
    },
    transacaoValorNegative: {
        color: Colors.error,
    },
    transacaoStatus: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    statusConcluida: {
        backgroundColor: `${Colors.success}20`,
    },
    statusPendente: {
        backgroundColor: `${Colors.warning}20`,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
});