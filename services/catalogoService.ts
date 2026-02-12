import { api } from './api';

export interface Marca {
  id: number;
  nome: string;
  logo: string;
}

export interface Modelo {
  id: number;
  nome: string;
  marca: Marca;
}

export interface Combustivel {
  id: number;
  nome: string;
}

export interface Cambio {
  id: number;
  nome: string;
}

export class CatalogoService {
  // Carrega todas as marcas
  static async getMarcas(): Promise<Marca[]> {
    try {
      const { data } = await api.get('/marcas');
      return data.map((marca: any) => ({
        ...marca,
        logo: marca.logo.startsWith('http') 
          ? marca.logo 
          : `${api.defaults.baseURL}${marca.logo}`,
      }));
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
      throw error;
    }
  }

  // Carrega todos os modelos
  static async getModelos(): Promise<Modelo[]> {
    try {
      const { data } = await api.get('/modelos');
      return data;
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      throw error;
    }
  }

  // Carrega modelos por marca
  static async getModelosByMarca(marcaId: number): Promise<Modelo[]> {
    try {
      const { data } = await api.get(`/modelos/marca/${marcaId}`);
      return data;
    } catch (error) {
      console.error('Erro ao carregar modelos por marca:', error);
      throw error;
    }
  }

  // Carrega combustíveis
  static async getCombustiveis(): Promise<Combustivel[]> {
    try {
      const { data } = await api.get('/combustiveis');
      return data;
    } catch (error) {
      console.error('Erro ao carregar combustíveis:', error);
      throw error;
    }
  }

  // Carrega tipos de câmbio
  static async getCambios(): Promise<Cambio[]> {
    try {
      const { data } = await api.get('/cambios');
      return data;
    } catch (error) {
      console.error('Erro ao carregar câmbios:', error);
      throw error;
    }
  }

  // Carrega todo o catálogo de uma vez (opcional)
  static async getAllCatalogo() {
    try {
      const [marcas, modelos, combustiveis, cambios] = await Promise.all([
        this.getMarcas(),
        this.getModelos(),
        this.getCombustiveis(),
        this.getCambios(),
      ]);

      return { marcas, modelos, combustiveis, cambios };
    } catch (error) {
      console.error('Erro ao carregar catálogo completo:', error);
      throw error;
    }
  }
}

export default CatalogoService;