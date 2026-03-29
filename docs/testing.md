# Testes

Estratégia, cobertura, catálogo completo e build de produção.

---

## Visão geral

**23 arquivos** · **132 testes** · Vitest + Testing Library

| Métrica          | Valor  |
| ---------------- | ------ |
| Statements/lines | 95.50% |
| Branches         | 92.42% |
| Functions        | 96.64% |

| Tipo            | Arquivos | Testes | O que cobre                                                |
| --------------- | -------- | ------ | ---------------------------------------------------------- |
| Unitários       | 15       | 72     | Domínio, reducers, hooks, utilitários, persistência        |
| Integração (UI) | 8        | 60     | Fluxos completos com render, roteamento, restore e UI real |

### Como executar

```bash
npm run test         # suíte completa
npm run coverage     # suíte com cobertura (v8)
npm run validate     # typecheck + lint + format check + testes
```

---

## Catálogo completo

### Testes unitários

| Arquivo                         | Testes | Escopo principal                                               |
| ------------------------------- | ------ | -------------------------------------------------------------- |
| `createHydratedAppState.test.ts` | 4      | Hidratação segura, defaults e descarte de estado inválido      |
| `drawPresets.test.ts`           | 4      | Presets padrão, compacto e FIFA-like                           |
| `confederationPolicy.test.ts`   | 6      | Limites por confederação e regra especial da UEFA              |
| `compareSavedDraws.test.ts`     | 2      | Diff entre sorteios salvos                                     |
| `savedDrawHistory.test.ts`      | 3      | Persistência, labels e sanitização do histórico                |
| `summarizeDrawResult.test.ts`   | 1      | Métricas derivadas do resultado                                |
| `drawEngine.test.ts`            | 3      | Geração de grupos válidos com e sem restrições                 |
| `drawReducer.test.ts`           | 10     | Transições de estado, invalidação, swap e undo                 |
| `drawValidator.test.ts`         | 8      | Contagem, duplicidade, potes e viabilidade por confederação    |
| `useDrawFlow.test.tsx`          | 3      | Orquestração do fluxo do sorteio via hook                      |
| `useSimulatorPageFlow.test.ts`  | 8      | Derivação de estado visual do simulador                        |
| `filterTeams.test.ts`           | 4      | Busca, normalização e filtros combinados                       |
| `localTeamRepository.test.ts`   | 1      | Carregamento do catálogo local                                 |
| `drawPageUtils.test.ts`         | 8      | Helpers da página principal e utilidades de interação          |
| `localStorageRepository.test.ts` | 7     | Save/load/clear com fallback para falhas de storage            |

### Testes de integração (UI)

| Arquivo                        | Testes | Escopo principal                                                |
| ------------------------------ | ------ | --------------------------------------------------------------- |
| `App.test.tsx`                 | 7      | Shell principal, foco de busca e persistência de tema           |
| `drawConfigurationFlow.test.tsx` | 11   | Configuração progressiva, presets, validação e início do draw   |
| `drawPersistenceFlow.test.tsx` | 10     | Restore, invalidação, histórico e comparação de sorteios        |
| `persistenceRestore.test.tsx`  | 3      | Reload completo e resiliência a storage inválido                |
| `routes.test.tsx`              | 1      | Roteamento da rota raiz                                         |
| `teamSearchFlow.test.tsx`      | 7      | Seleção por teclado, debounce, filtros e empty states           |
| `drawResultsPanel.test.tsx`    | 19     | Share, save, feedback de sessão, swap e undo                    |
| `drawPageSections.test.tsx`    | 2      | Overlay de seleção e ações do rodapé                            |

---

## Build de produção

O build atual gera 3 bundles JS com hash de conteúdo e `index.html`:

| Arquivo                 | Tamanho   | Gzip     | Conteúdo                                    |
| ----------------------- | --------- | -------- | ------------------------------------------- |
| `assets/vendor-*.js`    | 157.88 kB | 51.57 kB | React, React DOM e React Router             |
| `assets/index-*.js`     | 125.60 kB | 28.42 kB | Código da aplicação, domínio e componentes  |
| `assets/styles-*.js`    | 31.02 kB  | 11.89 kB | Runtime de `styled-components`              |
| `index.html`            | 4.38 kB   | 1.31 kB  | HTML com meta tags, JSON-LD e font preload  |

Total gzip: **~93.19 kB**
