# World Cup Draw Simulator

Simulador de sorteio da fase de grupos da Copa do Mundo.
O usuário monta a lista de participantes, configura as regras e gera combinações automáticas de grupos.

## Como rodar

```bash
# Instalar dependencias
npm install

# Desenvolvimento
npm run dev

# Build de producao
npm run build

# Preview do build
npm run preview
```

## Como testar

```bash
# Rodar testes
npm run test

# Cobertura
npm run coverage

# Validacao completa (typecheck + lint + format + testes)
npm run validate
```

### Scripts disponiveis

| Script                    | Descricao                                            |
| ------------------------- | ---------------------------------------------------- |
| `dev`                     | Servidor de desenvolvimento Vite                     |
| `build`                   | Type check + build de producao                       |
| `preview`                 | Servir build localmente                              |
| `typecheck`               | Verificacao de tipos isolada                         |
| `lint` / `lint:fix`       | ESLint sem/com autofix                               |
| `format` / `format:check` | Prettier write/check                                 |
| `test` / `coverage`       | Vitest run / com cobertura                           |
| `validate`                | Pipeline completa (typecheck + lint + format + test) |

## Escopo implementado

**Opcao A — Fase de grupos** com todos os requisitos obrigatorios:

- Catalogo de 32 selecoes com busca por nome e codigo
- Combobox acessivel com navegacao por teclado (setas, Enter, Escape, Home, End)
- Configuracao de numero de grupos e equipes por grupo
- Sorteio automatico com re-sorteio
- Troca manual entre grupos com validacao
- Persistencia em localStorage (selecoes, configuracao, resultado)
- Estados vazios, loading simulado, mensagens de validacao

## Decisoes arquiteturais

### Stack

| Escolha                      | Justificativa                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 18 + TypeScript**    | Requisito do desafio. Strict mode com `noUncheckedIndexedAccess` para seguranca extra em acesso a arrays                                          |
| **Vite 6**                   | Build rapido, HMR instantaneo, ES modules nativos. Vendor splitting configurado                                                                   |
| **Context API + useReducer** | Suficiente para o escopo. Dois contextos independentes (teams/draw) evitam re-renders cruzados. Sem overhead de biblioteca externa                |
| **styled-components**        | CSS-in-JS com theme tipado. Permite co-localizar estilos com componentes e usar design tokens via ThemeProvider                                   |
| **react-router-dom v6**      | Rota unica (`/`), mas preparado para expansao. Requisito do desafio                                                                               |
| **Vitest + Testing Library** | Vitest por integracao nativa com Vite (shared config, mesmo transform pipeline). Testing Library por queries que refletem como o usuario interage |

### Estrutura de pastas

```
src/
  app/            # Providers, routing, hydration de estado
  components/     # Componentes compartilhados (layout, modal)
  constants/      # Dados estaticos e chaves de storage
  features/
    draw/         # Dominio do sorteio
      domain/     # Funcoes puras (engine, validator, policy)
      context/    # DrawContext + useReducer
      hooks/      # useDrawFlow, useSimulatorPageFlow
      components/ # UI do resultado, swap, configuracao
      configuration/ # Presets
      history/    # Persistencia de historico
      utils/      # Share, formatacao
    teams/        # Dominio de selecoes
      repositories/ # ITeamRepository + implementacao local
      context/    # TeamsContext + useReducer
      hooks/      # useTeamSearch, useTeamSelection
      components/ # Combobox, catalogo, painel de selecionados
      utils/      # Filtros, normalizacao
  hooks/          # Hooks compartilhados (useDebounce)
  pages/          # Paginas e subcomponentes
  repositories/   # IStorageRepository + localStorage
  theme/          # Tokens, global styles, tipos
  types/          # Domain types, Result<T>
```

### Separacao de responsabilidades

- **Domain** (`features/*/domain/`): funcoes puras, zero imports de React. Testavel sem mocks
- **Context** (`features/*/context/`): estado com useReducer, valor memoizado
- **Hooks** (`features/*/hooks/`): orquestram domain + context para os componentes
- **Components**: apresentacionais, recebem dados via props
- **Repositories**: interface abstraida (`IStorageRepository`, `ITeamRepository`) — trocar localStorage por API exige apenas nova implementacao

### Pattern: Result\<T\>

Todas as operacoes que podem falhar retornam `Result<T>`:

```typescript
type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };
```

Usado no draw engine, validator, repositories e persistence. Evita try/catch espalhado e forca o chamador a tratar ambos os caminhos.

## Regras do sorteio

### Obrigatorias

- **Sem duplicidade**: validator rejeita equipes repetidas
- **Distribuicao uniforme**: grupos sempre com tamanho igual
- **Validacao de contagem**: bloqueia sorteio se participantes != grupos x tamanho

### Extra: Politica de confederacao (FIFA-like)

- UEFA: maximo 2 selecoes por grupo
- Demais confederacoes: maximo 1 por grupo
- Implementada com **algoritmo de backtracking** que garante distribuicao valida
- Validacao de viabilidade antes de iniciar (verifica se a distribuicao e possivel)
- Swap manual tambem valida a politica ativa

Todas as regras vivem em `src/features/draw/domain/` como funcoes puras com RNG injetavel para testes deterministicos.

## Testes

**126 testes** em 23 arquivos cobrindo:

### Unitarios

- `drawValidator.test.ts` — validacoes de contagem, duplicatas, confederacao
- `drawEngine.test.ts` — shuffle, erros de validacao, politica FIFA-like
- `confederationPolicy.test.ts` — limites, permissoes, validacao de grupo
- `drawReducer.test.ts` — todas as acoes do reducer
- `filterTeams.test.ts` — normalizacao de busca, filtro por confederacao
- `localStorageRepository.test.ts` — save, load, clear, erros, SSR safety
- `drawPresets.test.ts` — aplicacao e deteccao de presets

### Integracao

- `drawConfigurationFlow.test.tsx` — fluxo completo: selecionar times, configurar, sortear
- `drawResultsPanel.test.tsx` — resultado, compartilhar, salvar, swap, undo
- `drawPersistenceFlow.test.tsx` — restaurar sessao, historico, comparacao
- `persistenceRestore.test.tsx` — hidratacao no reload, JSON invalido, falha de storage
- `teamSearchFlow.test.tsx` — busca por teclado, filtros, feedback de vazio

## Extras implementados

- **Restricoes por confederacao** com backtracking
- **Web Share API** com fallback para clipboard
- **Historico de sorteios** com label customizado
- **Comparacao side-by-side** entre sorteios salvos
- **Undo** da ultima troca manual
- **Presets** de configuracao (padrao, compacto, FIFA-like)
- **Download JSON** do resultado
- **Quick filters** por confederacao no catalogo
- **Log de atividade** da sessao
- **Acessibilidade**: skip link, ARIA tabs, live regions, contraste WCAG AA, foco visivel
- **SEO**: Open Graph, Twitter Card, JSON-LD, favicon SVG, manifest
- **Performance**: vendor splitting, async fonts, React.memo, lazy loading de imagens

## Qualidade de codigo

- TypeScript strict (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`)
- ESLint type-checked + stylistic + React Hooks
- Prettier com `printWidth: 100`, `endOfLine: "lf"`
- Husky pre-commit: lint-staged (ESLint + Prettier nos staged files)
- Husky commit-msg: commitlint (conventional commits)
- EditorConfig para consistencia entre editores
- Codigo 100% em ingles, UI em portugues

## Limitacoes e melhorias futuras

### Limitacoes atuais

- Dados locais (JSON fixture) sem backend
- Trocas manuais por selects, sem drag-and-drop
- Sem SSR (SPA client-side only)

### Melhorias futuras

- Backend API substituindo localStorage (a interface `IStorageRepository` ja existe)
- Mata-mata (Opcao B do desafio) como segunda fase
- Animacoes de transicao durante o sorteio
- Dark mode (o theme ja esta preparado para suportar)
- PWA com Service Worker para uso offline
