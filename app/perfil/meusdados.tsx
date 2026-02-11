import AlertCard from '@/components/AlertCard';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';


export default function MeusDadosScreen() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    dataCadastro: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.name || '',
        email: user.email || '',
        telefone: user.phone || '',
        cidade: '', // se vier do backend depois
        dataCadastro: '', // pode formatar createdAt depois
      });
    }
  }, [user]);


  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    actions: [] as any[],
  });


  const handleSave = () => {
    setAlertConfig({
      visible: true,
      title: 'Sucesso',
      message: 'Dados atualizados com sucesso!',
      actions: [
        {
          text: 'OK',
        },
      ],
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset para valores originais
    setFormData({
      nome: user?.name || '',
      email: user?.email || '',
      telefone: user?.phone || '',
      cidade: '', // se vier do backend depois
      dataCadastro: '', // pode formatar createdAt depois
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color={Colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Meus Dados</Text>
          <Text style={styles.subtitle}>
            {isEditing ? 'Editando suas informações' : 'Informações da sua conta'}
          </Text>

          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <DataField
            icon="person-outline"
            label="Nome Completo"
            value={formData.nome}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
          />

          <DataField
            icon="mail-outline"
            label="Email"
            value={formData.email}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />

          <DataField
            icon="call-outline"
            label="Telefone"
            value={formData.telefone}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, telefone: text })}
            keyboardType="phone-pad"
          />

          <DataField
            icon="location-outline"
            label="Cidade"
            value={formData.cidade}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, cidade: text })}
          />

          <DataField
            icon="calendar-outline"
            label="Membro desde"
            value={formData.dataCadastro}
            editable={false}
          />
        </View>

        {/* Botões de Ação */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Configurações Adicionais */}
        {!isEditing && (
          <View style={styles.additionalSettings}>
            <Text style={styles.sectionTitle}>Configurações da Conta</Text>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="key-outline" size={22} color={Colors.primary} />
              <Text style={styles.settingText}>Alterar Senha</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary} />
              <Text style={styles.settingText}>Privacidade e Segurança</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="trash-outline" size={22} color={Colors.error} />
              <Text style={[styles.settingText, { color: Colors.error }]}>
                Excluir Conta
              </Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        )}

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

      </ScrollView>
    </SafeAreaView>
  );
}

function DataField({
  icon,
  label,
  value,
  editable = false,
  onChangeText,
  keyboardType = 'default',
}: {
  icon: any;
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: any;
}) {
  return (
    <View style={styles.dataField}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>

      <View style={styles.fieldContent}>
        <Text style={styles.label}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  form: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
  },
  dataField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  fieldContent: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  input: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
  additionalSettings: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
});
