import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../../components/AuthInput';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {

    const { login, authenticateWithBiometrics } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'Email ou telefone é obrigatório';
        }

        if (!password.trim()) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBiometricLogin = async () => {
        if (!authenticateWithBiometrics) return;

        try {
            const success = await authenticateWithBiometrics();
            if (success) {
                // Se houver token e user salvos, restauramos
                const userData = await AsyncStorage.getItem('@autolink:user');
                const tokenData = await AsyncStorage.getItem('@autolink:token');

                if (userData && tokenData) {
                    // Pode usar diretamente a função de login do contexto ou setar o estado
                    await login(JSON.parse(userData).email, ''); // ⚠️ senha vazia ou token dependendo da API
                }
            } else {
                Alert.alert('Autenticação Biométrica', 'Falha na autenticação biométrica.');
            }
        } catch (err) {
            console.log('Erro biometria', err);
        }
    };


    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            await login(email, password);
            // O redirecionamento é feito automaticamente no AuthContext
        } catch (error: any) {

            console.log('ERRO LOGIN:', error);
            console.log('ERRO RESPONSE:', error.response);


            // Se houver falha, tentar biometria
            if (authenticateWithBiometrics) {
                handleBiometricLogin();
            }
            const status = error.response?.status;
            const message = error.response?.data?.message;

            // Tratar diferentes tipos de erro
            if (status === 403) {
                // Conta pendente de aprovação
                if (message?.toLowerCase().includes('stand')) {
                    router.push('/pendente-stand');
                } else if (message?.toLowerCase().includes('vendedor')) {
                    router.push('/pendente-vendedor');
                } else {
                    Alert.alert('Conta Pendente', message || 'Sua conta está aguardando aprovação.');
                }
            } else if (status === 401) {
                Alert.alert('Erro de Autenticação', 'Email ou senha incorretos.');
            } else {
                Alert.alert(
                    'Erro',
                    message || 'Não foi possível fazer login. Tente novamente.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <LinearGradient colors={
                    (Colors.gradientPrimary.length >= 2
                        ? Colors.gradientPrimary
                        : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
                }
                    style={styles.header}
                >
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="car-sport" size={48} color={Colors.surface} />
                        </View>
                    </View>
                    <Text style={styles.title}>AutoLinkMZ</Text>
                    <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
                </LinearGradient>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Entrar na Conta</Text>

                    <AuthInput
                        label="Email ou Telefone"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="exemplo@email.com ou 84 000 0000"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon="mail-outline"
                        error={errors.email}
                    />

                    <AuthInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                        icon="lock-closed-outline"
                        error={errors.password}
                    />

                    <TouchableOpacity
                        style={styles.forgotPassword}
                    /*     onPress={() => router.push('/recuperar-senha')} */
                    >
                        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.surface} />
                        ) : (
                            <>
                                <Ionicons name="log-in-outline" size={20} color={Colors.surface} />
                                <Text style={styles.loginButtonText}>Entrar</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.biometricButton}
                        onPress={handleBiometricLogin}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="finger-print-outline" size={20} color={Colors.surface} />
                        <Text style={styles.biometricButtonText}>Entrar com Biometria</Text>
                    </TouchableOpacity>


                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>ou</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Register Links */}
                    <View style={styles.registerSection}>
                        <Text style={styles.registerTitle}>Ainda não tem conta?</Text>

                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => router.push('/registro-cliente')}
                        >
                            <Ionicons name="person-add-outline" size={20} color={Colors.primary} />
                            <Text style={styles.registerButtonText}>Criar Conta de Cliente</Text>
                        </TouchableOpacity>

                        <View style={styles.sellerLinks}>
                            <Text style={styles.sellerText}>Você é vendedor?</Text>
                            <View style={styles.sellerButtons}>
                                <TouchableOpacity onPress={() => router.push('/registro-stand')}>
                                    <Text style={styles.sellerLink}>Registar Stand</Text>
                                </TouchableOpacity>
                                <Text style={styles.sellerSeparator}>•</Text>
                                <TouchableOpacity onPress={() => router.push('/registro-vendedor')}>
                                    <Text style={styles.sellerLink}>Vendedor Informal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl * 2,
        paddingHorizontal: Spacing.md,
    },
    logoContainer: {
        marginBottom: Spacing.lg,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: FontSize.xxxl + 8,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSize.md,
        color: Colors.surface,
        opacity: 0.95,
    },
    formContainer: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl * 2,
        borderTopRightRadius: BorderRadius.xl * 2,
        marginTop: -Spacing.lg,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.xl,
    },
    formTitle: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.bold,
        color: Colors.text,
        marginBottom: Spacing.lg,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: Spacing.lg,
    },
    forgotPasswordText: {
        fontSize: FontSize.sm,
        color: Colors.primary,
        fontWeight: FontWeight.semibold,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md + 2,
        borderRadius: BorderRadius.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        marginHorizontal: Spacing.md,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    registerSection: {
        alignItems: 'center',
    },
    registerTitle: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        width: '100%',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.surface,
    },
    registerButtonText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    sellerLinks: {
        marginTop: Spacing.lg,
        alignItems: 'center',
    },
    sellerText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    sellerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    sellerLink: {
        fontSize: FontSize.sm,
        color: Colors.primary,
        fontWeight: FontWeight.semibold,
        textDecorationLine: 'underline',
    },
    sellerSeparator: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    biometricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.secondary, // pode escolher outra cor
        paddingVertical: Spacing.md + 2,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.md,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    biometricButtonText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
    },

});