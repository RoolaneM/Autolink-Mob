import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

export default function SelfieCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Animação de pulso contínua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Verificando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={
          (Colors.gradientPrimary.length >= 2
            ? Colors.gradientPrimary
            : ['#000000', '#FFFFFF']) as unknown as readonly [string, string, ...string[]]
        }
        style={styles.permissionContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContent}>
            <View style={styles.permissionIcon}>
              <Ionicons name="camera" size={64} color={Colors.surface} />
            </View>

            <Text style={styles.permissionTitle}>Acesso à Câmera Necessário</Text>
            <Text style={styles.permissionText}>
              Para verificar sua identidade, precisamos tirar uma selfie com seu documento de identidade.
            </Text>

            <View style={styles.permissionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.surface} />
                <Text style={styles.featureText}>Seus dados estão seguros</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="lock-closed" size={24} color={Colors.surface} />
                <Text style={styles.featureText}>Uso único para verificação</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Ionicons name="camera" size={20} color={Colors.primary} />
              <Text style={styles.permissionButtonText}>Permitir Acesso</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const startCountdown = () => {
    setCountdown(3);
    let count = 3;

    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      Alert.alert(
        'Foto Capturada!',
        'Deseja usar esta foto?',
        [
          {
            text: 'Tirar Novamente',
            style: 'cancel',
            onPress: () => setCapturing(false),
          },
          {
            text: 'Usar Foto',
            onPress: () => {
              router.back();
              // Passar URI da foto para a tela anterior
              router.setParams({ selfieUri: photo.uri });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
      setCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={28} color={Colors.surface} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Guia do Rosto */}
        <View style={styles.guideContainer}>
          <Animated.View
            style={[
              styles.faceGuide,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.guideCorner} />
            <View style={[styles.guideCorner, styles.guideCornerTopRight]} />
            <View style={[styles.guideCorner, styles.guideCornerBottomLeft]} />
            <View style={[styles.guideCorner, styles.guideCornerBottomRight]} />
          </Animated.View>

          <View style={styles.instructionsContainer}>
            <Ionicons name="information-circle" size={20} color={Colors.surface} />
            <Text style={styles.instructions}>
              Posicione seu rosto dentro da área e segure o BI ao lado
            </Text>
          </View>
        </View>

        {/* Countdown */}
        {countdown !== null && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.flashButton}>
              <Ionicons name="flash-off" size={24} color={Colors.surface} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, capturing && styles.captureButtonDisabled]}
              onPress={startCountdown}
              disabled={capturing}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton}>
              <Ionicons name="images" size={24} color={Colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.captureHint}>
            Toque para capturar com timer de 3 segundos
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 260,
    height: 340,
    borderRadius: 130,
    position: 'relative',
  },
  guideCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.success,
    borderTopLeftRadius: 130,
  },
  guideCornerTopRight: {
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 130,
  },
  guideCornerBottomLeft: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 130,
  },
  guideCornerBottomRight: {
    top: undefined,
    left: undefined,
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 130,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    maxWidth: '85%',
  },
  instructions: {
    flex: 1,
    color: Colors.surface,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.success,
  },
  countdownText: {
    fontSize: 64,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  controls: {
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureHint: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  // Permission Screen
  permissionContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  permissionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  permissionFeatures: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  permissionButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  cancelText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    textDecorationLine: 'underline',
  },
});