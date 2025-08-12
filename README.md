# Timeline Component

Um componente React para visualização de itens em uma timeline com layout compacto e funcionalidades interativas.

## 🚀 Como executar o projeto

```bash
# Instalar dependências
npm install

# Executar o projeto em modo de desenvolvimento
npm start
# ou
npm run dev

# Build para produção
npm run build
```

O projeto estará disponível em `http://localhost:5173`

## 📋 Funcionalidades Implementadas

### ✅ Funcionalidades Principais
- **Layout compacto em lanes**: Itens que não se sobrepõem temporalmente compartilham a mesma lane
- **Visualização clara**: Cada item mostra nome, datas de início e fim
- **Responsivo**: Interface adaptável a diferentes tamanhos de tela
- **Algoritmo de lanes eficiente**: Utiliza o código fornecido em `assignLanes.js` otimizado

### ✅ Funcionalidades Extras
- **Zoom In/Out**: Controle de zoom para visualizar diferentes escalas de tempo
- **Drag & Drop**: Arrastar itens horizontalmente para alterar datas
- **Redimensionamento**: Redimensionar itens pelas bordas para ajustar datas de início/fim
- **Edição inline**: Clique no nome do item para editá-lo diretamente
- **Indicador "Hoje"**: Linha vermelha mostra a data atual na timeline
- **Controles visuais**: Botões de zoom e informações da timeline

## 🎨 Decisões de Design

### Inspiração
- **Microsoft Project**: Para o layout de lanes e visualização de barras de tempo
- **GitHub Projects Timeline**: Para a estética clean e controles de zoom
- **Google Calendar**: Para o sistema de cores e feedback visual durante interações

### Escolhas Técnicas
- **Vite + React**: Build tool moderno e rápido, ideal para desenvolvimento
- **TypeScript**: Type safety para melhor manutenibilidade do código
- **Tailwind CSS 4**: Sistema de design consistente e utilities-first
- **Lucide React**: Ícones SVG leves e consistentes
- **Shadcn/ui patterns**: Design system baseado em Radix UI para componentes acessíveis

### Layout e UX
- **Sistema de cores automático**: Cada item recebe uma cor baseada no seu ID
- **Feedback visual**: Estados hover, dragging e editing bem definidos
- **Controles intuitivos**: Handles de redimensionamento e área de movimento clara
- **Informações contextuais**: Tooltip com instruções e dados da timeline

## 💡 O que eu gosto na implementação

1. **Algoritmo de lanes eficiente**: O código `assignLanes.js` foi otimizado para criar o layout mais compacto possível, considerando até mesmo um buffer entre itens para melhor legibilidade.

2. **Interatividade rica**: A combinação de zoom, drag & drop e edição inline oferece uma experiência de usuário completa sem sobrecarregar a interface.

3. **Código modular**: Componentes bem separados (`Timeline`, `TimelineItem`, `TimelineHeader`) facilitam manutenção e testes.

4. **Performance**: Uso de `useMemo` e `useCallback` para evitar re-renderizações desnecessárias, especialmente importante com muitos itens.

5. **Acessibilidade**: Uso de cores contrastantes, tooltips descritivos e navegação por teclado.

## 🔄 O que eu mudaria se fosse fazer novamente

1. **Virtualização**: Para timelines com centenas de itens, implementaria virtualização para renderizar apenas itens visíveis.

2. **Estado global**: Utilizaria Context API ou Zustand para gerenciar estado, facilitando funcionalidades como undo/redo.

3. **Persistência**: Adicionaria localStorage ou integração com backend para salvar alterações.

4. **Temas**: Sistema de temas mais robusto com modo escuro/claro.

5. **Internacionalização**: Suporte a múltiplos idiomas, especialmente para formatos de data.

6. **Validação mais robusta**: Validação de sobreposição de datas e conflitos durante edição.

## 🧪 Como testaria com mais tempo

### Testes Unitários
```typescript
// Exemplo de testes que implementaria
describe('assignLanes', () => {
  it('should assign items to minimum number of lanes', () => {
    // Teste do algoritmo de lanes
  });
  
  it('should handle overlapping items correctly', () => {
    // Teste de sobreposição
  });
});

describe('Timeline Component', () => {
  it('should render all items correctly', () => {
    // Teste de renderização
  });
  
  it('should handle zoom interactions', () => {
    // Teste de zoom
  });
  
  it('should support drag and drop', () => {
    // Teste de drag & drop
  });
});
```

### Testes de Integração
- **Fluxo completo**: Criar → Editar → Arrastar → Redimensionar item
- **Zoom + Interação**: Testar funcionalidades em diferentes níveis de zoom
- **Performance**: Teste com 100+ itens para verificar responsividade

### Testes E2E
- **Cypress/Playwright**: Automação de interações complexas de usuário
- **Acessibilidade**: Teste com screen readers e navegação por teclado
- **Cross-browser**: Compatibilidade entre diferentes navegadores

### Testes de Performance
- **React DevTools Profiler**: Identificar componentes com re-renders desnecessários
- **Lighthouse**: Métricas de performance e acessibilidade
- **Bundle analysis**: Otimização do tamanho do bundle

## 🛠 Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Lucide React** - Ícones
- **Class Variance Authority** - Utility para classes condicionais
- **Clsx + Tailwind Merge** - Gerenciamento de classes CSS

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Timeline.tsx          # Componente principal
│   ├── TimelineItem.tsx      # Item individual da timeline
│   └── TimelineHeader.tsx    # Cabeçalho com datas
├── lib/
│   └── utils.ts              # Utilitários (cn function)
├── assignLanes.js            # Algoritmo de layout de lanes
├── timelineItems.js          # Dados de exemplo
├── App.tsx                   # Componente raiz
├── main.tsx                  # Entry point
└── index.css                 # Estilos globais
```

---

Este projeto demonstra uma implementação completa de um componente timeline com foco em usabilidade, performance e manutenibilidade do código.
