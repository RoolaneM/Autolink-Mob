import { api, uploadApi } from './api';

const BASE_URL = 'http://10.1.2.113:3000'; // IP do backend

export interface Car {
  categoria(categoria: any): unknown;
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  quilometragem: number;
  imagemPrincipal: string | null;
  status?: string;
  views?: number;
  messages?: number;
  // Caso queira, pode incluir todas as imagens:
  images?: string[];
  imagens?: string[];

  // NOVOS CAMPOS
  /*   categoria: string;  */     // Sedan, SUV, etc
  destaque?: boolean;     // true se estiver em destaque
}

export class CarService {
  // Carros do usuário logado
  static async getMyCars(): Promise<Car[]> {
    try {
      const { data } = await api.get('/cars/me/list');

      // Adiciona a URL completa das imagens
      const cars: Car[] = data.map((car: any) => ({
        ...car,
        imagemPrincipal: car.imagemPrincipal
          ? `${BASE_URL}${car.imagemPrincipal}`
          : null,
        images: car.images
          ? car.images.map((img: any) => `${BASE_URL}${img.url}`)
          : [],
      }));

      return cars;
    } catch (error) {
      console.error('Erro ao carregar carros:', error);
      throw error;
    }
  }

  // Deletar carro
  static async deleteCar(carId: string) {
    try {
      await api.delete(`/cars/${carId}`);
    } catch (error) {
      console.error('Erro ao deletar carro:', error);
      throw error;
    }
  }

  // Criar carro com imagens
  static async createCar(dto: any, images: any[]) {
    try {
      const formData = new FormData();

      // Adiciona campos do DTO
      Object.keys(dto).forEach((key) => {
        formData.append(key, dto[key]);
      });

      // Adiciona imagens
      images.forEach((img) => {
        formData.append('images', {
          uri: img.uri,
          type: img.type,
          name: img.fileName || img.uri.split('/').pop(),
        } as any);
      });

      const { data } = await uploadApi.post('/cars', formData);
      return data;
    } catch (error) {
      console.error('Erro ao criar carro:', error);
      throw error;
    }
  }

  // Busca todos os carros disponíveis (para compradores)
  static async getAllCars(): Promise<Car[]> {
    try {
      const { data } = await api.get('/cars');

      const cars: Car[] = data.map((car: any) => ({
        ...car,
        imagemPrincipal: car.imagemPrincipal
          ? `${BASE_URL}${car.imagemPrincipal.replace(BASE_URL, '')}`
          : null,

        images: car.imagens
          ? car.imagens.map((img: string) => `${BASE_URL}${img}`)
          : [],
      }));

      return cars;
    } catch (error) {
      console.error('Erro ao carregar todos os carros:', error);
      throw error;
    }
  }
}
