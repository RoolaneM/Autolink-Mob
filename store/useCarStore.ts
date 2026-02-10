import { create } from 'zustand';
import { CARROS_MOCK } from '../constants/data';
import { Car, FilterOptions } from '../types';

interface CarStore {
  carros: Car[];
  favoritos: string[];
  searchQuery: string;
  filtros: FilterOptions;
  
  // Actions
  setCarros: (carros: Car[]) => void;
  toggleFavorito: (carId: string) => void;
  isFavorito: (carId: string) => boolean;
  setSearchQuery: (query: string) => void;
  setFiltros: (filtros: FilterOptions) => void;
  resetFiltros: () => void;
  
  // Getters
  getCarById: (id: string) => Car | undefined;
  getCarrosFiltrados: () => Car[];
  getFavoritos: () => Car[];
}

const useCarStore = create<CarStore>((set, get) => ({
  carros: CARROS_MOCK,
  favoritos: [],
  searchQuery: '',
  filtros: {},
  
  setCarros: (carros) => set({ carros }),
  
  toggleFavorito: (carId) => set((state) => ({
    favoritos: state.favoritos.includes(carId)
      ? state.favoritos.filter(id => id !== carId)
      : [...state.favoritos, carId]
  })),
  
  isFavorito: (carId) => get().favoritos.includes(carId),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFiltros: (filtros) => set({ filtros }),
  
  resetFiltros: () => set({ filtros: {}, searchQuery: '' }),
  
  getCarById: (id) => get().carros.find(car => car.id === id),
  
  getCarrosFiltrados: () => {
    const { carros, searchQuery, filtros } = get();
    
    let resultado = [...carros];
    
    // Busca por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resultado = resultado.filter(car => 
        car.marca.toLowerCase().includes(query) ||
        car.modelo.toLowerCase().includes(query) ||
        `${car.marca} ${car.modelo}`.toLowerCase().includes(query)
      );
    }
    
    // Filtro por marca
    if (filtros.marca && filtros.marca.length > 0) {
      resultado = resultado.filter(car => filtros.marca!.includes(car.marca));
    }
    
    // Filtro por preço
    if (filtros.precoMin !== undefined) {
      resultado = resultado.filter(car => car.preco >= filtros.precoMin!);
    }
    if (filtros.precoMax !== undefined) {
      resultado = resultado.filter(car => car.preco <= filtros.precoMax!);
    }
    
    // Filtro por ano
    if (filtros.anoMin !== undefined) {
      resultado = resultado.filter(car => car.ano >= filtros.anoMin!);
    }
    if (filtros.anoMax !== undefined) {
      resultado = resultado.filter(car => car.ano <= filtros.anoMax!);
    }
    
    // Filtro por quilometragem
    if (filtros.quilometragemMax !== undefined) {
      resultado = resultado.filter(car => car.quilometragem <= filtros.quilometragemMax!);
    }
    
    // Filtro por combustível
    if (filtros.combustivel && filtros.combustivel.length > 0) {
      resultado = resultado.filter(car => filtros.combustivel!.includes(car.combustivel));
    }
    
    // Filtro por transmissão
    if (filtros.transmissao && filtros.transmissao.length > 0) {
      resultado = resultado.filter(car => filtros.transmissao!.includes(car.transmissao));
    }
    
    // Filtro por categoria
    if (filtros.categoria && filtros.categoria.length > 0) {
      resultado = resultado.filter(car => filtros.categoria!.includes(car.categoria));
    }
    
    // Filtro por cor
    if (filtros.cor && filtros.cor.length > 0) {
      resultado = resultado.filter(car => filtros.cor!.includes(car.cor));
    }
    
    return resultado;
  },
  
  getFavoritos: () => {
    const { carros, favoritos } = get();
    return carros.filter(car => favoritos.includes(car.id));
  },
}));

export default useCarStore;