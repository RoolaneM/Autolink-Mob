import AlertCard from '@/components/AlertCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../../components/AuthInput';
import ImageUpload from '../../components/ImageUpload';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';

export default function RegistroClienteScreen() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nomeCompleto: '',
        telefone: '',
        email: '',
        morada: '',
    });

    const [images, setImages] = useState<{
        biFrente?: string;
        biVerso?: string;
        selfie?: string;
    }>({});

    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatPhoneNumber = (value: string) => {
        // Remove tudo que não é número
        let cleaned = value.replace(/\D/g, '');

        // Adiciona +258 se não tiver
        if (cleaned && !cleaned.startsWith('258')) {
            cleaned = '258' + cleaned;
        }

        // Limita a 12 dígitos (258 + 9 dígitos)
        if (cleaned.length > 12) {
            cleaned = cleaned.slice(0, 12);
        }

        // Formata: +258 84 XXX XXXX
        if (cleaned.length > 3) {
            return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`.trim();
        }

        return cleaned ? `+${cleaned}` : '';
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.nomeCompleto.trim()) {
            newErrors.nomeCompleto = 'Nome completo é obrigatório';
        }

        if (!form.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório';
        } else if (!/^\+258\s?\d{2}\s?\d{3}\s?\d{4}$/.test(form.telefone)) {
            newErrors.telefone = 'Formato inválido. Use +258 84 XXX XXXX';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!form.morada.trim()) {
            newErrors.morada = 'Morada é obrigatória';
        }

        if (!images.biFrente) {
            newErrors.biFrente = 'Foto da frente do BI é obrigatória';
        }

        if (!images.biVerso) {
            newErrors.biVerso = 'Foto do verso do BI é obrigatória';
        }

        if (!images.selfie) {
            newErrors.selfie = 'Selfie com BI é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        actions: [] as any[],
    });


    const handleSubmit = async () => {
        if (!validateForm()) {
            setAlertConfig({
                visible: true,
                title: 'Atenção',
                message: 'Por favor, preencha todos os campos obrigatórios.',
                actions: [
                    {
                        label: 'OK',
                        type: 'primary',
                        onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
                    },
                ],
            });
            return;
        }

        setLoading(true);

        try {
            // Simulação de envio - substitua pela sua API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setAlertConfig({
                visible: true,
                title: 'Sucesso',
                message: 'Registro concluído com sucesso!',
                actions: [
                    {
                        label: 'OK',
                        type: 'primary',
                        onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
                    },
                ],
            });
        } catch (error) {
            setAlertConfig({
                visible: true,
                title: 'Erro',
                message: 'Falha ao registar. Tente novamente.',
                actions: [
                    {
                        label: 'OK',
                        type: 'primary',
                        onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
                    },
                ],
            });

        };

        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <LinearGradient colors={
                        (Colors.gradientPrimary.length >= 2
                            ? Colors.gradientPrimary
                            : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
                    }
                        style={styles.header}
                    >
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
                        </TouchableOpacity>

                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="person-add" size={40} color={Colors.surface} />
                            </View>
                        </View>
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>
                            Registe-se e comece a comprar/vender carros hoje
                        </Text>
                    </LinearGradient>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

                        <AuthInput
                            label="Nome Completo"
                            value={form.nomeCompleto}
                            onChangeText={(text) => setForm({ ...form, nomeCompleto: text })}
                            placeholder="Ex: João António Muchanga"
                            icon="person-outline"
                            error={errors.nomeCompleto}
                        />

                        <AuthInput
                            label="Telefone"
                            value={form.telefone}
                            onChangeText={(text) =>
                                setForm({ ...form, telefone: formatPhoneNumber(text) })
                            }
                            placeholder="+258 84 123 4567"
                            keyboardType="phone-pad"
                            icon="call-outline"
                            error={errors.telefone}
                        />

                        <AuthInput
                            label="Email"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            placeholder="exemplo@dominio.co.mz"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="mail-outline"
                            error={errors.email}
                        />

                        <AuthInput
                            label="Morada"
                            value={form.morada}
                            onChangeText={(text) => setForm({ ...form, morada: text })}
                            placeholder="Bairro, Cidade, Província"
                            icon="location-outline"
                            error={errors.morada}
                        />

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Documentos de Verificação</Text>
                        <Text style={styles.sectionSubtitle}>
                            Para sua segurança, precisamos validar sua identidade
                        </Text>

                        <ImageUpload
                            label="BI (Frente)"
                            imageUri={images.biFrente}
                            onImagePick={(uri) => setImages({ ...images, biFrente: uri })}
                            onImageRemove={() => setImages({ ...images, biFrente: undefined })}
                            error={errors.biFrente}
                        />

                        <ImageUpload
                            label="BI (Verso)"
                            imageUri={images.biVerso}
                            onImagePick={(uri) => setImages({ ...images, biVerso: uri })}
                            onImageRemove={() => setImages({ ...images, biVerso: undefined })}
                            error={errors.biVerso}
                        />

                        <ImageUpload
                            label="Selfie com BI"
                            imageUri={images.selfie}
                            onImagePick={(uri) => setImages({ ...images, selfie: uri })}
                            onImageRemove={() => setImages({ ...images, selfie: undefined })}
                            error={errors.selfie}
                        />

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.surface} />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={22} color={Colors.surface} />
                                    <Text style={styles.submitButtonText}>Criar Conta Grátis</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.loginLink}>
                            <Text style={styles.loginText}>Já tem conta? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginLinkText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* AlertCard */}
                <AlertCard
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    actions={alertConfig.actions}
                    onClose={() =>
                        setAlertConfig((prev) => ({
                            ...prev,
                            visible: false,
                        }))
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
            alignItems: 'center',
            paddingVertical: Spacing.xxl,
            paddingHorizontal: Spacing.md,
            position: 'relative',
        },
        backButton: {
            position: 'absolute',
            top: Spacing.md,
            left: Spacing.md,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoContainer: {
            marginBottom: Spacing.md,
        },
        logoCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: FontSize.xxxl,
            fontWeight: FontWeight.bold,
            color: Colors.surface,
            marginBottom: Spacing.xs,
        },
        subtitle: {
            fontSize: FontSize.sm,
            color: Colors.surface,
            opacity: 0.95,
            textAlign: 'center',
        },
        formContainer: {
            backgroundColor: Colors.surface,
            borderTopLeftRadius: BorderRadius.xl * 2,
            borderTopRightRadius: BorderRadius.xl * 2,
            marginTop: -Spacing.lg,
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.xxl,
            paddingBottom: Spacing.xl,
        },
        sectionTitle: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.text,
            marginBottom: Spacing.sm,
        },
        sectionSubtitle: {
            fontSize: FontSize.sm,
            color: Colors.textSecondary,
            marginBottom: Spacing.md,
        },
        divider: {
            height: 1,
            backgroundColor: Colors.divider,
            marginVertical: Spacing.lg,
        },
        submitButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
            backgroundColor: Colors.primary,
            paddingVertical: Spacing.md + 2,
            borderRadius: BorderRadius.lg,
            marginTop: Spacing.lg,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        submitButtonText: {
            fontSize: FontSize.lg,
            fontWeight: FontWeight.bold,
            color: Colors.surface,
        },
        loginLink: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: Spacing.lg,
        },
        loginText: {
            fontSize: FontSize.sm,
            color: Colors.textSecondary,
        },
        loginLinkText: {
            fontSize: FontSize.sm,
            color: Colors.primary,
            fontWeight: FontWeight.semibold,
            textDecorationLine: 'underline',
        },
    });
}