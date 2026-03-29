# Arquitetura

Visão geral da estrutura, decisões técnicas e organização do código.

---

## Critérios de projeto

- **Corretude de domínio**: o sorteio precisa respeitar regras testáveis e previsíveis
- **Clareza de fluxo**: a jornada principal deve ser simples de seguir, inclusive sob erro
- **Baixo acoplamento**: UI, domínio e persistência precisam evoluir sem reescrita em cascata
- **Escalabilidade pragmática**: preparar o terreno para crescer sem superengenharia no MVP

---

## Estrutura do projeto

```text
src/
  app/                          # bootstrap, providers, restore, routing
    persistence/                #   hidratação do estado a partir do localStorage
    App.tsx                     #   componente raiz com BrowserRouter e layout
    AppProviders.tsx             #   composição de providers (tema + teams + draw)
    routes.tsx                  #   configuração de rotas

  components/                   # layout e componentes compartilhados
    layout/
      StitchLayout.tsx          #   GlobalNavBar, MainHeader, MainFooter
      stickyHeights.ts          #   constantes de medida para layout sticky

  constants/                    # dataset, chaves de storage, constantes gerais
    teams.json                  #   catálogo de 32 seleções com pot e confederação
    drawDefaults.ts             #   valores padrão (8 grupos, 4 por grupo)
    storageKeys.ts              #   chaves de localStorage

  features/
    draw/
      __tests__/                #   testes de integração do fluxo de sorteio
      components/               #   configuração, resultado, resumo, swap, ready state
      configuration/            #   presets de sorteio
      context/                  #   reducer + provider do sorteio
      domain/                   #   engine, validator, RNG, políticas (zero React)
      history/                  #   salvar, restaurar e comparar sorteios
      hooks/                    #   orquestração do fluxo da página
      utils/                    #   share, sumários, helpers de domínio

    teams/
      __tests__/                #   testes de busca, filtro e repositório
      components/               #   combobox, catálogo e painel de selecionados
      context/                  #   reducer + provider de participantes
      hooks/                    #   busca, debounce e seleção
      repositories/             #   catálogo local e contrato de dados
      utils/                    #   filtro, normalização e busca

  hooks/                        # hooks compartilhados do app
  pages/                        # página principal e subáreas da tela
  repositories/                 # persistência local genérica
  test/                         # infraestrutura de teste
  theme/                        # tokens, global styles e provider de tema
  types/                        # contratos de domínio
```

---

## Decisões arquiteturais

### 1. Estado dividido por domínio

O estado foi separado em dois slices principais:

- `teams`: catálogo, selecionados e fluxo de busca
- `draw`: configuração, resultado, loading, erro, undo e restore

Essa divisão evita acoplamento entre busca/seleções e resultado do sorteio. O `DrawPage` coordena os slices, mas as regras de domínio continuam fora da UI.

### 2. Context API + useReducer em vez de Zustand/Redux

O projeto tem um único fluxo principal, baixa profundidade de assinaturas e pouco estado global derivado. `Context + useReducer` atende bem porque:

- mantém a dependência do projeto enxuta
- deixa as transições de estado explícitas
- facilita testes de reducer e restore
- evita introduzir infraestrutura a mais sem ganho real para esse tamanho de app

Se o produto virasse multi-edição, multi-competição ou colaborativo, uma biblioteca de estado dedicada passaria a ser mais justificável.

### 3. Domínio isolado em funções puras

As regras do sorteio vivem em `src/features/draw/domain/`:

| Módulo                       | Responsabilidade                               | Linhas |
| ---------------------------- | ---------------------------------------------- | ------ |
| `drawEngine.ts`              | Algoritmo de sorteio (shuffle + backtracking)  | 148    |
| `drawValidator.ts`           | 7 validações de entrada                        | 93     |
| `confederationPolicy.ts`     | Regra de limite por confederação               | 47     |
| `confederationValidation.ts` | Viabilidade da distribuição antes do sorteio   | 50     |
| `random.ts`                  | Seeded RNG (mulberry32) + Fisher-Yates shuffle | 34     |

Esses módulos não importam React. Isso foi uma decisão central porque:

- regras de negócio mudam mais que a UI
- testabilidade real exige isolamento do domínio
- o algoritmo de sorteio precisa continuar previsível sob teste

### 4. Persistência atrás de repositórios

Mesmo usando `localStorage`, o acesso foi encapsulado em uma camada de repositório com interface genérica:

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

- Para o MVP, `localStorage` resolve o requisito com baixo custo
- Para evolução futura, o código já permite trocar a implementação por API sem reescrever os componentes

### 5. Rota única, mas com fronteira de navegação preservada

Mesmo com uma única tela no MVP, `react-router-dom` foi mantido porque:

- preserva um `App shell` limpo
- evita acoplar a tela principal ao bootstrap
- reduz custo futuro para separar histórico, detalhes de sorteio ou outras views

### 6. Provider stack

```typescript
ThemeModeProvider                   // tema light/dark + persist + default light
  └─ TeamsProvider(initialState)    // catálogo + selectedIds + auto-persist
      └─ DrawProvider(initialState) // settings + result + status + auto-persist
          └─ App (BrowserRouter + Layout + Routes)
```

A hidratação acontece em `AppProviders.tsx` via `restoreAppState()`, que:

1. carrega o catálogo de times pelo repositório
2. restaura `selectedIds` do localStorage
3. restaura `drawState` do localStorage
4. monta o estado hidratado filtrando IDs órfãos e resultados stale

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
5. `drawEngine` executa shuffle simples ou backtracking, conforme as restrições ativas
6. O `DrawResult` gerado é persistido junto com a configuração atual
7. A UI passa para o estado de resultado, habilitando share, save, compare, re-sort e swap manual
8. Se participantes ou configuração mudarem depois disso, o resultado anterior é invalidado

---

## Alternativas consideradas

### Zustand ou Redux Toolkit

Não foram adotados porque o app ainda não sofre com:

- compartilhamento profundo de estado entre áreas independentes
- seletores complexos
- efeitos assíncronos com alto acoplamento

Seriam válidos numa fase posterior, mas aqui tenderiam a adicionar ceremony demais para um fluxo principal relativamente linear.

### CSS Modules ou Tailwind

Não foram escolhidos por dois motivos:

- o projeto precisava de **tema centralizado**, inclusive com light/dark mode e motion tokens
- `styled-components` permitiu co-localizar o comportamento visual perto dos componentes sem perder composição

O trade-off é conhecido: CSS-in-JS pode custar mais em runtime do que CSS extraído. Para o tamanho deste projeto, a ergonomia pesou mais do que esse custo.

### Drag-and-drop para trocas

Foi deliberadamente deixado de fora do MVP porque a troca via selects:

- é mais fácil de testar
- é mais previsível para acessibilidade
- satisfaz o requisito com menos risco de bug comportamental

Se o produto evoluir, o passo correto seria um drag-and-drop acessível, não uma interação mouse-only.

---

## Qualidade e convenções

| Prática                | Detalhe                                                  |
| ---------------------- | -------------------------------------------------------- |
| TypeScript strict      | `strict: true`, `noUncheckedIndexedAccess` habilitado    |
| `Result<T>`            | Para operações com falha esperada, sem throw             |
| ESLint 9               | Flat config, `typescript-eslint` recommended + stylistic |
| Husky / lint-staged    | Pre-commit hooks com lint e format automático            |
| Código-fonte em inglês | Variáveis, funções, tipos, componentes, testes           |
| Interface em português | Textos de UI, mensagens de erro, labels                  |
