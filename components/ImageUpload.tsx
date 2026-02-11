import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import AlertCard from './AlertCard'; // <- seu componente de alerta custom

interface ImageUploadProps {
    label: string;
    imageUri?: string;
    onImagePick: (uri: string) => void;
    onImageRemove: () => void;
    onPress?: () => void; // 👈 ADICIONE ISSO
    error?: string;
}

export default function ImageUpload({
    label,
    imageUri,
    onImagePick,
    onImageRemove,
    error,
    onPress, // 👈 ADICIONE AQUI
}: ImageUploadProps) {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        actions: [] as any[],
        /*         actions: [] as { label: string; onPress?: () => void; type?: 'primary' | 'danger' }[], */
    });

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            setAlertConfig({
                visible: true,
                title: 'Permissão Negada',
                message: 'Precisamos de permissão para acessar suas fotos.',
                actions: [{ label: 'OK', onPress: () => setAlertConfig((prev) => ({ ...prev, visible: false })) }],
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const response = await fetch(uri);
            const blob = await response.blob();

            if (blob.size > 5 * 1024 * 1024) {
                setAlertConfig({
                    visible: true,
                    title: 'Erro',
                    message: 'A imagem deve ter no máximo 5MB',
                    actions: [{ label: 'OK', onPress: () => setAlertConfig((prev) => ({ ...prev, visible: false })) }],
                });
                return;
            }

            onImagePick(uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            setAlertConfig({
                visible: true,
                title: 'Permissão Negada',
                message: 'Precisamos de permissão para acessar a câmera.',
                actions: [{ label: 'OK', onPress: () => setAlertConfig((prev) => ({ ...prev, visible: false })) }],
            });
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            onImagePick(result.assets[0].uri);
        }
    };

    const handleImageSelect = () => {
        setAlertConfig({
            visible: true,
            title: 'Selecionar Imagem',
            message: 'Como deseja adicionar a imagem?',
            actions: [
                {
                    label: 'Tirar Foto',
                    onPress: () => {
                        setAlertConfig((prev) => ({ ...prev, visible: false }));
                        takePhoto();
                    },
                },
                {
                    label: 'Escolher da Galeria',
                    onPress: () => {
                        setAlertConfig((prev) => ({ ...prev, visible: false }));
                        pickImage();
                    },
                },
                {
                    label: 'Cancelar',
                    type: 'danger',
                    onPress: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
                },
            ],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} <Text style={styles.required}>*</Text>
            </Text>

            {!imageUri ? (
                <TouchableOpacity
                    style={[styles.uploadBox, error && styles.uploadBoxError]}
                    /*                     onPress={handleImageSelect} */
                    onPress={onPress ? onPress : handleImageSelect}
                    activeOpacity={0.7}
                >
                    <View style={styles.uploadIconContainer}>
                        <Ionicons name="cloud-upload" size={32} color={Colors.primary} />
                    </View>
                    <Text style={styles.uploadTitle}>Carregar Imagem</Text>
                    <Text style={styles.uploadSubtitle}>PNG, JPG • máx. 5MB</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.preview} />
                    <View style={styles.previewOverlay}>
                        <TouchableOpacity
                            style={styles.changeButton}
                            /*                             onPress={handleImageSelect} */
                            onPress={onPress ? onPress : handleImageSelect}
                        >
                            <Ionicons name="camera" size={18} color={Colors.surface} />
                            <Text style={styles.changeButtonText}>Trocar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.removeButton} onPress={onImageRemove}>
                            <Ionicons name="trash" size={18} color={Colors.surface} />
                            <Text style={styles.removeButtonText}>Remover</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.successBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                        <Text style={styles.successText}>Carregado</Text>
                    </View>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={14} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* ALERT CARD */}
            {alertConfig.visible && (
                <AlertCard
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    actions={alertConfig.actions}
                    onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    required: {
        color: Colors.error,
    },
    uploadBox: {
        height: 160,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.border,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadBoxError: {
        borderColor: Colors.error,
        backgroundColor: '#FFF5F5',
    },
    uploadIconContainer: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    uploadTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    uploadSubtitle: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    previewContainer: {
        height: 160,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    preview: {
        width: '100%',
        height: '100%',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: Spacing.sm,
        gap: Spacing.sm,
    },
    changeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: Spacing.xs,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
    },
    changeButtonText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.surface,
    },
    removeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: Spacing.xs,
        backgroundColor: Colors.error,
        borderRadius: BorderRadius.md,
    },
    removeButtonText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.surface,
    },
    successBadge: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
    },
    successText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.surface,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: Spacing.xs,
    },
    errorText: {
        fontSize: FontSize.xs,
        color: Colors.error,
    },
});
