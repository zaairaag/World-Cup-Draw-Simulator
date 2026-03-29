# Arquitetura

Estrutura do projeto, decisões técnicas e alternativas consideradas.

---

## Estrutura

```text
src/
  app/                          # bootstrap, providers, restore, routing
  components/                   # layout e componentes compartilhados
  constants/                    # dataset, chaves de storage, constantes gerais
  features/
    draw/                       # sorteio: engine, validator, reducer, componentes, testes
    teams/                      # seleções: busca, catálogo, repositório, testes
  hooks/                        # hooks compartilhados
  pages/                        # página principal e subáreas
  repositories/                 # persistência local genérica
  test/                         # infraestrutura de teste
  theme/                        # tokens, global styles, provider de tema
  types/                        # contratos de domínio
```

---

## Decisões técnicas

### Estado dividido por domínio

Dois slices independentes:

- `teams` — catálogo, selecionados e busca
- `draw` — configuração, resultado, loading, erro, undo e restore

O `DrawPage` coordena os slices, mas as regras de domínio ficam fora da UI.

### Context API + useReducer

Fluxo principal único, pouco estado global derivado. Não justifica Zustand ou Redux neste escopo. Se o produto crescer para multi-edição ou colaborativo, uma biblioteca dedicada passaria a compensar.

### Domínio isolado em funções puras

Todo o `src/features/draw/domain/` é zero React — funções puras testáveis independentemente:

| Módulo                       | Responsabilidade                               |
| ---------------------------- | ---------------------------------------------- |
| `drawEngine.ts`              | Algoritmo de sorteio (shuffle + backtracking)  |
| `drawValidator.ts`           | 7 validações de entrada                        |
| `confederationPolicy.ts`     | Regra de limite por confederação               |
| `confederationValidation.ts` | Viabilidade da distribuição antes do sorteio   |
| `random.ts`                  | Seeded RNG (mulberry32) + Fisher-Yates shuffle |

### Persistência atrás de repositórios

`localStorage` encapsulado em interfaces genéricas (`IStorageRepository`, `ITeamRepository`). Permite trocar por API sem reescrever componentes.

### Provider stack

```text
ThemeModeProvider → TeamsProvider → DrawProvider → App
```

Hidratação em `AppProviders.tsx` via `restoreAppState()`: carrega catálogo, restaura seleção e estado do sorteio, filtra IDs órfãos e resultados stale.

### Rota única com fronteira de navegação

`react-router-dom` mantido mesmo com tela única — preserva o App shell limpo e reduz custo de separar views no futuro.

---

## Alternativas consideradas

| Alternativa             | Por que não foi adotada                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| Zustand / Redux Toolkit | Escopo não exige seletores complexos nem estado compartilhado entre áreas     |
| CSS Modules / Tailwind  | Projeto precisava de tema centralizado com light/dark mode e motion tokens    |
| Drag-and-drop           | Troca via selects é mais testável, acessível e com menos risco comportamental |

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
