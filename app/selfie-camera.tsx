import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelfieCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Precisamos de acesso à câmera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    router.replace({
      pathname: '/registro-vendedor',
      params: { selfieUri: photo.uri },
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      {/* Overlay guia */}
      <View style={styles.overlay}>
        <View style={styles.faceGuide} />
        <Text style={styles.instructions}>
          Posicione seu rosto dentro do círculo e segure o BI ao lado do rosto
        </Text>
      </View>

      <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: 150,
  },
  faceGuide: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#00FFAA',
    marginBottom: 20,
  },
  instructions: {
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
