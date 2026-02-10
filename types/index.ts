export interface Car {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  quilometragem: number;
  combustivel: 'Gasolina' | 'Etanol' | 'Flex' | 'Diesel' | 'Elétrico' | 'Híbrido';
  transmissao: 'Manual' | 'Automático' | 'CVT';
  cor: string;
  portas: number;
  imagens: string[];
  imagemPrincipal: string;
  descricao: string;
  categoria: 'Sedan' | 'SUV' | 'Hatch' | 'Pickup' | 'Esportivo' | 'Minivan';
  opcionais: string[];
  cidade: string;
  estado: string;
  destaque: boolean;
  vendedor: {
    nome: string;
    telefone: string;
    whatsapp: string;
  };
}

export interface FilterOptions {
  marca?: string[];
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  quilometragemMax?: number;
  combustivel?: string[];
  transmissao?: string[];
  categoria?: string[];
  cor?: string[];
}

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  favoritos: string[];
  testDrivesAgendados: TestDrive[];
}

export interface TestDrive {
  id: string;
  carroId: string;
  data: string;
  horario: string;
  status: 'Pendente' | 'Confirmado' | 'Realizado' | 'Cancelado';
}

export interface Financiamento {
  valorCarro: number;
  entrada: number;
  parcelas: number;
  taxaJuros: number;
  valorParcela: number;
  valorTotal: number;
}
