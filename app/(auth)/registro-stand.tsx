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

export default function RegistroStandScreen() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        nomeStand: '',
        nuit: '',
        endereco: '',
        contacto: '',
    });

    const [images, setImages] = useState<{
        alvara?: string;
        biFrente?: string;
        biVerso?: string;
    }>({});

    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatPhoneNumber = (value: string) => {
        let cleaned = value.replace(/\D/g, '');
        if (cleaned && !cleaned.startsWith('258')) {
            cleaned = '258' + cleaned;
        }
        if (cleaned.length > 12) {
            cleaned = cleaned.slice(0, 12);
        }
        if (cleaned.length > 3) {
            return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`.trim();
        }
        return cleaned ? `+${cleaned}` : '';
    };

    const formatNUIT = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.slice(0, 9);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) newErrors.name = 'Nome do responsável é obrigatório';
        if (!form.email.trim()) newErrors.email = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido';
        if (!form.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!form.nomeStand.trim()) newErrors.nomeStand = 'Nome do stand é obrigatório';
        if (!form.nuit.trim()) newErrors.nuit = 'NUIT é obrigatório';
        else if (form.nuit.length !== 9) newErrors.nuit = 'NUIT deve ter 9 dígitos';
        if (!form.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
        if (!form.contacto.trim()) newErrors.contacto = 'Contacto adicional é obrigatório';

        if (!images.alvara) newErrors.alvara = 'Alvará é obrigatório';
        if (!images.biFrente) newErrors.biFrente = 'BI (frente) é obrigatório';
        if (!images.biVerso) newErrors.biVerso = 'BI (verso) é obrigatório';

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
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setAlertConfig({
                visible: true,
                title: 'Registro Enviado!',
                message: 'Aguarde aprovação da equipa. Entraremos em contacto em breve.',
                actions: [
                    {
                        label: 'OK',
                        type: 'primary',
                        onPress: () => {
                            setAlertConfig({ ...alertConfig, visible: false });
                            router.replace('/login');
                        },
                    },
                ]
            });
        } catch (error) {
            setAlertConfig({
                visible: true,
                title: 'Erro',
                message: 'Falha ao registar o stand. Tente novamente.',
                actions: [
                    {
                        label: 'OK',
                        type: 'primary',
                        onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
                    },
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={
                    (Colors.gradientPrimary.length >= 2
                        ? Colors.gradientPrimary
                        : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
                }
                    style={styles.header}
                >
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.surface} />
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="storefront" size={40} color={Colors.surface} />
                        </View>
                    </View>
                    <Text style={styles.title}>Registo de Stand</Text>
                    <Text style={styles.subtitle}>
                        Torne-se parceiro da maior plataforma de carros em Moçambique
                    </Text>
                </LinearGradient>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Dados do Responsável</Text>

                    <AuthInput
                        label="Nome do Responsável"
                        value={form.name}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                        placeholder="Ex: Maria José"
                        icon="person-outline"
                        error={errors.name}
                    />

                    <AuthInput
                        label="Email"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                        placeholder="stand@exemplo.co.mz"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon="mail-outline"
                        error={errors.email}
                    />

                    <AuthInput
                        label="Telefone"
                        value={form.phone}
                        onChangeText={(text) => setForm({ ...form, phone: formatPhoneNumber(text) })}
                        placeholder="+258 84 123 4567"
                        keyboardType="phone-pad"
                        icon="call-outline"
                        error={errors.phone}
                    />

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Dados do Stand</Text>

                    <AuthInput
                        label="Nome do Stand"
                        value={form.nomeStand}
                        onChangeText={(text) => setForm({ ...form, nomeStand: text })}
                        placeholder="Ex: Auto Stand Maputo"
                        icon="storefront-outline"
                        error={errors.nomeStand}
                    />

                    <AuthInput
                        label="NUIT"
                        value={form.nuit}
                        onChangeText={(text) => setForm({ ...form, nuit: formatNUIT(text) })}
                        placeholder="123456789"
                        keyboardType="number-pad"
                        icon="card-outline"
                        error={errors.nuit}
                    />

                    <AuthInput
                        label="Endereço"
                        value={form.endereco}
                        onChangeText={(text) => setForm({ ...form, endereco: text })}
                        placeholder="Av. 24 de Julho, Maputo"
                        icon="location-outline"
                        error={errors.endereco}
                    />

                    <AuthInput
                        label="Contacto Adicional"
                        value={form.contacto}
                        onChangeText={(text) => setForm({ ...form, contacto: text })}
                        placeholder="WhatsApp ou telefone alternativo"
                        keyboardType="phone-pad"
                        icon="chatbubbles-outline"
                        error={errors.contacto}
                    />

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Documentos Obrigatórios</Text>

                    <ImageUpload
                        label="Alvará / Licença"
                        imageUri={images.alvara}
                        onImagePick={(uri) => setImages({ ...images, alvara: uri })}
                        onImageRemove={() => setImages({ ...images, alvara: undefined })}
                        error={errors.alvara}
                    />

                    <ImageUpload
                        label="BI do Responsável (Frente)"
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

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
                        <View style={styles.infoBoxText}>
                            <Text style={styles.infoBoxTitle}>Importante</Text>
                            <Text style={styles.infoBoxDescription}>
                                • Seu registro será analisado pela nossa equipe{'\n'}
                                • Você será notificado por email e SMS{'\n'}
                                • O processo leva até 48 horas úteis
                            </Text>
                        </View>
                    </View>

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
                                <Text style={styles.submitButtonText}>Registrar Stand</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginLink}>
                        <Text style={styles.loginText}>Já tem um stand registado? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLinkText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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

// Usar os mesmos estilos da tela de registro-cliente
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
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F8FF',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: Colors.info,
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    infoBoxText: {
        flex: 1,
    },
    infoBoxTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    infoBoxDescription: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
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