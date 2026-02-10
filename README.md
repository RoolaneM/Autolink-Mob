# 🚗 AutoLinkMoz - App de Venda de Carros B2C

App completo de venda de carros desenvolvido em React Native com Expo.

## 📱 Funcionalidades

✅ **Home Feed** - Carros em destaque e recentes
✅ **Busca e Filtros** - Busca por marca/modelo com filtros avançados
✅ **Favoritos** - Sistema de favoritos persistente
✅ **Detalhes do Carro** - Galeria de fotos, especificações, opcionais
✅ **Perfil do Usuário** - Gerenciamento de conta e preferências
✅ **Integração WhatsApp** - Contato direto com vendedor
✅ **Simulação de Financiamento** - Cálculo de parcelas
✅ **Agendamento Test Drive** - Sistema de agendamento

## 🚀 Como Executar

### 1. Instalação das Dependências

```bash
cd carros-app
npm install
```

### 2. Iniciar o Projeto

```bash
npx expo start
```

### 3. Executar no Dispositivo

- **Android**: Pressione `a` no terminal ou escaneie o QR Code com o app Expo Go
- **iOS**: Pressione `i` no terminal ou escaneie o QR Code com a câmera
- **Web**: Pressione `w` no terminal

## 📁 Estrutura de Arquivos

```
carros-app/
├── app/
│   ├── (tabs)/              # Navegação em abas
│   │   ├── _layout.tsx      # Layout das tabs
│   │   ├── index.tsx        # Home
│   │   ├── buscar.tsx       # Busca
│   │   ├── favoritos.tsx    # Favoritos
│   │   └── perfil.tsx       # Perfil
│   └── detalhes/
│       └── [id].tsx         # Detalhes do carro (dinâmico)
├── components/              # Componentes reutilizáveis
│   ├── CarCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   ├── ImageGallery.tsx
│   ├── SpecsList.tsx
│   └── PriceCard.tsx
├── store/
│   └── useCarStore.ts       # Gerenciamento de estado (Zustand)
├── types/
│   └── index.ts             # TypeScript types
├── constants/
│   ├── Colors.ts            # Cores e tema
│   └── data.ts              # Dados mockados
└── utils/                   # Utilitários (futuro)
```

## 🎨 Design System

### Cores
- **Primary**: #FF6B35 (Laranja)
- **Secondary**: #2C3E50 (Azul escuro)
- **Background**: #F8F9FA
- **Surface**: #FFFFFF
- **Text**: #2C3E50

### Componentes Principais

#### CarCard
Card de exibição de carro na listagem com:
- Imagem principal
- Badge de destaque
- Botão de favoritar
- Informações básicas (ano, km, combustível)
- Preço e transmissão

#### SearchBar
Barra de busca com:
- Input de texto
- Ícone de busca
- Botão de limpar
- Botão de filtros

#### FilterBar
Filtros rápidos em chips horizontais

#### ImageGallery
Galeria de imagens com:
- Navegação por setas
- Thumbnails
- Contador de fotos

#### SpecsList
Lista de especificações técnicas e opcionais

#### PriceCard
Card de preço fixo na parte inferior com:
- Preço à vista
- Simulação de parcelas
- Botões de ação (Test Drive e Contatar)

## 🔧 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação baseada em arquivos
- **Zustand** - Gerenciamento de estado
- **TypeScript** - Tipagem estática
- **Expo Linear Gradient** - Gradientes
- **Expo Image** - Otimização de imagens

## 📊 Dados Mockados

O app vem com 8 carros mockados incluindo:
- Toyota Corolla XEi
- Jeep Compass Longitude
- Volkswagen Golf GTI
- Honda Civic Touring
- Chevrolet Onix Plus
- Hyundai Creta
- Fiat Toro Ranch
- Nissan Kicks

## 🎯 Próximos Passos

Para continuar o desenvolvimento, você pode:

1. **Integrar API Real**
   - Substituir dados mockados por API
   - Implementar autenticação
   - Sistema de upload de imagens

2. **Adicionar Páginas**
   - Filtros avançados completos
   - Página de financiamento funcional
   - Sistema de agendamento completo
   - Comparação de carros

3. **Melhorias**
   - Animações com Reanimated
   - Cache de imagens
   - Push notifications
   - Sistema de chat com vendedor

## 📝 Notas Importantes

- Os dados são mockados e resetam ao reiniciar o app
- As funcionalidades de WhatsApp e ligação funcionam apenas em dispositivos reais
- O sistema de favoritos é local (não persiste entre sessões por enquanto)

## 🤝 Contribuindo

Sinta-se à vontade para expandir o app adicionando:
- Novas features
- Melhorias de UI/UX
- Testes unitários
- Documentação adicional

## 📄 Licença

Projeto desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ usando React Native + Expo**