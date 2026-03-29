# Regras de domínio

Tipos, estado, regras do sorteio, algoritmo e comportamento sob falha.

---

## Tipos de domínio (`src/types/domain.ts`)

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
  timestamp: number; // momento da geração
}

type DrawStatus = 'idle' | 'configured' | 'loading' | 'drawn';
type SimulatorPageState = 'empty' | 'selecting' | 'ready' | 'drawing' | 'result' | 'swap_error';
```

### Tipo utilitário (`src/types/result.ts`)

```typescript
type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };
```

Usado em todo o domínio e persistência para representar operações que podem falhar sem lançar exceção.

---

## Estado da aplicação

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

### Actions dos reducers

```typescript
// Teams: LOAD_CATALOG, SELECT_TEAM, DESELECT_TEAM, FILL_SELECTION, CLEAR_SELECTION, RESTORE_SELECTION
// Draw:  UPDATE_SETTINGS, SET_RESULT, SET_LOADING, SET_ERROR, SWAP_TEAMS, UNDO_LAST_SWAP, CLEAR_ERROR, RESET, RESTORE_STATE
```

---

## Dataset de seleções

O catálogo inclui 32 seleções distribuídas em 5 confederações e 4 potes:

| Pot | CONMEBOL          | UEFA                                           | CONCACAF                | AFC                               | CAF               |
| --- | ----------------- | ---------------------------------------------- | ----------------------- | --------------------------------- | ----------------- |
| 1   | Argentina, Brazil | France, England, Spain                         | Canada*, Mexico*, USA\* |                                   |                   |
| 2   | Uruguay, Colombia | Germany, Portugal, Italy, Netherlands, Belgium |                         |                                   | Morocco           |
| 3   | Ecuador           | Croatia, Denmark, Switzerland, Poland          |                         | Japan, South Korea, Iran          | Senegal           |
| 4   | Chile             | Serbia                                         | Costa Rica              | Australia, Saudi Arabia           | Nigeria, Cameroon |

\* Seleções sede (`qualificationType: "host"`)

---

## Invariantes do sistema

- Um resultado salvo sempre reflete um conjunto específico de participantes + configuração + seed
- Um resultado exibido não pode sobreviver a mudanças de setup sem ser invalidado
- Regras de restrição precisam valer tanto no sorteio automático quanto nas trocas manuais
- A UI nunca deve depender de `Math.random` diretamente para corretude do sorteio
- Falhas de `localStorage` não podem tornar a aplicação inutilizável

---

## Regras do sorteio

### Regras obrigatórias

| Regra                    | Módulo                        | Descrição                                              |
| ------------------------ | ----------------------------- | ------------------------------------------------------ |
| Contagem correta         | `drawValidator`               | `participants.length === groups * teamsPerGroup`       |
| Sem duplicidade          | `drawValidator`               | IDs únicos no Set de participantes                     |
| Distribuição uniforme    | `drawEngine`                  | Todos os grupos com exatamente `teamsPerGroup` equipes |
| Invalidação de resultado | `drawReducer` / `useDrawFlow` | Resultado limpo quando setup muda depois do sorteio    |

### Potes (`pot: 1 | 2 | 3 | 4`)

- Cada equipe pode ter `pot` de 1 a 4 (atribuído no dataset)
- O sorteio evita colocar duas equipes do mesmo pote no mesmo grupo
- O validator rejeita cenários inviáveis antes de iniciar o sorteio
- Mensagem: `"Não é possível distribuir X equipes do pote Y em Z grupos com limite de 1 por grupo."`

### Confederação FIFA-like

| Confederação | Limite por grupo |
| ------------ | ---------------- |
| UEFA         | 2                |
| CONMEBOL     | 1                |
| CONCACAF     | 1                |
| AFC          | 1                |
| CAF          | 1                |
| OFC          | 1                |

- A validação de viabilidade roda antes do sorteio (`confederationValidation.ts`)
- A mesma regra vale no sorteio automático e na troca manual (`isTeamAllowedInGroup`)
- Mensagem: `"Não é possível distribuir X equipes da UEFA em Y grupos com limite de 2 por grupo."`

### Seed determinística

- O sorteio gera ou recebe uma `seed` (inteiro positivo)
- A `seed` passa a compor o `DrawResult`
- O RNG usa o algoritmo **mulberry32** (`createSeededRng`) com **Fisher-Yates shuffle**
- Com a mesma entrada e a mesma `seed`, o sorteio é reproduzível

---

## Algoritmo

O `drawEngine` usa dois caminhos:

| Cenário                          | Algoritmo    | Complexidade  |
| -------------------------------- | ------------ | ------------- |
| Sem restrições (policy = `none`) | Fisher-Yates | O(n)          |
| Com potes e/ou confederação      | Backtracking | Exponencial\* |

\* Na prática, com 32 equipes e restrições FIFA-like, o backtracking converge rapidamente. Se a configuração for inviável, o validator já rejeita antes de entrar no engine.

```text
drawEngine(participants, settings, options?)
  │
  ├─ drawValidator(participants, settings) → Result<ValidPayload>
  │   ├─ valida contagem
  │   ├─ valida duplicidade
  │   ├─ valida distribuição de potes
  │   └─ valida distribuição de confederação
  │
  ├─ se não precisa de backtracking:
  │   └─ shuffle + slice em grupos
  │
  └─ se precisa de backtracking:
      └─ assignTeamsWithBacktracking(shuffled, groups, settings, index, rng)
          ├─ filtra grupos elegíveis (tamanho + confederação + pote)
          ├─ embaralha grupos elegíveis
          ├─ tenta alocar no primeiro grupo
          │   ├─ sucesso → avança para o próximo time
          │   └─ falha → desfaz (pop) e tenta próximo grupo
          └─ retorna false se nenhum grupo aceita
```

---

## Comportamento sob falha

O sistema foi desenhado para falhar de forma explícita:

| Cenário                      | Comportamento                                              |
| ---------------------------- | ---------------------------------------------------------- |
| Configuração inviável        | Validator rejeita com mensagem em português                |
| Backtracking sem solução     | Engine retorna `Result.error` com mensagem clara           |
| localStorage corrompido      | Fallback para estado padrão, app continua funcional        |
| localStorage indisponível    | Operações de persistência absorvem erro, UI não quebra     |
| Troca inválida (mesmo grupo) | Estado preservado, mensagem de erro exibida                |
| Troca que viola confederação | Estado preservado, equipes mantidas nas posições originais |
