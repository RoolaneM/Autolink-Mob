import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../../../components/AuthInput';
import CustomPicker from '../../../components/CustomPicker';
import ImageUpload from '../../../components/ImageUpload';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';
import { api } from '../../../services/api';
import CatalogoService, { Cambio, Combustivel, Marca, Modelo } from '../../../services/catalogoService';

export default function AdicionarCarroScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);

  // Catálogo
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modelosFiltrados, setModelosFiltrados] = useState<Modelo[]>([]);
  const [combustiveis, setCombustiveis] = useState<Combustivel[]>([]);
  const [cambios, setCambios] = useState<Cambio[]>([]);

  const [form, setForm] = useState({
    marcaId: 0,
    marcaNome: '',
    modeloId: 0,
    modeloNome: '',
    ano: '',
    preco: '',
    quilometragem: '',
    combustivelId: 0,
    combustivelNome: '',
    transmissaoId: 0,
    transmissaoNome: '',
    cor: '',
    portas: '4',
    descricao: '',
    categoria: 'sedan',
    cidade: '',
    estado: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCatalogo();
  }, []);

  // Quando marca muda, filtra os modelos
  useEffect(() => {
    if (form.marcaId > 0) {
      const filtered = modelos.filter((m) => m.marca.id === form.marcaId);
      setModelosFiltrados(filtered);
      // Limpa modelo selecionado se não pertencer à marca
      if (form.modeloId > 0) {
        const modeloBelongs = filtered.find((m) => m.id === form.modeloId);
        if (!modeloBelongs) {
          setForm({ ...form, modeloId: 0, modeloNome: '' });
        }
      }
    } else {
      setModelosFiltrados([]);
    }
  }, [form.marcaId, modelos]);

  const loadCatalogo = async () => {
    try {
      setLoadingCatalogo(true);
      const catalogo = await CatalogoService.getAllCatalogo();
      setMarcas(catalogo.marcas);
      setModelos(catalogo.modelos);
      setCombustiveis(catalogo.combustiveis);
      setCambios(catalogo.cambios);
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
      Alert.alert('Erro', 'Não foi possível carregar o catálogo. Tente novamente.');
    } finally {
      setLoadingCatalogo(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (form.marcaId === 0) newErrors.marca = 'Marca é obrigatória';
    if (form.modeloId === 0) newErrors.modelo = 'Modelo é obrigatório';
    if (!form.ano.trim()) newErrors.ano = 'Ano é obrigatório';
    if (!form.preco.trim()) newErrors.preco = 'Preço é obrigatório';
    if (!form.quilometragem.trim()) newErrors.quilometragem = 'Quilometragem é obrigatória';
    if (form.combustivelId === 0) newErrors.combustivel = 'Combustível é obrigatório';
    if (form.transmissaoId === 0) newErrors.transmissao = 'Transmissão é obrigatória';
    if (!form.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!form.estado.trim()) newErrors.estado = 'Estado é obrigatório';

    if (images.length === 0) {
      newErrors.images = 'Adicione pelo menos uma imagem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Dados básicos
      formData.append('marca', form.marcaNome);
      formData.append('modelo', form.modeloNome);
      formData.append('ano', form.ano);
      formData.append('preco', form.preco);
      formData.append('quilometragem', form.quilometragem);
      formData.append('combustivel', form.combustivelNome);
      formData.append('transmissao', form.transmissaoNome);
      formData.append('cor', form.cor);
      formData.append('portas', form.portas);
      formData.append('descricao', form.descricao);
      formData.append('categoria', form.categoria);
      formData.append('cidade', form.cidade);
      formData.append('estado', form.estado);

      // Imagens
      images.forEach((uri, index) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri,
          name: filename || `photo_${index}.jpg`,
          type,
        } as any);
      });

      await api.post('/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Sucesso!', 'Carro adicionado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message?.includes('assinatura')) {
        Alert.alert('Assinatura Necessária', message, [
          {
            text: 'Ver Planos',
            onPress: () => router.push('/(vendedorstand)/paginas/checkout'),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]);
      } else {
        Alert.alert('Erro', message || 'Não foi possível adicionar o carro.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando catálogo...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicionar Carro</Text>
          <Text style={styles.subtitle}>Preencha os dados do veículo</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <CustomPicker
            label="Marca"
            value={form.marcaNome}
            options={marcas}
            onSelect={(marca) =>
              setForm({ ...form, marcaId: Number(marca.id), marcaNome: marca.nome })
            }
            placeholder="Selecione a marca"
            icon="car-outline"
            searchable
            error={errors.marca}
          />

          <CustomPicker
            label="Modelo"
            value={form.modeloNome}
            options={modelosFiltrados}
            onSelect={(modelo) =>
              setForm({ ...form, modeloId: Number(modelo.id), modeloNome: modelo.nome })
            }
            placeholder={
              form.marcaId === 0 ? 'Selecione a marca primeiro' : 'Selecione o modelo'
            }
            icon="car-sport-outline"
            searchable
            error={errors.modelo}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <AuthInput
                label="Ano"
                value={form.ano}
                onChangeText={(text) => setForm({ ...form, ano: text })}
                placeholder="2020"
                keyboardType="number-pad"
                error={errors.ano}
              />
            </View>

            <View style={styles.halfInput}>
              <AuthInput
                label="Portas"
                value={form.portas}
                onChangeText={(text) => setForm({ ...form, portas: text })}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <AuthInput
            label="Preço (MZN)"
            value={form.preco}
            onChangeText={(text) => setForm({ ...form, preco: text.replace(/\D/g, '') })}
            placeholder="1500000"
            keyboardType="number-pad"
            icon="cash-outline"
            error={errors.preco}
          />

          <AuthInput
            label="Quilometragem (km)"
            value={form.quilometragem}
            onChangeText={(text) => setForm({ ...form, quilometragem: text.replace(/\D/g, '') })}
            placeholder="50000"
            keyboardType="number-pad"
            icon="speedometer-outline"
            error={errors.quilometragem}
          />

          <CustomPicker
            label="Combustível"
            value={form.combustivelNome}
            options={combustiveis}
            onSelect={(combustivel) =>
              setForm({
                ...form,
                combustivelId: Number(combustivel.id),
                combustivelNome: combustivel.nome,
              })
            }
            placeholder="Selecione o combustível"
            icon="flash-outline"
            error={errors.combustivel}
          />

          <CustomPicker
            label="Transmissão"
            value={form.transmissaoNome}
            options={cambios}
            onSelect={(cambio) =>
              setForm({
                ...form,
                transmissaoId: Number(cambio.id),
                transmissaoNome: cambio.nome,
              })
            }
            placeholder="Selecione a transmissão"
            icon="settings-outline"
            error={errors.transmissao}
          />

          <AuthInput
            label="Cor"
            value={form.cor}
            onChangeText={(text) => setForm({ ...form, cor: text })}
            placeholder="Ex: Preto"
            icon="color-palette-outline"
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Localização</Text>

          <AuthInput
            label="Cidade"
            value={form.cidade}
            onChangeText={(text) => setForm({ ...form, cidade: text })}
            placeholder="Maputo"
            icon="location-outline"
            error={errors.cidade}
          />

          <AuthInput
            label="Estado/Província"
            value={form.estado}
            onChangeText={(text) => setForm({ ...form, estado: text })}
            placeholder="Maputo"
            error={errors.estado}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Descrição</Text>

          <AuthInput
            label="Descrição do Veículo"
            value={form.descricao}
            onChangeText={(text) => setForm({ ...form, descricao: text })}
            placeholder="Descreva as características e estado do veículo..."
            multiline
            numberOfLines={4}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Fotos do Veículo</Text>
          <Text style={styles.sectionSubtitle}>Adicione até 10 fotos</Text>

          {[0, 1, 2, 3, 4].map((index) => (
            <ImageUpload
              key={index}
              label={`Foto ${index + 1}${index === 0 ? ' (Principal)' : ''}`}
              imageUri={images[index]}
              onImagePick={(uri) => {
                const newImages = [...images];
                newImages[index] = uri;
                setImages(newImages);
              }}
              onImageRemove={() => {
                const newImages = images.filter((_, i) => i !== index);
                setImages(newImages);
              }}
              error={index === 0 ? errors.images : undefined}
            />
          ))}

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
                <Text style={styles.submitButtonText}>Publicar Anúncio</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  form: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfInput: {
    flex: 1,
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
});