import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';

type AlertAction = {
    label: string;
    onPress: () => void;
    type?: 'primary' | 'danger' | 'cancel';
};



type AlertCardProps = {
    visible: boolean;
    title: string;
    message: string;
    actions: AlertAction[];
    onClose: () => void;
};

export default function AlertCard({
    visible,
    title,
    message,
    actions,
    onClose,
}: AlertCardProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actionsContainer}>
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    action.type === 'primary' && styles.primaryButton,
                                    action.type === 'danger' && styles.dangerButton,
                                ]}
                                onPress={() => {
                                    action.onPress();
                                    onClose();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        action.type === 'primary' && styles.primaryText,
                                        action.type === 'danger' && styles.dangerText,
                                    ]}
                                >
                                    {action.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    container: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    message: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
    },
    actionsContainer: {
        gap: Spacing.sm,
    },
    button: {
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
    },
    dangerButton: {
        backgroundColor: Colors.error,
    },
    buttonText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: Colors.text,
    },
    primaryText: {
        color: '#fff',
    },
    dangerText: {
        color: '#fff',
    },
});
