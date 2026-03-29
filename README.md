# World Cup Draw Simulator

Simulador de sorteio da fase de grupos da Copa do Mundo feito em React + TypeScript.

O projeto foi estruturado para atender o desafio tecnico com um minimo solido e evolutivo:

- montar a lista de participantes via busca acessivel
- configurar o sorteio
- gerar grupos automaticamente com regras de dominio testaveis
- ajustar o resultado manualmente
- persistir a sessao localmente

O escopo implementado para o desafio foi a **Opcao A — fase de grupos**. Mata-mata ficou deliberadamente fora do MVP.

## Stack

| Escolha                      | Motivo                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| **React 18 + TypeScript**    | Base pedida no desafio, com tipagem forte e modelagem explicita do dominio               |
| **Vite**                     | Setup simples, build rapido, boa ergonomia para take-home e integracao nativa com Vitest |
| **Context API + useReducer** | Suficiente para o escopo atual, sem custo extra de biblioteca de estado                  |
| **styled-components**        | Tema tipado, co-localizacao de estilos e composicao simples de tokens visuais            |
| **react-router-dom**         | Mantem a estrutura preparada para crescer, mesmo com rota unica no MVP                   |
| **Vitest + Testing Library** | Mesma pipeline do Vite e testes orientados ao comportamento real do usuario              |

## Criterios de projeto

As decisoes tecnicas foram guiadas por quatro criterios principais:

- **Corretude de dominio**: o sorteio precisa respeitar regras testaveis e previsiveis
- **Clareza de fluxo**: a jornada principal deve ser simples de seguir, inclusive sob erro
- **Baixo acoplamento**: UI, dominio e persistencia precisam evoluir sem reescrita em cascata
- **Escalabilidade pragmatica**: preparar o terreno para crescer sem superengenharia no MVP

## Como rodar

```bash
npm install
npm run dev
```

Aplicacao local: `http://localhost:5173`

## Como validar

```bash
npm run build
npx vitest run
npm run coverage
npm run validate
```

### Scripts disponiveis

| Script                    | Descricao                                |
| ------------------------- | ---------------------------------------- |
| `dev`                     | Servidor de desenvolvimento Vite         |
| `build`                   | Typecheck + build de producao            |
| `preview`                 | Serve o build localmente                 |
| `typecheck`               | Verificacao de tipos isolada             |
| `lint` / `lint:fix`       | ESLint sem/com autofix                   |
| `format` / `format:check` | Prettier write/check                     |
| `test`                    | Suite completa com Vitest                |
| `coverage`                | Suite completa com cobertura             |
| `validate`                | Typecheck + lint + format check + testes |

## O que foi entregue

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

- **Dark mode com toggle visivel no header**
- Persistencia da preferencia de tema em `localStorage`
- Comparacao lado a lado entre sorteios salvos
- Undo da ultima troca manual
- Presets de configuracao
- Download do resultado em JSON
- Quick filters por confederacao no catalogo
- Log de atividade da sessao

## Matriz de aderencia ao desafio

| Item do desafio                  | Status       | Como foi atendido                                                     |
| -------------------------------- | ------------ | --------------------------------------------------------------------- |
| React + TypeScript               | **Atendido** | Aplicacao em React 18 com TypeScript strict                           |
| Build tool                       | **Atendido** | Vite + Vitest                                                         |
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
| Extras opcionais                 | **Atendido** | Potes, confederacoes, seed, share, historico, motion e a11y expandida |

Essa tabela existe para deixar claro que o projeto nao apenas "parece completo", mas foi deliberadamente cruzado contra o enunciado.

## Decisoes arquiteturais

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

- `drawValidator`
- `drawEngine`
- `confederationPolicy`
- `random`

Esses modulos nao importam React. Isso foi uma decisao central porque:

- regras de negocio mudam mais que a UI
- o desafio pede testabilidade real
- o algoritmo de sorteio precisa continuar previsivel sob teste

### 4. Persistencia atras de repositorios

Mesmo usando `localStorage`, o acesso foi encapsulado em uma camada de repositorio. Isso reduz espalhamento de `JSON.parse`, `JSON.stringify` e tratamento de falhas pelo app.

Trade-off adotado:

- para o MVP, `localStorage` resolve o requisito com baixo custo
- para evolucao futura, o codigo ja permite trocar a implementacao por API sem reescrever os componentes

### 5. Tema centralizado e tipado

O sistema visual passou a ter:

- tema `light`
- tema `dark`
- `ThemeModeProvider`
- tokens compartilhados de cor, espacamento, sombras e motion

Isso evita dark mode “por excecao” e permite tratar o visual como parte da arquitetura, nao como uma camada cosmética solta.

### 6. Motion com intencao, nao por excesso

As animacoes foram mantidas curtas e funcionais:

- entrada do painel de resultado
- reveal escalonado dos grupos
- microinteracoes de hover/focus
- transicoes de tema e superficies

Tambem foi adicionado `prefers-reduced-motion`, para o comportamento continuar acessivel quando o usuario pede menos animacao.

### 7. Rota unica, mas com fronteira de navegacao preservada

Mesmo com uma unica tela no MVP, `react-router-dom` foi mantido porque:

- preserva um `App shell` limpo
- evita acoplar a tela principal ao bootstrap
- reduz custo futuro para separar historico, detalhes de sorteio ou outras views

O trade-off aceito aqui foi carregar uma camada de roteamento que hoje parece pequena, em troca de manter uma fronteira arquitetural clara desde o inicio.

## Alternativas consideradas

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

## Estrutura do projeto

```text
src/
  app/            # bootstrap, providers, restore, routing
  components/     # layout e componentes compartilhados
  constants/      # dataset, chaves de storage, constantes gerais
  features/
    draw/
      components/     # configuracao, resultado, resumo, swap, ready state
      configuration/  # presets de sorteio
      context/        # reducer + provider do sorteio
      domain/         # engine, validator, RNG, politicas
      history/        # salvar, restaurar e comparar sorteios
      hooks/          # orquestracao do fluxo da pagina
      utils/          # share, sumarios, helpers de dominio
    teams/
      components/     # combobox, catalogo e painel de selecionados
      context/        # reducer + provider de participantes
      hooks/          # busca, debounce e selecao
      repositories/   # catalogo local e contrato de dados
      utils/          # filtro, normalizacao e busca
  pages/          # pagina principal e subareas da tela
  repositories/   # persistencia local generica
  theme/          # tokens, global styles e provider de tema
  types/          # contratos de dominio
```

## Fluxo principal da aplicacao

1. O catalogo local e carregado pelo repositorio de times.
2. O usuario busca e seleciona participantes via combobox acessivel.
3. `DrawPage` coordena os slices `teams` e `draw`.
4. Ao iniciar o sorteio, `drawValidator` confirma se a configuracao e viavel.
5. `drawEngine` executa shuffle simples ou backtracking, conforme as restricoes ativas.
6. O `DrawResult` gerado e persistido junto com a configuracao atual.
7. A UI passa para o estado de resultado, habilitando share, save, compare, re-sort e swap manual.
8. Se participantes ou configuracao mudarem depois disso, o resultado anterior e invalidado para evitar inconsistencias.

## Invariantes importantes do sistema

Estas regras ajudam a entender o desenho do codigo:

- um resultado salvo sempre reflete um conjunto especifico de participantes + configuracao + seed
- um resultado exibido nao pode sobreviver a mudancas de setup sem ser invalidado
- regras de restricao precisam valer tanto no sorteio automatico quanto nas trocas manuais
- a UI nunca deve depender de `Math.random` diretamente para corretude do sorteio
- falhas de `localStorage` nao podem tornar a aplicacao inutilizavel

## Regras de dominio implementadas

### Regras obrigatorias

- Nao permite sorteio com contagem incorreta de participantes
- Nao permite duplicidade de selecao
- Mantem distribuicao uniforme entre grupos
- Invalida resultado antigo quando participantes ou configuracao mudam

### Regras opcionais implementadas

#### Potes

- Cada equipe pode ter `pot` de `1` a `4`
- O sorteio evita colocar duas equipes do mesmo pote no mesmo grupo
- O validator rejeita cenarios inviaveis antes de iniciar o sorteio

#### Confederacao FIFA-like

- UEFA: maximo 2 por grupo
- Demais confederacoes: maximo 1 por grupo
- A mesma regra vale tanto no sorteio automatico quanto na troca manual

#### Seed deterministica

- O sorteio gera ou recebe uma `seed`
- A `seed` passa a compor o `DrawResult`
- Com a mesma entrada e a mesma `seed`, o sorteio pode ser reproduzido

### Estrategia do algoritmo

O `drawEngine` usa dois caminhos:

- shuffle simples quando nao ha restricoes adicionais
- backtracking quando existe politica de confederacao e/ou restricao por pote

Essa escolha evita custo desnecessario no caso simples e, ao mesmo tempo, preserva corretude quando o dominio exige busca com restricoes.

### Comportamento esperado sob falha

O sistema foi desenhado para falhar de forma explicita:

- configuracoes inviaveis sao rejeitadas no validator antes de entrar no engine
- falhas de sorteio aparecem como erro de produto, nao como quebra silenciosa
- falhas de persistencia local sao absorvidas defensivamente para manter a UI utilizavel
- trocas invalidas preservam o estado anterior e exibem mensagem clara ao usuario

## UX e acessibilidade

Itens tratados como requisitos de produto, nao como polimento:

- Combobox com suporte a teclado
- `aria-*` nas areas principais
- tabs com semantica de `tablist`
- live regions para loading e feedback
- skip link para o conteudo principal
- modais com foco inicial controlado
- suporte a `Escape` nos dialogs
- feedback de erro e sucesso em texto visivel
- toggle de tema claro/escuro com estado persistido
- suporte a `prefers-reduced-motion`

## Estrategia de testes

A suite atual cobre **23 arquivos de teste** e **131 testes**.

### Unitarios

- validacao do sorteio
- engine do sorteio
- politica por confederacao
- reducers
- normalizacao e filtro de busca
- persistencia local
- presets
- sumarizacao e historico

### Integracao

- selecionar equipes via busca e sortear
- invalidador de resultado antigo
- restore da sessao ao recarregar
- salvar, compartilhar e comparar sorteios
- swap manual e undo
- resiliencia quando `localStorage` falha
- toggle de dark mode persistido
- reveal escalonado dos grupos renderizados

### O que os testes procuram garantir

Mais do que contar arquivos, a estrategia foi validar riscos reais do produto:

- o usuario consegue sair da busca e chegar ate um sorteio valido
- um resultado antigo nao permanece ativo quando o setup muda
- regras de dominio nao ficam enterradas na UI
- persistencia quebrada nao derruba a experiencia
- recursos opcionais como share, historico, dark mode e motion nao regressam silenciosamente

## Qualidade e convenções

- TypeScript strict
- `Result<T>` para operacoes com falha esperada
- ESLint e Prettier configurados
- Husky + lint-staged + commitlint
- Codigo-fonte em ingles e interface em portugues
- Persistencia com tratamento defensivo para falhas de storage

## Trade-offs adotados

### O que ficou de fora de proposito

- **Mata-mata**: nao fazia parte do escopo minimo escolhido
- **Backend/API**: desafio aceitava dataset local e persistencia simples
- **SSR**: nao trazia valor proporcional para uma SPA local-first deste escopo
- **Drag-and-drop**: a troca manual por selects entrega o requisito com menor custo e mais previsibilidade de acessibilidade
- **PWA/offline**: bom candidato para evolucao, mas fora do objetivo principal do take-home

### O que foi priorizado

- corretude do dominio
- clareza de fluxo
- testabilidade
- documentacao alinhada ao codigo entregue

## Como eu avaliaria este repositorio em uma entrevista

Se eu estivesse revisando este projeto como entrevistador tecnico, os pontos que eu abriria primeiro seriam:

- `src/features/draw/domain/` para entender a modelagem e a corretude do sorteio
- `src/features/teams/components/TeamSearchCombobox.tsx` para avaliar UX e acessibilidade da busca
- `src/features/draw/hooks/useDrawFlow.ts` para ver a orquestracao da sessao
- `src/app/AppProviders.tsx` e `src/app/persistence/restoreAppState.ts` para entender hidratacao e resiliencia
- `src/features/draw/__tests__/drawConfigurationFlow.test.tsx` e `src/features/draw/__tests__/drawResultsPanel.test.tsx` para conferir a confianca dos fluxos reais

Essa trilha de leitura foi um criterio de organizacao do projeto: o repositorio deveria continuar legivel para uma avaliacao senior em tempo limitado.

## Limitacoes atuais

- Dados ainda sao locais, sem backend
- Troca manual continua baseada em selects, nao em drag-and-drop
- O projeto continua SPA client-side only
- Nao existe fase de mata-mata
- Nao ha PWA com service worker

## Proximos passos naturais

- Introduzir backend e sincronizacao remota dos sorteios
- Adicionar fase de mata-mata
- Evoluir para drag-and-drop acessivel nas trocas
- Explorar PWA e offline-first
- Expandir o dominio para multiplas edicoes da Copa

## IA no desenvolvimento

O uso de IA foi documentado em [AI_USAGE.md](./AI_USAGE.md).

## Estado atual da validacao

Ultima verificacao local desta versao:

- `npm run build` passando
- `npx vitest run` passando com **23 arquivos** e **131 testes**
