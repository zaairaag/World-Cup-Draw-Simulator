# Arquitetura

Estrutura do projeto, decisões técnicas e alternativas consideradas.

---

## Estrutura do projeto

```text
src/
  app/                            # bootstrap, providers, restore, routing
    persistence/                  #   hidratação do estado a partir do localStorage
    App.tsx                       #   componente raiz com BrowserRouter e layout
    AppProviders.tsx               #   composição de providers (tema + teams + draw)
    routes.tsx                    #   configuração de rotas

  components/                     # layout e componentes compartilhados
    layout/
      StitchLayout.tsx            #   GlobalNavBar, MainHeader, MainFooter
      stickyHeights.ts            #   constantes de medida para layout sticky

  constants/                      # dataset, chaves de storage, constantes gerais
    teams.json                    #   catálogo de 32 seleções com pot e confederação
    drawDefaults.ts               #   valores padrão (8 grupos, 4 por grupo)
    storageKeys.ts                #   chaves de localStorage

  features/
    draw/
      __tests__/                  #   testes de integração do fluxo de sorteio
      components/                 #   configuração, resultado, resumo, swap, ready state
        DrawConfigurationPanel    #     painel de opções com presets
        DrawResultsPanel          #     painel de resultado com grupos
        DrawGroupCard             #     card de grupo individual
        DrawSwapControls          #     interface de troca manual
        DrawExecutiveSummary      #     resumo estatístico do sorteio
        ReadyScene                #     estado inicial antes do sorteio
        SaveDrawModal             #     modal para salvar com label
        SavedDrawComparisonPanel  #     comparação lado a lado
        teamVisuals               #     helpers de renderização de equipes
      configuration/              #   presets de sorteio
        drawPresets.ts            #     padrão (8x4), compacto (4x4), FIFA-like
      context/                    #   reducer + provider do sorteio
        drawReducer.ts            #     10 actions: SET_RESULT, SWAP_TEAMS, UNDO, etc
        DrawContext.tsx            #     provider com auto-persistência
      domain/                     #   engine, validator, RNG, políticas (zero React)
        drawEngine.ts             #     shuffle simples ou backtracking
        drawValidator.ts          #     7 validações de entrada
        confederationPolicy.ts    #     regra UEFA max 2, demais max 1
        confederationValidation.ts #    validação de viabilidade antes do sorteio
        random.ts                 #     seeded RNG (mulberry32) + Fisher-Yates shuffle
      history/                    #   salvar, restaurar e comparar sorteios
        savedDrawHistory.ts       #     CRUD de histórico no localStorage
        compareSavedDraws.ts      #     diff grupo a grupo entre dois sorteios
      hooks/                      #   orquestração do fluxo da página
        useDrawFlow.ts            #     ciclo completo: validar → sortear → swap → undo
      utils/                      #   share, sumários, helpers de domínio
        shareDrawResult.ts        #     Web Share API + clipboard fallback
        summarizeDrawResult.ts    #     métricas de confederação e diversidade
        groupLabel.ts             #     Grupo A, B, C... (suporta >26 grupos)

    teams/
      __tests__/                  #   testes de busca, filtro e repositório
      components/                 #   combobox, catálogo e painel de selecionados
        TeamSearchCombobox.tsx    #     combobox acessível com ARIA e keyboard nav
        AvailableTeamsCatalog     #     catálogo com quick filters por confederação
        SelectedTeamsPanel        #     painel de equipes selecionadas
      context/                    #   reducer + provider de participantes
        teamsReducer.ts           #     6 actions: SELECT, DESELECT, FILL, CLEAR, etc
        TeamsContext.tsx            #     provider com auto-persistência
      hooks/                      #   busca, debounce e seleção
        useTeamSearch.ts          #     query com debounce (200ms), suggestions, keyboard
        useTeamSelection.ts       #     seleção, remoção e autofill
      repositories/               #   catálogo local e contrato de dados
        ITeamRepository.ts        #     interface substituível
        localTeamRepository.ts    #     implementação sobre teams.json
      utils/                      #   filtro, normalização e busca
        filterTeams.ts            #     filtro por nome, código, confederação

  hooks/                          # hooks compartilhados do app
  pages/                          # página principal e subáreas da tela
    draw-page/
      DrawPage.tsx                #   coordenação dos slices teams + draw
      drawPageSections.tsx        #   componentes de seção da página
      drawPageUtils.ts            #   helpers de UX e download

  repositories/                   # persistência local genérica
    IStorageRepository.ts         #   interface com save/load/clear
    localStorageRepository.ts     #   implementação com tratamento de falha

  test/                           # infraestrutura de teste
    setup.ts                      #   jest-dom, cleanup, mock restore

  theme/                          # tokens, global styles e provider de tema
    theme.ts                      #   light + dark com 29 cores semânticas
    themeMode.tsx                 #   toggle com persistência e modo claro por padrão
    themeModeContext.ts            #   contexto de tema
    globalStyles.ts               #   reset e estilos base
    styled.d.ts                   #   augmentação de tipos para styled-components

  types/                          # contratos de domínio
    domain.ts                     #   Team, Group, DrawResult, DrawSettings, etc
    result.ts                     #   Result<T, E> para operações com falha
    index.ts                      #   barrel export
```

---

## Decisões técnicas

### 1. Estado dividido por domínio

Dois slices independentes:

- `teams` — catálogo, selecionados e busca
- `draw` — configuração, resultado, loading, erro, undo e restore

O `DrawPage` coordena os slices, mas as regras de domínio ficam fora da UI. Isso significa que mudar a lógica de busca não afeta o sorteio e vice-versa.

### 2. Context API + useReducer

O projeto tem um único fluxo principal, baixa profundidade de assinaturas e pouco estado global derivado. `Context + useReducer` atende porque:

- mantém a dependência do projeto enxuta
- deixa as transições de estado explícitas via actions tipadas
- facilita testes de reducer e restore isolados
- evita introduzir infraestrutura sem ganho real para esse tamanho de app

Se o produto crescer para multi-edição, multi-competição ou colaborativo, uma biblioteca de estado dedicada passaria a compensar.

### 3. Domínio isolado em funções puras

Todo o `src/features/draw/domain/` é zero React — funções puras testáveis isoladamente:

| Módulo                       | Responsabilidade                               | Linhas |
| ---------------------------- | ---------------------------------------------- | ------ |
| `drawEngine.ts`              | Algoritmo de sorteio (shuffle + backtracking)  | 148    |
| `drawValidator.ts`           | 7 validações de entrada                        | 93     |
| `confederationPolicy.ts`     | Regra de limite por confederação               | 47     |
| `confederationValidation.ts` | Viabilidade da distribuição antes do sorteio   | 50     |
| `random.ts`                  | Seeded RNG (mulberry32) + Fisher-Yates shuffle | 34     |

Regras de negócio mudam mais que a UI. Isolar o domínio garante que o algoritmo de sorteio continua previsível sob teste sem depender de render nem contexto React.

### 4. Persistência atrás de repositórios

`localStorage` encapsulado em interfaces genéricas:

```typescript
interface IStorageRepository {
  save<T>(key: string, data: T): Result<true>;
  load<T>(key: string): Result<T | null>;
  clear(key: string): Result<true>;
}

interface ITeamRepository {
  loadCatalog(): Result<Team[]>;
}
```

Para o MVP, `localStorage` resolve com baixo custo. Para evolução futura, trocar a implementação por API não exige reescrever componentes.

### 5. Tema centralizado e tipado

- Tema `light` e `dark` com 29 cores semânticas cada
- `ThemeModeProvider` com tema claro como padrão inicial
- Tokens compartilhados de cor, espaçamento, sombras, tipografia e motion
- Persistência da preferência em `localStorage`

| Token       | Valores                                        |
| ----------- | ---------------------------------------------- |
| Spacing     | xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px |
| Radii       | sm: 8px, md: 16px, lg: 32px, xl: 48px          |
| Typography  | Inter (body/heading), JetBrains Mono (mono)    |
| Motion      | fast: 160ms, base: 320ms, slow: 560ms          |
| Breakpoints | xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280  |

### 6. Rota única com fronteira de navegação

`react-router-dom` mantido mesmo com tela única porque:

- preserva um App shell limpo
- evita acoplar a tela principal ao bootstrap
- reduz custo futuro para separar histórico, detalhes de sorteio ou outras views

Trade-off: uma camada de roteamento que hoje parece pequena, em troca de uma fronteira arquitetural clara desde o início.

### 7. Provider stack e hidratação

```text
ThemeModeProvider                   // tema light/dark + persist + default light
  └─ TeamsProvider(initialState)    // catálogo + selectedIds + auto-persist
      └─ DrawProvider(initialState) // settings + result + status + auto-persist
          └─ App (BrowserRouter + Layout + Routes)
```

A hidratação acontece em `AppProviders.tsx` via `restoreAppState()`:

1. Carrega o catálogo de times pelo repositório
2. Restaura `selectedIds` do localStorage
3. Restaura `drawState` do localStorage
4. Monta o estado hidratado filtrando IDs órfãos e resultados stale

---

## Fluxo principal

```text
                    ┌────────────────────────────────────────────────────────┐
                    │                     AppProviders                       │
                    │  restaura estado do localStorage na montagem          │
                    └────────────────────┬───────────────────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
       ThemeModeProvider          TeamsProvider               DrawProvider
       (light/dark + persist)    (catálogo + seleção)       (settings + result)
              │                          │                          │
              └──────────────────────────┼──────────────────────────┘
                                         │
                                         ▼
                                     DrawPage
                              (coordena os dois slices)
                                         │
                 ┌───────────┬───────────┼───────────┬───────────┐
                 ▼           ▼           ▼           ▼           ▼
             Simulador   Participantes  Opções    Histórico   Comparação
               (tab)        (tab)       (tab)      (tab)       (tab)
```

### Jornada do usuário

1. O catálogo local é carregado pelo repositório de times
2. O usuário busca e seleciona participantes via combobox acessível
3. O usuário configura o sorteio (grupos, tamanho, política de confederação)
4. `drawValidator` confirma se a configuração é viável
5. `drawEngine` executa shuffle simples ou backtracking conforme as restrições ativas
6. O `DrawResult` gerado é persistido junto com a configuração atual
7. A UI passa para o estado de resultado, habilitando share, save, compare, re-sort e swap manual
8. Se participantes ou configuração mudarem, o resultado anterior é invalidado automaticamente

---

## Alternativas consideradas

### Zustand ou Redux Toolkit

Não adotados porque o app não sofre com compartilhamento profundo de estado entre áreas independentes, seletores complexos ou efeitos assíncronos com alto acoplamento. Seriam válidos numa fase posterior, mas aqui adicionariam ceremony demais para um fluxo principal linear.

### CSS Modules ou Tailwind

Não escolhidos porque o projeto precisava de tema centralizado com light/dark mode e motion tokens. `styled-components` permitiu co-localizar o comportamento visual perto dos componentes sem perder composição. O trade-off é conhecido: CSS-in-JS custa mais em runtime do que CSS extraído. Para o tamanho deste projeto, a ergonomia pesou mais.

### Drag-and-drop para trocas

Deliberadamente fora do MVP. A troca via selects é mais fácil de testar, mais previsível para acessibilidade e satisfaz o requisito com menos risco de bug comportamental. Se o produto evoluir, o passo correto seria um drag-and-drop acessível, não uma interação mouse-only.

---

## Qualidade e convenções

| Prática                | Detalhe                                               |
| ---------------------- | ----------------------------------------------------- |
| TypeScript strict      | `strict: true`, `noUncheckedIndexedAccess` habilitado |
| `Result<T>`            | Operações com falha esperada, sem throw               |
| ESLint 9               | Flat config, `typescript-eslint` recommended          |
| Husky / lint-staged    | Pre-commit hooks com lint e format automático         |
| Código-fonte em inglês | Variáveis, funções, tipos, componentes, testes        |
| Interface em português | Textos de UI, mensagens de erro, labels               |
