# ⚽ World Cup Draw Simulator

<p align="center">
  <strong>Simulador de sorteio da fase de grupos da Copa do Mundo inspirado na identidade visual do <a href="https://ge.globo.com">ge.globo</a>.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-purple.svg?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-3-green.svg?style=for-the-badge&logo=vitest" alt="Vitest" />
</p>

---

Simulador de sorteio da fase de grupos da Copa do Mundo feito em React + TypeScript.

O projeto foi estruturado para atender o desafio tecnico com um minimo solido e evolutivo:

- montar a lista de participantes via busca acessivel
- configurar o sorteio
- gerar grupos automaticamente com regras de dominio testaveis
- ajustar o resultado manualmente
- persistir a sessao localmente

O escopo implementado para o desafio foi a **Opcao A — fase de grupos**. Mata-mata ficou deliberadamente fora do MVP.

---

## 🛠️ Stack

| Escolha                      | Motivo                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| **React 18 + TypeScript**    | Base pedida no desafio, com tipagem forte e modelagem explicita do dominio               |
| **Vite 6**                   | Setup simples, build rapido, boa ergonomia para take-home e integracao nativa com Vitest |
| **Context API + useReducer** | Suficiente para o escopo atual, sem custo extra de biblioteca de estado                  |
| **styled-components 6**      | Tema tipado, co-localizacao de estilos e composicao simples de tokens visuais            |
| **react-router-dom 6**       | Mantem a estrutura preparada para crescer, mesmo com rota unica no MVP                   |
| **Vitest + Testing Library** | Mesma pipeline do Vite e testes orientados ao comportamento real do usuario              |

### Dependencias de producao

Apenas 4 bibliotecas em runtime:

```text
react 18.3 · react-dom 18.3 · react-router-dom 6.30 · styled-components 6.1
```

### Dependencias de desenvolvimento

| Categoria     | Pacotes                                                                        |
| ------------- | ------------------------------------------------------------------------------ |
| Testes        | vitest 3, @vitest/coverage-v8, @testing-library/react 16, jest-dom, user-event |
| Lint e format | eslint 9, prettier 3, eslint-config-prettier, typescript-eslint 8              |
| Git hooks     | husky 9, lint-staged 16, @commitlint/cli 20, @commitlint/config-conventional   |
| Build e tipos | typescript 5.8, vite 6, @vitejs/plugin-react 4, jsdom 26                       |

---

## 📐 Criterios de projeto

As decisoes tecnicas foram guiadas por quatro criterios principais:

- **Corretude de dominio**: o sorteio precisa respeitar regras testaveis e previsiveis
- **Clareza de fluxo**: a jornada principal deve ser simples de seguir, inclusive sob erro
- **Baixo acoplamento**: UI, dominio e persistencia precisam evoluir sem reescrita em cascata
- **Escalabilidade pragmatica**: preparar o terreno para crescer sem superengenharia no MVP

---

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Aplicacao local: `http://localhost:5173`

### Pre-requisitos

- Node.js >= 18
- npm (instalado com o Node)

---

## 🧪 Como validar

Ultima execução local de `npm run coverage`:

- `95.47%` statements / lines
- `92.26%` branches
- `96.49%` functions

| Comando            | Descrição                                 | Status Visual |
| :----------------- | :---------------------------------------- | :------------ |
| `npm run test`     | Suíte completa com Vitest                 | 🏃💨          |
| `npm run coverage` | Suíte completa com cobertura              | 📈            |
| `npm run validate` | Gate de qualidade (Lint + Types + Testes) | ✨            |

```bash
npm run build        # typecheck + build de producao
npm run test         # suite completa com Vitest
npm run coverage     # suite completa com cobertura
npm run validate     # typecheck + lint + format check + testes (gate unico)
```

### Scripts disponiveis

| Script                    | Comando real                                    | Descricao                         |
| ------------------------- | ----------------------------------------------- | --------------------------------- |
| `dev`                     | `vite`                                          | Servidor de desenvolvimento Vite  |
| `build`                   | `tsc -b && vite build`                          | Typecheck + build de producao     |
| `preview`                 | `vite preview`                                  | Serve o build localmente          |
| `typecheck`               | `tsc -b`                                        | Verificacao de tipos isolada      |
| `lint` / `lint:fix`       | `eslint .` / `eslint . --fix`                   | ESLint sem/com autofix            |
| `format` / `format:check` | `prettier --write ...` / `prettier --check ...` | Prettier write/check              |
| `test`                    | `vitest run`                                    | Suite completa com Vitest         |
| `coverage`                | `vitest run --coverage`                         | Suite completa com cobertura (v8) |
| `validate`                | `typecheck && lint && format:check && test`     | Gate de qualidade completo        |
| `prepare`                 | `husky`                                         | Instala os hooks do Husky         |

### Build de producao

O build gera 3 chunks otimizados com vendor splitting:

| Arquivo      | Tamanho | Gzip    | Conteudo                                    |
| ------------ | ------- | ------- | ------------------------------------------- |
| `vendor.js`  | 157 kB  | 51.6 kB | React, React DOM, React Router              |
| `index.js`   | 122 kB  | 28.0 kB | Codigo da aplicacao, dominio, componentes   |
| `styles.js`  | 31 kB   | 11.9 kB | styled-components runtime                   |
| `index.html` | 4.4 kB  | 1.3 kB  | HTML com meta tags, JSON-LD e font preloads |

Total gzip: **~93 kB**

---

## 📦 O que foi entregue

### Requisitos obrigatorios

- Catalogo local de selecoes com camada de repositorio substituivel
- Busca por nome e codigo com combobox acessivel
- Navegacao por teclado no autocomplete
- Selecao e remocao de participantes
- Configuracao de quantidade de grupos e equipes por grupo
- Sorteio automatico
- Re-sortear mantendo o fluxo da sessao
- Ajuste manual por troca entre grupos
- Persistencia em `localStorage`
- Estados vazios, loading e mensagens de validacao
- Tipagem de dominio para `Team`, `Group`, `DrawSettings`, `DrawResult` e contratos relacionados
- Testes unitarios e de integracao cobrindo fluxo principal, persistencia e regras de dominio

### Extras do desafio

Todos os extras opcionais do enunciado foram cobertos:

- **Potes + restricoes por confederacao**
- **Seed de aleatoriedade** para reproduzir sorteios
- **Compartilhamento de resultado** com Web Share API e fallback para clipboard
- **Historico de sorteios**
- **Animacoes leves + acessibilidade mais completa**, incluindo focus management e suporte a `prefers-reduced-motion`

### Melhorias adicionais alem dos extras

- **Dark mode com toggle visivel no header** e persistencia da preferencia em `localStorage`
- Comparacao lado a lado entre sorteios salvos
- Undo da ultima troca manual
- Presets de configuracao (padrao do desafio, compacto, FIFA-like)
- Download do resultado em JSON
- Quick filters por confederacao no catalogo
- Log de atividade da sessao

---

## 📋 Matriz de aderência ao desafio

| Item do desafio                  | Status       | Como foi atendido                                                     |
| -------------------------------- | ------------ | --------------------------------------------------------------------- |
| React + TypeScript               | **Atendido** | Aplicacao em React 18 com TypeScript strict                           |
| Build tool                       | **Atendido** | Vite 6 + Vitest 3                                                     |
| Gerenciamento de estado          | **Atendido** | Context API + `useReducer`, com justificativa arquitetural abaixo     |
| Estilizacao                      | **Atendido** | `styled-components`, com tema tipado e tokens compartilhados          |
| Roteamento                       | **Atendido** | `react-router-dom`, mantendo a base preparada para crescimento        |
| Catalogo com busca               | **Atendido** | Catalogo local, filtro por nome/codigo e combobox acessivel           |
| Selecao/desselecao               | **Atendido** | Painel de selecionados + acoes de adicionar, remover e limpar         |
| Sorteio automatico               | **Atendido** | `drawEngine` com validacao previa e resultado persistivel             |
| Ajuste manual                    | **Atendido** | Troca entre grupos via UI controlada                                  |
| Persistencia simples             | **Atendido** | `localStorage` encapsulado em repositorios                            |
| Estados vazios / loading / erros | **Atendido** | Ready state, empty state, erro visivel e loading de sorteio           |
| Tipagem de dominio               | **Atendido** | Tipos explicitamente modelados e reutilizados                         |
| Testes unitarios                 | **Atendido** | Dominio, reducers, utilitarios e persistencia                         |
| Testes de integracao             | **Atendido** | Busca + sorteio, restore, swap, historico, compartilhamento e tema    |
| ESLint + Prettier                | **Atendido** | ESLint 9 flat config + Prettier + Husky + lint-staged + commitlint    |
| README completo                  | **Atendido** | Como rodar, testar, decisoes, regras, limitacoes, melhorias futuras   |
| AI_USAGE.md                      | **Atendido** | Ferramentas, etapas, prompts, adaptacoes manuais e validacao          |
| Extras opcionais                 | **Atendido** | Potes, confederacoes, seed, share, historico, motion e a11y expandida |

Essa tabela existe para deixar claro que o projeto nao apenas "parece completo", mas foi deliberadamente cruzado contra o enunciado.

---

## 🧱 Estrutura do projeto

```text
src/
  app/                          # bootstrap, providers, restore, routing
    persistence/                #   hidratacao do estado a partir do localStorage
    App.tsx                     #   componente raiz com BrowserRouter e layout
    AppProviders.tsx             #   composicao de providers (tema + teams + draw)
    routes.tsx                  #   configuracao de rotas

  components/                   # layout e componentes compartilhados
    layout/
      StitchLayout.tsx          #   GlobalNavBar, MainHeader, MainFooter
      stickyHeights.ts          #   constantes de medida para layout sticky

  constants/                    # dataset, chaves de storage, constantes gerais
    teams.json                  #   catalogo de 32 selecoes com pot e confederacao
    drawDefaults.ts             #   valores padrao (8 grupos, 4 por grupo)
    storageKeys.ts              #   chaves de localStorage

  features/
    draw/
      __tests__/                #   testes de integracao do fluxo de sorteio
      components/               #   configuracao, resultado, resumo, swap, ready state
        DrawConfigurationPanel  #     painel de opcoes com presets
        DrawResultsPanel        #     painel de resultado com grupos
        DrawGroupCard           #     card de grupo individual
        DrawSwapControls        #     interface de troca manual
        DrawExecutiveSummary    #     resumo estatistico do sorteio
        ReadyScene              #     estado inicial antes do sorteio
        SaveDrawModal           #     modal para salvar com label
        SavedDrawComparisonPanel #    comparacao lado a lado
        teamVisuals             #     helpers de renderizacao de equipes
      configuration/            #   presets de sorteio
        drawPresets.ts          #     padrao (8x4), compacto (4x4), FIFA-like
      context/                  #   reducer + provider do sorteio
        drawReducer.ts          #     10 actions: SET_RESULT, SWAP_TEAMS, UNDO, etc
        DrawContext.tsx          #     provider com auto-persistencia
      domain/                   #   engine, validator, RNG, politicas (zero React)
        drawEngine.ts           #     shuffle simples ou backtracking
        drawValidator.ts        #     7 validacoes de entrada
        confederationPolicy.ts  #     regra UEFA max 2, demais max 1
        confederationValidation.ts #  validacao de viabilidade antes do sorteio
        random.ts               #     seeded RNG (mulberry32) + Fisher-Yates shuffle
      history/                  #   salvar, restaurar e comparar sorteios
        savedDrawHistory.ts     #     CRUD de historico no localStorage
        compareSavedDraws.ts    #     diff grupo a grupo entre dois sorteios
      hooks/                    #   orquestracao do fluxo da pagina
        useDrawFlow.ts          #     ciclo completo: validar → sortear → swap → undo
      utils/                    #   share, sumarios, helpers de dominio
        shareDrawResult.ts      #     Web Share API + clipboard fallback
        summarizeDrawResult.ts  #     metricas de confederacao e diversidade
        groupLabel.ts           #     Grupo A, B, C... (suporta >26 grupos)

    teams/
      __tests__/                #   testes de busca, filtro e repositorio
      components/               #   combobox, catalogo e painel de selecionados
        TeamSearchCombobox.tsx  #     combobox acessivel com ARIA e keyboard nav
        AvailableTeamsCatalog   #     catalogo com quick filters por confederacao
        SelectedTeamsPanel      #     painel de equipes selecionadas
      context/                  #   reducer + provider de participantes
        teamsReducer.ts         #     6 actions: SELECT, DESELECT, FILL, CLEAR, etc
        TeamsContext.tsx         #     provider com auto-persistencia
      hooks/                    #   busca, debounce e selecao
        useTeamSearch.ts        #     query com debounce (200ms), suggestions, keyboard
        useTeamSelection.ts     #     selecao, remocao e autofill
      repositories/             #   catalogo local e contrato de dados
        ITeamRepository.ts      #     interface substituivel
        localTeamRepository.ts  #     implementacao sobre teams.json
      utils/                    #   filtro, normalizacao e busca
        filterTeams.ts          #     filtro por nome, codigo, confederacao

  hooks/                        # hooks compartilhados do app
  pages/                        # pagina principal e subareas da tela
    draw-page/
      DrawPage.tsx              #   coordenacao dos slices teams + draw
      drawPageSections.tsx      #   componentes de secao da pagina
      drawPageUtils.ts          #   helpers de UX e download

  repositories/                 # persistencia local generica
    IStorageRepository.ts       #   interface com save/load/clear
    localStorageRepository.ts   #   implementacao com tratamento de falha

  test/                         # infraestrutura de teste
    setup.ts                    #   jest-dom, cleanup, mock restore

  theme/                        # tokens, global styles e provider de tema
    theme.ts                    #   light + dark com 29 cores semanticas
    themeMode.tsx               #   toggle com persistencia e system preference
    themeModeContext.ts          #   contexto de tema
    globalStyles.ts             #   reset e estilos base
    styled.d.ts                 #   augmentacao de tipos para styled-components

  types/                        # contratos de dominio
    domain.ts                   #   Team, Group, DrawResult, DrawSettings, etc
    result.ts                   #   Result<T, E> para operacoes com falha
    index.ts                    #   barrel export
```

---

## 📊 Dataset de selecoes

O catalogo inclui 32 selecoes distribuidas em 5 confederacoes e 4 potes:

| Pot | CONMEBOL          | UEFA                                           | CONCACAF                | AFC                               | CAF               |
| --- | ----------------- | ---------------------------------------------- | ----------------------- | --------------------------------- | ----------------- |
| 1   | Argentina, Brazil | France, England, Spain                         | Canada*, Mexico*, USA\* |                                   |                   |
| 2   | Uruguay, Colombia | Germany, Portugal, Italy, Netherlands, Belgium |                         |                                   | Morocco           |
| 3   | Ecuador           | Croatia, Denmark, Switzerland, Poland          |                         | Japan, South Korea, Iran, Senegal |                   |
| 4   | Chile             | Serbia                                         | Costa Rica              | Australia, Saudi Arabia           | Nigeria, Cameroon |

\* Selecoes sede (`qualificationType: "host"`)

---

## 💻 Modelagem de tipos

### Tipos de dominio (`src/types/domain.ts`)

```typescript
type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
type QualificationType = 'host' | 'qualified';
type ConfederationPolicy = 'none' | 'fifa-like';
type Pot = 1 | 2 | 3 | 4;

interface Team {
  id: string;
  name: string;
  code: string;
  confederation: Confederation;
  pot?: Pot;
  qualificationType?: QualificationType;
}

interface DrawSettings {
  numberOfGroups: number;
  teamsPerGroup: number;
  confederationPolicy: ConfederationPolicy;
}

interface Group {
  id: string; // "group-a", "group-b", ...
  teams: Team[];
}

interface DrawResult {
  groups: Group[];
  settings: DrawSettings;
  seed: number; // seed usada para reproduzir o sorteio
  timestamp: number; // momento da geracao
}

type DrawStatus = 'idle' | 'configured' | 'loading' | 'drawn';
type SimulatorPageState = 'empty' | 'selecting' | 'ready' | 'drawing' | 'result' | 'swap_error';
```

### Tipo utilitario (`src/types/result.ts`)

```typescript
type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };
```

Usado em todo o dominio e persistencia para representar operacoes que podem falhar sem lancar excecao.

### Estado da aplicacao

```typescript
// Slice de equipes
interface TeamState {
  catalog: Team[];
  selectedIds: string[];
}

// Slice do sorteio
interface DrawState {
  settings: DrawSettings;
  result: DrawResult | null;
  status: DrawStatus;
  lastError: string | null;
  undoResult: DrawResult | null;
}

// Payload de troca manual
interface SwapPayload {
  sourceGroupId: string;
  sourceTeamId: string;
  targetGroupId: string;
  targetTeamId: string;
}
```

### Actions do reducer

```typescript
// Teams: LOAD_CATALOG, SELECT_TEAM, DESELECT_TEAM, FILL_SELECTION, CLEAR_SELECTION, RESTORE_SELECTION
// Draw:  UPDATE_SETTINGS, SET_RESULT, SET_LOADING, SET_ERROR, SWAP_TEAMS, UNDO_LAST_SWAP, CLEAR_ERROR, RESET, RESTORE_STATE
```

---

## 🔄 Fluxo principal da aplicacao

```text
                    ┌────────────────────────────────────────────────────────┐
                    │                     AppProviders                       │
                    │  restaura estado do localStorage na montagem          │
                    └────────────────────┬───────────────────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
       ThemeModeProvider          TeamsProvider               DrawProvider
       (light/dark + persist)    (catalogo + selecao)       (settings + result)
              │                          │                          │
              └──────────────────────────┼──────────────────────────┘
                                         │
                                         ▼
                                     DrawPage
                              (coordena os dois slices)
                                         │
                 ┌───────────┬───────────┼───────────┬───────────┐
                 ▼           ▼           ▼           ▼           ▼
             Simulador   Participantes  Opcoes    Historico   Comparacao
               (tab)        (tab)       (tab)      (tab)       (tab)
```

### Jornada do usuario

1. O catalogo local e carregado pelo repositorio de times
2. O usuario busca e seleciona participantes via combobox acessivel
3. O usuario configura o sorteio (grupos, tamanho, politica de confederacao)
4. `drawValidator` confirma se a configuracao e viavel
5. `drawEngine` executa shuffle simples ou backtracking, conforme as restricoes ativas
6. O `DrawResult` gerado e persistido junto com a configuracao atual
7. A UI passa para o estado de resultado, habilitando share, save, compare, re-sort e swap manual
8. Se participantes ou configuracao mudarem depois disso, o resultado anterior e invalidado

---

## 🛡️ Invariantes importantes do sistema

Estas regras ajudam a entender o desenho do codigo:

- um resultado salvo sempre reflete um conjunto especifico de participantes + configuracao + seed
- um resultado exibido nao pode sobreviver a mudancas de setup sem ser invalidado
- regras de restricao precisam valer tanto no sorteio automatico quanto nas trocas manuais
- a UI nunca deve depender de `Math.random` diretamente para corretude do sorteio
- falhas de `localStorage` nao podem tornar a aplicacao inutilizavel

---

## ⚽ Regras de dominio implementadas

### Regras obrigatorias

| Regra                    | Modulo                        | Descricao                                              |
| ------------------------ | ----------------------------- | ------------------------------------------------------ |
| Contagem correta         | `drawValidator`               | `participants.length === groups * teamsPerGroup`       |
| Sem duplicidade          | `drawValidator`               | IDs unicos no Set de participantes                     |
| Distribuicao uniforme    | `drawEngine`                  | Todos os grupos com exatamente `teamsPerGroup` equipes |
| Invalidacao de resultado | `drawReducer` / `useDrawFlow` | Resultado limpo quando setup muda depois do sorteio    |

### Regras opcionais implementadas

#### Potes (`pot: 1 | 2 | 3 | 4`)

- Cada equipe pode ter `pot` de 1 a 4 (atribuido no dataset)
- O sorteio evita colocar duas equipes do mesmo pote no mesmo grupo
- O validator rejeita cenarios inviaveis antes de iniciar o sorteio
- Mensagem: `"Não é possível distribuir X equipes do pote Y em Z grupos com limite de 1 por grupo."`

#### Confederacao FIFA-like

| Confederacao | Limite por grupo |
| ------------ | ---------------- |
| UEFA         | 2                |
| CONMEBOL     | 1                |
| CONCACAF     | 1                |
| AFC          | 1                |
| CAF          | 1                |
| OFC          | 1                |

- A validacao de viabilidade roda antes do sorteio (`confederationValidation.ts`)
- A mesma regra vale no sorteio automatico e na troca manual (`isTeamAllowedInGroup`)
- Mensagem: `"Não é possível distribuir X equipes da UEFA em Y grupos com limite de 2 por grupo."`

#### Seed deterministica

- O sorteio gera ou recebe uma `seed` (inteiro positivo)
- A `seed` passa a compor o `DrawResult`
- O RNG usa o algoritmo **mulberry32** (`createSeededRng`) com **Fisher-Yates shuffle**
- Com a mesma entrada e a mesma `seed`, o sorteio e reproduzivel

### Estrategia do algoritmo

O `drawEngine` usa dois caminhos:

| Cenario                          | Algoritmo    | Complexidade  |
| -------------------------------- | ------------ | ------------- |
| Sem restricoes (policy = `none`) | Fisher-Yates | O(n)          |
| Com potes e/ou confederacao      | Backtracking | Exponencial\* |

\* Na pratica, com 32 equipes e restricoes FIFA-like, o backtracking converge rapidamente. Se a configuracao for inviavel, o validator ja rejeita antes de entrar no engine.

```text
drawEngine(participants, settings, options?)
  │
  ├─ drawValidator(participants, settings) → Result<ValidPayload>
  │   ├─ valida contagem
  │   ├─ valida duplicidade
  │   ├─ valida distribuicao de potes
  │   └─ valida distribuicao de confederacao
  │
  ├─ se nao precisa backtracking:
  │   └─ shuffle + slice em grupos
  │
  └─ se precisa backtracking:
      └─ assignTeamsWithBacktracking(shuffled, groups, settings, index, rng)
          ├─ filtra grupos elegiveis (tamanho + confederacao + pote)
          ├─ embaralha grupos elegiveis
          ├─ tenta alocar no primeiro grupo
          │   ├─ sucesso → avanca para o proximo time
          │   └─ falha → desfaz (pop) e tenta proximo grupo
          └─ retorna false se nenhum grupo aceita
```

### Comportamento esperado sob falha

O sistema foi desenhado para falhar de forma explicita:

| Cenario                      | Comportamento                                              |
| ---------------------------- | ---------------------------------------------------------- |
| Configuracao inviavel        | Validator rejeita com mensagem em portugues                |
| Backtracking sem solucao     | Engine retorna `Result.error` com mensagem clara           |
| localStorage corrompido      | Fallback para estado padrao, app continua funcional        |
| localStorage indisponivel    | Operacoes de persistencia absorvem erro, UI nao quebra     |
| Troca invalida (mesmo grupo) | Estado preservado, mensagem de erro exibida                |
| Troca que viola confederacao | Estado preservado, equipes mantidas nas posicoes originais |

---

## 🏛️ Decisoes arquiteturais

### 1. Estado dividido por dominio

O estado foi separado em dois slices principais:

- `teams`: catalogo, selecionados e fluxo de busca
- `draw`: configuracao, resultado, loading, erro, undo e restore

Essa divisao evita acoplamento entre busca/selecoes e resultado do sorteio. O `DrawPage` coordena os slices, mas as regras de dominio continuam fora da UI.

### 2. Context API + useReducer em vez de Zustand/Redux

O projeto tem um unico fluxo principal, baixa profundidade de assinaturas e pouco estado global derivado. `Context + useReducer` atende bem ao desafio porque:

- mantem a dependencia do projeto enxuta
- deixa as transicoes de estado explicitas
- facilita testes de reducer e restore
- evita introduzir infraestrutura a mais sem ganho real para esse tamanho de app

Se o produto virasse multi-edicao, multi-competicao ou colaborativo, uma biblioteca de estado dedicada passaria a ser mais justificavel.

### 3. Dominio isolado em funcoes puras

As regras do sorteio vivem em `src/features/draw/domain/`:

| Modulo                       | Responsabilidade                               | Linhas |
| ---------------------------- | ---------------------------------------------- | ------ |
| `drawEngine.ts`              | Algoritmo de sorteio (shuffle + backtracking)  | 148    |
| `drawValidator.ts`           | 7 validacoes de entrada                        | 93     |
| `confederationPolicy.ts`     | Regra de limite por confederacao               | 47     |
| `confederationValidation.ts` | Viabilidade da distribuicao antes do sorteio   | 50     |
| `random.ts`                  | Seeded RNG (mulberry32) + Fisher-Yates shuffle | 34     |

Esses modulos nao importam React. Isso foi uma decisao central porque:

- regras de negocio mudam mais que a UI
- o desafio pede testabilidade real
- o algoritmo de sorteio precisa continuar previsivel sob teste

### 4. Persistencia atras de repositorios

Mesmo usando `localStorage`, o acesso foi encapsulado em uma camada de repositorio com interface generica:

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

Trade-off adotado:

- para o MVP, `localStorage` resolve o requisito com baixo custo
- para evolucao futura, o codigo ja permite trocar a implementacao por API sem reescrever os componentes

### 5. Tema centralizado e tipado

O sistema visual possui:

- tema `light` e tema `dark` com 29 cores semanticas cada
- `ThemeModeProvider` com deteccao de `prefers-color-scheme`
- tokens compartilhados de cor, espacamento, sombras, tipografia e motion
- persistencia da preferencia em `localStorage`

| Token       | Valores                                        |
| ----------- | ---------------------------------------------- |
| Spacing     | xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px |
| Radii       | sm: 8px, md: 16px, lg: 32px, xl: 48px          |
| Typography  | Inter (body/heading), JetBrains Mono (mono)    |
| Motion      | fast: 160ms, base: 320ms, slow: 560ms          |
| Breakpoints | xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280  |

### 6. Motion com intencao, nao por excesso

As animacoes foram mantidas curtas e funcionais:

- entrada do painel de resultado
- reveal escalonado dos grupos (stagger step: 90ms)
- microinteracoes de hover/focus
- transicoes de tema e superficies

Tambem foi adicionado `prefers-reduced-motion`, para o comportamento continuar acessivel quando o usuario pede menos animacao.

### 7. Rota unica, mas com fronteira de navegacao preservada

Mesmo com uma unica tela no MVP, `react-router-dom` foi mantido porque:

- preserva um `App shell` limpo
- evita acoplar a tela principal ao bootstrap
- reduz custo futuro para separar historico, detalhes de sorteio ou outras views

O trade-off aceito aqui foi carregar uma camada de roteamento que hoje parece pequena, em troca de manter uma fronteira arquitetural clara desde o inicio.

### 8. Provider stack

```typescript
ThemeModeProvider                   // tema light/dark + persist + system preference
  └─ TeamsProvider(initialState)    // catalogo + selectedIds + auto-persist
      └─ DrawProvider(initialState) // settings + result + status + auto-persist
          └─ App (BrowserRouter + Layout + Routes)
```

A hidratacao acontece em `AppProviders.tsx` via `restoreAppState()`, que:

1. carrega o catalogo de times pelo repositorio
2. restaura `selectedIds` do localStorage
3. restaura `drawState` do localStorage
4. monta o estado hidratado filtrando IDs orfaos e resultados stale

---

## ✨ Alternativas consideradas

### Zustand ou Redux Toolkit

Nao foram adotados porque o app ainda nao sofre com:

- compartilhamento profundo de estado entre areas independentes
- seletores complexos
- efeitos assincromos com alto acoplamento

Seriam validos numa fase posterior, mas aqui tenderiam a adicionar ceremony demais para um fluxo principal relativamente linear.

### CSS Modules ou Tailwind

Nao foram escolhidos por dois motivos:

- o projeto precisava de **tema centralizado**, inclusive com light/dark mode e motion tokens
- `styled-components` permitiu co-localizar o comportamento visual perto dos componentes sem perder composicao

O trade-off e conhecido: CSS-in-JS pode custar mais em runtime do que CSS extraido. Para o tamanho deste take-home, a ergonomia pesou mais do que esse custo.

### Drag-and-drop para trocas

Foi deliberadamente deixado de fora do MVP porque a troca via selects:

- e mais facil de testar
- e mais previsivel para acessibilidade
- satisfaz o requisito do desafio com menos risco de bug comportamental

Se o produto evoluir, o passo correto seria um drag-and-drop acessivel, nao uma interacao mouse-only.

---

## ♿ UX e acessibilidade

Itens tratados como requisitos de produto, nao como polimento:

| Recurso                    | Implementacao                                               |
| -------------------------- | ----------------------------------------------------------- |
| Combobox acessivel         | `role="combobox"`, `aria-expanded`, `aria-activedescendant` |
| Navegacao por teclado      | Arrow keys, Enter, Escape, Home, End no autocomplete        |
| Tabs semanticas            | `role="tablist"`, `role="tab"`, `role="tabpanel"`           |
| Live regions               | `aria-live="polite"` para loading e feedback                |
| Skip link                  | Link para `#main-content` visivel em focus                  |
| Focus management em modais | Foco inicial controlado, `Escape` para fechar               |
| Feedback de erro e sucesso | Texto visivel, nao apenas cor                               |
| Dark mode                  | Toggle com persistencia + deteccao de system preference     |
| Reduced motion             | `prefers-reduced-motion` respeitado em todas as animacoes   |

### SEO e meta tags

O `index.html` inclui:

- Open Graph tags completas (title, description, image, locale)
- Twitter Card (summary_large_image)
- JSON-LD structured data (WebApplication schema)
- Favicon SVG + PNG 32px + Apple Touch Icon
- Web manifest (`manifest.json`)
- Font preloading com `media="print"` + `onload` para nao bloquear render

---

## 🧪 Estrategia de testes

A suite atual cobre **23 arquivos de teste** e **132 testes**.

### Distribuicao por tipo

| Tipo            | Arquivos | Testes | O que cobre                                                |
| --------------- | -------- | ------ | ---------------------------------------------------------- |
| Unitarios       | 14       | 62     | Dominio, reducers, utilitarios, persistencia, presets      |
| Integracao (UI) | 9        | 70     | Fluxos completos com render, user-event e assertions de UI |

### 📑 Catalogo completo de testes

#### Testes unitarios

<details>
<summary><b>Clique para ver todos os testes unitários</b></summary>

**`drawValidator.test.ts`** (8 testes)

- rejeita grupo < minimo
- rejeita participantes != configuracao
- rejeita IDs duplicados
- aceita participantes validos
- rejeita distribuicao de confederacao inviavel com FIFA-like
- aceita distribuicao viavel com FIFA-like
- rejeita distribuicao de pote inviavel
- aceita distribuicao FIFA-like que depende do limite duplo da UEFA

**`drawEngine.test.ts`** (3 testes)

- cria grupos uniformes sem duplicatas
- retorna erro de validacao em vez de gerar sorteio invalido
- cria grupos FIFA-like sem violar limites de confederacao

**`confederationPolicy.test.ts`** (6 testes)

- retorna sem limite quando policy = none
- retorna limite 2 para UEFA com FIFA-like
- retorna limite 1 para CONMEBOL com FIFA-like
- permite segundo time UEFA no grupo com FIFA-like
- rejeita terceiro time UEFA no grupo com FIFA-like
- rejeita grupo que excede limite da UEFA

**`drawReducer.test.ts`** (10 testes)

- atualiza settings e mantem slice configurado
- transiciona por loading e drawn
- invalida resultado stale sem perder settings
- invalida resultado quando policy de confederacao muda
- troca equipes entre grupos e preserva tamanho
- mantem estado quando mesmo time e enviado duas vezes
- rejeita swap quando tenta reusar o mesmo grupo
- armazena erro de sorteio e mantem slice configurado
- rejeita swap que quebraria policy de confederacao
- armazena resultado anterior apos swap e limpa apos undo

**`filterTeams.test.ts`** (4 testes)

- normaliza case e acentos
- filtra por nome ou codigo e exclui selecionados
- filtra por confederacao e query combinados
- retorna equipes selecionadas com filtro "selected"

**`localStorageRepository.test.ts`** (7 testes)

- salva e carrega dados estruturados
- retorna null para chaves ausentes
- retorna erro para JSON invalido
- limpa dados persistidos
- retorna indisponivel quando window.localStorage nao existe
- fallback para erros genericos em excepcoes non-Error
- retorna erro de leitura quando storage lanca excecao

**`summarizeDrawResult.test.ts`** (1 teste)

- deriva metricas factuais a partir do resultado

**`savedDrawHistory.test.ts`** (3 testes)

- cria entrada salva com label e preserva metadados
- hidrata entries legados sem label com fallback legivel
- descarta registros malformados na sanitizacao
</details>

#### Testes de integracao (UI)

<details>
<summary><b>Clique para ver todos os testes de integração</b></summary>

**`App.test.tsx`** (7 testes)

- roteia search trigger do header para o combobox de participantes
- inicia em modo claro sem preferencia persistida
- alterna dark mode pelo header e persiste selecao
- restaura dark mode da preferencia persistida na montagem

**`teamSearchFlow.test.tsx`** (7 testes)

- abre a view de participantes e permite selecao por teclado via codigo
- atualiza lista de sugestoes apenas apos debounce
- suporta busca por codigo, remocao, clear all e feedback de vazio
- filtra catalogo por confederacao e mantem query composta com chip ativo

**`drawConfigurationFlow.test.tsx`** (11 testes)

- desbloqueia configuracao progressivamente, suporta autofill e armazena resultado
- registra mudancas de policy de confederacao na atividade
- aplica preset pelo mesmo fluxo de settings e invalida resultado atual
- mostra feedback de validacao e desabilita botao com FIFA-like
- roda sorteio bem-sucedido para set viavel com FIFA-like

**`drawResultsPanel.test.tsx`** (19 testes)

- compartilha resultado via Web Share API e loga feedback
- copia resultado via clipboard quando share nao esta disponivel
- abre modal de save com label sugerido antes de salvar
- restaura composicao anterior apos undo do ultimo swap
</details>

---

## ✅ Qualidade e convencoes

| Pratica                | Detalhe                                                  |
| ---------------------- | -------------------------------------------------------- |
| TypeScript strict      | `strict: true`, `noUncheckedIndexedAccess` habilitado    |
| `Result<T>`            | Para operacoes com falha esperada, sem throw             |
| ESLint 9               | Flat config, `typescript-eslint` recommended + stylistic |
| Husky / lint-staged    | Pre-commit hooks com lint e format automático            |
| Codigo-fonte em ingles | Variaveis, funcoes, tipos, componentes, testes           |
| Interface em portugues | Textos de UI, mensagens de erro, labels                  |

---

## 🚀 Proximos passos naturais

- Introduzir backend e sincronizacao remota dos sorteios
- Adicionar fase de mata-mata
- Evoluir para drag-and-drop acessivel nas trocas
- Expandir o dominio para multiplas edicoes da Copa
