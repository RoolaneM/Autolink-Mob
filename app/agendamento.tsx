import AlertCard from '@/components/AlertCard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../constants/Colors';
import useCarStore from '../store/useCarStore';

export default function AgendamentoScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams();
  const { getCarById } = useCarStore();

  const car = carId ? getCarById(carId as string) : null;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data: '',
    horario: '',
    mensagem: '',
  });

  const datasDisponiveis = [
    'Seg, 12 Fev',
    'Ter, 13 Fev',
    'Qua, 14 Fev',
    'Qui, 15 Fev',
    'Sex, 16 Fev',
    'Sáb, 17 Fev',
  ];

  const horariosDisponiveis = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    actions: any[];
  }>({
    visible: false,
    title: '',
    message: '',
    actions: [],
  });


  const handleSubmit = () => {
    if (!formData.nome || !formData.telefone || !formData.data || !formData.horario) {
      setAlertConfig({
        visible: true,
        title: 'Atenção',
        message: 'Por favor, preencha todos os campos obrigatórios.',
        actions: [
          {
            label: 'OK',
            type: 'primary',
            onPress: () => { },
          },
        ],
      });
      return;
    }

    setAlertConfig({
      visible: true,
      title: 'Test Drive Agendado!',
      message: `Seu test drive foi agendado para ${formData.data} às ${formData.horario}. Entraremos em contato em breve!`,
      actions: [
        {
          label: 'OK',
          type: 'primary',
          onPress: () => router.back(),
        },
      ],
    });

  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Test Drive</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informações do Carro */}
        {car && (
          <View style={styles.carInfo}>
            <Ionicons name="car-sport" size={32} color={Colors.primary} />
            <View style={styles.carInfoText}>
              <Text style={styles.carInfoTitle}>
                {car.marca} {car.modelo}
              </Text>
              <Text style={styles.carInfoSubtitle}>
                {car.ano} • {car.cidade}, {car.estado}
              </Text>
            </View>
          </View>
        )}

        {/* Formulário */}
        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome Completo <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          {/* Telefone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Telefone/WhatsApp <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              value={formData.telefone}
              onChangeText={(text) => setFormData({ ...formData, telefone: text })}
            />
          </View>

          {/* Data */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Escolha a Data <Text style={styles.required}>*</Text>
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsContainer}
            >
              {datasDisponiveis.map((data) => (
                <TouchableOpacity
                  key={data}
                  style={[
                    styles.optionChip,
                    formData.data === data && styles.optionChipSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, data })}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      formData.data === data && styles.optionChipTextSelected,
                    ]}
                  >
                    {data}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Horário */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Escolha o Horário <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.horariosGrid}>
              {horariosDisponiveis.map((horario) => (
                <TouchableOpacity
                  key={horario}
                  style={[
                    styles.horarioChip,
                    formData.horario === horario && styles.horarioChipSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, horario })}
                >
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={
                      formData.horario === horario ? Colors.surface : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.horarioChipText,
                      formData.horario === horario && styles.horarioChipTextSelected,
                    ]}
                  >
                    {horario}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mensagem */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mensagem (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Alguma observação ou preferência?"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.mensagem}
              onChangeText={(text) => setFormData({ ...formData, mensagem: text })}
            />
          </View>

          {/* Informações Importantes */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
            <View style={styles.infoBoxText}>
              <Text style={styles.infoBoxTitle}>Importante</Text>
              <Text style={styles.infoBoxDescription}>
                • Leve um documento com foto{'\n'}
                • CNH válida é necessária{'\n'}
                • Confirmaremos por telefone/WhatsApp
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.surface} />
          <Text style={styles.submitButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  carInfoText: {
    flex: 1,
  },
  carInfoTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  carInfoSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  form: {
    padding: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  optionChipTextSelected: {
    color: Colors.surface,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  horarioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 100,
    justifyContent: 'center',
  },
  horarioChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  horarioChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  horarioChipTextSelected: {
    color: Colors.surface,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    gap: Spacing.md,
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
  bottomBar: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  submitButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});