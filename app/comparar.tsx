import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import useCarStore from '../store/useCarStore';
import { Car } from '../types';

export default function CompararScreen() {
    const router = useRouter();
    const { carros } = useCarStore();

    const [carrosSelecionados, setCarrosSelecionados] = useState<Car[]>([]);
    const [mostrarSelecao, setMostrarSelecao] = useState(true);

    const adicionarCarro = (car: Car) => {
        if (carrosSelecionados.length >= 3) {
            Alert.alert('Limite atingido', 'Você pode comparar no máximo 3 carros.');
            return;
        }
        if (carrosSelecionados.find((c) => c.id === car.id)) {
            return;
        }
        setCarrosSelecionados([...carrosSelecionados, car]);
    };

    const removerCarro = (carId: string) => {
        setCarrosSelecionados(carrosSelecionados.filter((c) => c.id !== carId));
    };

    const formatPrice = (price: number) =>
        price.toLocaleString('pt-MZ', {
            style: 'currency',
            currency: 'MZN',
        });

    const formatKm = (km: number) => `${(km / 1000).toFixed(0)} mil km`;

    const compararValor = (valores: number[], index: number) => {
        const valor = valores[index];
        const max = Math.max(...valores);
        const min = Math.min(...valores);

        if (valor === max && valor !== min) return 'melhor';
        if (valor === min && valor !== max) return 'pior';
        return 'neutro';
    };

    const renderComparacao = () => {
        if (carrosSelecionados.length < 2) {
            return (
                <View style={styles.emptyComparison}>
                    <Ionicons name="git-compare-outline" size={64} color={Colors.textLight} />
                    <Text style={styles.emptyText}>
                        Selecione pelo menos 2 carros para comparar
                    </Text>
                </View>
            );
        }

        const specs = [
            { label: 'Preço', key: 'preco', format: formatPrice, inverso: true },
            { label: 'Ano', key: 'ano', format: (v: number) => v.toString() },
            { label: 'Quilometragem', key: 'quilometragem', format: formatKm, inverso: true },
            { label: 'Combustível', key: 'combustivel' },
            { label: 'Transmissão', key: 'transmissao' },
            { label: 'Cor', key: 'cor' },
            { label: 'Portas', key: 'portas', format: (v: number) => `${v} portas` },
            { label: 'Categoria', key: 'categoria' },
        ];

        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.comparisonTable}>
                    {/* Cabeçalho - Labels */}
                    <View style={styles.labelColumn}>
                        <View style={styles.carHeaderCell} />
                        {specs.map((spec, idx) => (
                            <View key={idx} style={styles.labelCell}>
                                <Text style={styles.labelText}>{spec.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Colunas de Carros */}
                    {carrosSelecionados.map((car, carIndex) => (
                        <View key={car.id} style={styles.carColumn}>
                            {/* Header com imagem do carro */}
                            <View style={styles.carHeaderCell}>
                                <Image
                                    source={{ uri: car.imagemPrincipal }}
                                    style={styles.carImage}
                                />
                                <Text style={styles.carName} numberOfLines={2}>
                                    {car.marca} {car.modelo}
                                </Text>
                                <Text style={styles.carYear}>{car.ano}</Text>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removerCarro(car.id)}
                                >
                                    <Ionicons name="close-circle" size={24} color={Colors.error} />
                                </TouchableOpacity>
                            </View>

                            {/* Specs */}
                            {specs.map((spec, specIndex) => {
                                const valor = (car as any)[spec.key];
                                const valores = carrosSelecionados.map((c) => (c as any)[spec.key]);

                                let comparacao = 'neutro';
                                if (typeof valor === 'number' && spec.format) {
                                    comparacao = compararValor(
                                        valores as number[],
                                        carIndex
                                    );
                                    if (spec.inverso) {
                                        comparacao = comparacao === 'melhor' ? 'pior' :
                                            comparacao === 'pior' ? 'melhor' : 'neutro';
                                    }
                                }

                                return (
                                    <View
                                        key={specIndex}
                                        style={[
                                            styles.valueCell,
                                            comparacao === 'melhor' && styles.valueCellBest,
                                            comparacao === 'pior' && styles.valueCellWorst,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.valueText,
                                                comparacao === 'melhor' && styles.valueTextBest,
                                                comparacao === 'pior' && styles.valueTextWorst,
                                            ]}
                                        >
                                            {spec.format ? spec.format(valor) : valor}
                                        </Text>
                                        {comparacao === 'melhor' && (
                                            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Comparar Carros</Text>
                <TouchableOpacity onPress={() => setMostrarSelecao(!mostrarSelecao)}>
                    <Ionicons
                        name={mostrarSelecao ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={Colors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Carros Selecionados */}
            <View style={styles.selectedCarsBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[0, 1, 2].map((index) => {
                        const car = carrosSelecionados[index];
                        return (
                            <View key={index} style={styles.selectedSlot}>
                                {car ? (
                                    <>
                                        <Image
                                            source={{ uri: car.imagemPrincipal }}
                                            style={styles.selectedCarImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeSmallButton}
                                            onPress={() => removerCarro(car.id)}
                                        >
                                            <Ionicons name="close" size={16} color={Colors.surface} />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <View style={styles.emptySlot}>
                                        <Ionicons name="add" size={32} color={Colors.textLight} />
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Seleção de Carros */}
            {mostrarSelecao && (
                <View style={styles.selectionSection}>
                    <Text style={styles.selectionTitle}>Selecione os carros</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {carros.map((car) => (
                            <TouchableOpacity
                                key={car.id}
                                style={[
                                    styles.carCard,
                                    carrosSelecionados.find((c) => c.id === car.id) &&
                                    styles.carCardSelected,
                                ]}
                                onPress={() => adicionarCarro(car)}
                            >
                                <Image source={{ uri: car.imagemPrincipal }} style={styles.cardImage} />
                                <Text style={styles.cardTitle} numberOfLines={1}>
                                    {car.marca} {car.modelo}
                                </Text>
                                <Text style={styles.cardPrice}>{formatPrice(car.preco)}</Text>
                                {carrosSelecionados.find((c) => c.id === car.id) && (
                                    <View style={styles.selectedBadge}>
                                        <Ionicons name="checkmark" size={16} color={Colors.surface} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Tabela de Comparação */}
            <View style={styles.comparisonSection}>{renderComparacao()}</View>
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
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.text,
    },
    selectedCarsBar: {
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    selectedSlot: {
        width: 100,
        height: 80,
        marginRight: Spacing.sm,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    selectedCarImage: {
        width: '100%',
        height: '100%',
    },
    emptySlot: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    removeSmallButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: Colors.error,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionSection: {
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    selectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    carCard: {
        width: 140,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        marginLeft: Spacing.md,
        overflow: 'hidden',
        position: 'relative',
    },
    carCardSelected: {
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    cardImage: {
        width: '100%',
        height: 100,
    },
    cardTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        padding: Spacing.sm,
    },
    cardPrice: {
        fontSize: FontSize.xs,
        color: Colors.primary,
        fontWeight: FontWeight.bold,
        paddingHorizontal: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    selectedBadge: {
        position: 'absolute',
        top: Spacing.xs,
        right: Spacing.xs,
        backgroundColor: Colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    comparisonSection: {
        flex: 1,
    },
    emptyComparison: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        fontSize: FontSize.lg,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.md,
    },
    comparisonTable: {
        flexDirection: 'row',
        padding: Spacing.md,
    },
    labelColumn: {
        width: 120,
    },
    carColumn: {
        width: 150,
        marginLeft: Spacing.sm,
    },
    carHeaderCell: {
        height: 200,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.sm,
        marginBottom: Spacing.sm,
        position: 'relative',
    },
    carImage: {
        width: '100%',
        height: 100,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    carName: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.text,
        marginBottom: 4,
    },
    carYear: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    removeButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
    },
    labelCell: {
        height: 50,
        justifyContent: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    labelText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
    },
    valueCell: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.xs,
        flexDirection: 'row',
        gap: 4,
    },
    valueCellBest: {
        backgroundColor: '#E8F5E9',
    },
    valueCellWorst: {
        backgroundColor: '#FFEBEE',
    },
    valueText: {
        fontSize: FontSize.sm,
        color: Colors.text,
        textAlign: 'center',
    },
    valueTextBest: {
        color: Colors.success,
        fontWeight: FontWeight.semibold,
    },
    valueTextWorst: {
        color: Colors.error,
    },
});