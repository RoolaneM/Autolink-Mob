import AlertCard from '@/components/AlertCard';
import CarDetails from '@/components/CarDetails';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import useCarStore from '../store/useCarStore';
import { Car } from '../types';

export default function DetalhesPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { carros, toggleFavorito, isFavorito, loadCarros } = useCarStore();
    const [car, setCar] = useState<Car | undefined>(undefined);

    // Carrega carros se ainda não tiver
    useEffect(() => {
        console.log(JSON.stringify(carros, null, 2));
        if (carros.length === 0) {
            loadCarros();
        }
    }, [carros, loadCarros]);

    // Atualiza carro quando carros da store mudarem
    useEffect(() => {
        const foundCar = carros.find((item) => item.id === id);
        setCar(foundCar);
    }, [carros, id]);

    // Configuração do alert
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        actions: [] as any[],
    });

    // Handlers
    const handleChat = () => {
        if (!car) return;
        router.push({ pathname: '/mensagem/chatvendedor', params: { id: car.id } });
    };

    /*   const handleWhatsApp = () => {
          if (!car) return;
          const message = `Olá! Tenho interesse no ${car.marca} ${car.modelo} ${car.ano}. Poderia me dar mais informações?`;
          const url = `https://wa.me/${car.vendedor.whatsapp}?text=${encodeURIComponent(message)}`;
          Linking.openURL(url);
      }; */

    const handleCall = () => {
        if (!car) return;
        Linking.openURL(`tel:${car.vendedor.telefone}`);
    };

    const handleTestDrive = () => {
        if (!car) return;
        router.push({ pathname: '/agendamento', params: { carId: car.id } });
    };

    const handleFinanciamento = () => {
        if (!car) return;
        router.push({ pathname: '/financiamento', params: { carId: car.id } });
    };

    const handleShare = async () => {
        if (!car) return;
        try {
            await Share.share({
                message: `Confira este ${car.marca} ${car.modelo} ${car.ano} por ${car.preco.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}`,
                title: `${car.marca} ${car.modelo}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handlePedido = () => {
        if (!car) return;
        setAlertConfig({
            visible: true,
            title: 'Fazer Pedido',
            message: `Deseja fazer um pedido para o ${car.marca} ${car.modelo}?`,
            actions: [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar' },
            ],
        });
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTransparent: true,
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                                <Ionicons name="share-outline" size={24} color={Colors.surface} />
                            </TouchableOpacity>
                            {car && (
                                <TouchableOpacity style={styles.headerButton} onPress={() => toggleFavorito(car.id)}>
                                    <Ionicons
                                        name={isFavorito(car.id) ? 'heart' : 'heart-outline'}
                                        size={24}
                                        color={isFavorito(car.id) ? Colors.favorite : Colors.surface}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    ),
                }}
            />

            <View style={styles.container}>
                {!car ? (
                    <View style={styles.notFound}>
                        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
                        <Text style={styles.notFoundText}>Carro não encontrado</Text>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Text style={styles.backButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <CarDetails car={car} />

                        {/* Ações Rápidas */}
                        {/* <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.quickActionButton} onPress={handleTestDrive}>
                                <View style={styles.quickActionIcon}>
                                    <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
                                </View>
                                <Text style={styles.quickActionText}>Test Drive</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.quickActionButton} onPress={handleFinanciamento}>
                                <View style={styles.quickActionIcon}>
                                    <Ionicons name="calculator-outline" size={24} color={Colors.primary} />
                                </View>
                                <Text style={styles.quickActionText}>Financiar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.quickActionButton} onPress={handleCall}>
                                <View style={styles.quickActionIcon}>
                                    <Ionicons name="call-outline" size={24} color={Colors.primary} />
                                </View>
                                <Text style={styles.quickActionText}>Ligar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.quickActionButton} onPress={handleShare}>
                                <View style={styles.quickActionIcon}>
                                    <Ionicons name="share-social-outline" size={24} color={Colors.primary} />
                                </View>
                                <Text style={styles.quickActionText}>Compartilhar</Text>
                            </TouchableOpacity>
                        </View> */}

                        <View style={{ height: 120 }} />
                    </ScrollView>
                )}

                {/* Bottom Buttons */}
                {car && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.chatButton} onPress={handleChat} activeOpacity={0.8}>
                            <Ionicons name="chatbubbles" size={20} color={Colors.surface} />
                            <Text style={styles.buttonText}>Chat</Text>
                        </TouchableOpacity>

                        {/*      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp} activeOpacity={0.8}>
                            <Ionicons name="logo-whatsapp" size={20} color={Colors.surface} />
                            <Text style={styles.buttonText}>WhatsApp</Text>
                        </TouchableOpacity>
                                */}
                        <TouchableOpacity style={styles.orderButton} onPress={handlePedido} activeOpacity={0.8}>
                            <Ionicons name="cart" size={20} color={Colors.surface} />
                            <Text style={styles.buttonText}>Pedido</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <AlertCard
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                actions={alertConfig.actions}
                onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginRight: Spacing.sm,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: Spacing.xl,
    },
    notFoundText: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.semibold,
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
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.lg,
        marginTop: Spacing.md,
    },
    quickActionButton: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickActionText: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        fontWeight: FontWeight.medium,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    chatButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.secondary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    /*     whatsappButton: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#25D366',
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.xs,
        }, */
    orderButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    buttonText: {
        color: Colors.surface,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
});
