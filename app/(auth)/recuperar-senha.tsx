import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../../components/AuthInput';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { api } from '../../services/api';

type Step = 'request' | 'reset' | 'success';

export default function RecuperarSenhaScreen() {
    const [step, setStep] = useState<Step>('request');
    const [identifier, setIdentifier] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ identifier?: string; token?: string; password?: string }>({});

    // Animação
    const fadeAnim = new Animated.Value(1);

    const animateTransition = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const validateRequest = () => {
        const newErrors: any = {};
        if (!identifier.trim()) {
            newErrors.identifier = 'Campo obrigatório';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateReset = () => {
        const newErrors: any = {};
        if (!token.trim()) {
            newErrors.token = 'Código é obrigatório';
        }
        if (!newPassword.trim()) {
            newErrors.password = 'Nova senha é obrigatória';
        } else if (newPassword.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleRequestReset() {
        if (!validateRequest()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/auth/forgot-password', { identifier });
            Alert.alert('Código Enviado!', data.message || 'Verifique seu email ou SMS.');
            animateTransition();
            setStep('reset');
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.message || 'Não foi possível enviar o código.');
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword() {
        if (!validateReset()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/auth/reset-password', {
                identifier,
                token,
                newPassword,
            });

            animateTransition();
            setStep('success');

            // Redireciona após 2 segundos
            setTimeout(() => {
                router.replace('/login');
            }, 2000);
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.message || 'Código inválido ou expirado.');
        } finally {
            setLoading(false);
        }
    }

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step !== 'request' && styles.stepDotActive]}>
                {step !== 'request' && <Ionicons name="checkmark" size={12} color={Colors.surface} />}
            </View>
            <View style={[styles.stepLine, step === 'success' && styles.stepLineActive]} />
            <View style={[styles.stepDot, step === 'success' && styles.stepDotActive]}>
                {step === 'success' && <Ionicons name="checkmark" size={12} color={Colors.surface} />}
            </View>
        </View>
    );

    return (
        <LinearGradient colors={
            (Colors.gradientPrimary.length >= 2
                ? Colors.gradientPrimary
                : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
        } style={styles.gradient}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.surface} />
                    </TouchableOpacity>

                    {renderStepIndicator()}

                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        {step === 'request' && (
                            <>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="lock-closed" size={64} color={Colors.surface} />
                                </View>

                                <Text style={styles.title}>Esqueceu a Senha?</Text>
                                <Text style={styles.subtitle}>
                                    Informe seu email ou telefone e enviaremos um código de recuperação
                                </Text>

                                <View style={styles.form}>
                                    <AuthInput
                                        label="Email ou Telefone"
                                        value={identifier}
                                        onChangeText={setIdentifier}
                                        placeholder="exemplo@email.com ou 84 000 0000"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        icon="mail-outline"
                                        error={errors.identifier}
                                    />

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleRequestReset}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={Colors.primary} />
                                        ) : (
                                            <>
                                                <Ionicons name="send" size={20} color={Colors.primary} />
                                                <Text style={styles.buttonText}>Enviar Código</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {step === 'reset' && (
                            <>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="key" size={64} color={Colors.surface} />
                                </View>

                                <Text style={styles.title}>Digite o Código</Text>
                                <Text style={styles.subtitle}>
                                    Enviamos um código de 6 dígitos para {identifier}
                                </Text>

                                <View style={styles.form}>
                                    <AuthInput
                                        label="Código de Verificação"
                                        value={token}
                                        onChangeText={setToken}
                                        placeholder="000000"
                                        keyboardType="number-pad"
                                        icon="shield-checkmark-outline"
                                        error={errors.token}
                                    />

                                    <AuthInput
                                        label="Nova Senha"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="••••••••"
                                        secureTextEntry
                                        icon="lock-closed-outline"
                                        error={errors.password}
                                    />

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleResetPassword}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={Colors.primary} />
                                        ) : (
                                            <>
                                                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                                                <Text style={styles.buttonText}>Redefinir Senha</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.resendButton}
                                        onPress={handleRequestReset}
                                    >
                                        <Text style={styles.resendText}>Não recebeu o código? Reenviar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {step === 'success' && (
                            <>
                                <View style={styles.successIconContainer}>
                                    <Ionicons name="checkmark-circle" size={120} color={Colors.success} />
                                </View>

                                <Text style={styles.successTitle}>Senha Redefinida!</Text>
                                <Text style={styles.successSubtitle}>
                                    Sua senha foi alterada com sucesso. Redirecionando para o login...
                                </Text>

                                <ActivityIndicator
                                    size="large"
                                    color={Colors.surface}
                                    style={styles.successLoader}
                                />
                            </>
                        )}
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xxl,
    },
    stepDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    stepDotActive: {
        backgroundColor: Colors.success,
        borderColor: Colors.success,
    },
    stepLine: {
        width: 60,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    stepLineActive: {
        backgroundColor: Colors.success,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.md,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xxl,
        paddingHorizontal: Spacing.md,
    },
    form: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl * 2,
        padding: Spacing.lg,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.surface,
        borderWidth: 2,
        borderColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.sm,
    },
    buttonText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    resendButton: {
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    resendText: {
        fontSize: FontSize.sm,
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    successIconContainer: {
        marginBottom: Spacing.lg,
    },
    successTitle: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: FontSize.md,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.md,
    },
    successLoader: {
        marginTop: Spacing.xl,
    },
});