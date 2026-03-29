# Regras de domínio

Tipos, regras do sorteio, algoritmo e comportamento sob falha.

---

## Tipos principais

```typescript
type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
type ConfederationPolicy = 'none' | 'fifa-like';
type Pot = 1 | 2 | 3 | 4;

interface Team {
  id: string;
  name: string;
  code: string;
  confederation: Confederation;
  pot?: Pot;
  qualificationType?: 'host' | 'qualified';
}

interface DrawSettings {
  numberOfGroups: number;
  teamsPerGroup: number;
  confederationPolicy: ConfederationPolicy;
}

interface DrawResult {
  groups: Group[];
  settings: DrawSettings;
  seed: number;
  timestamp: number;
}

// Operações que podem falhar sem exceção
type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };
```

---

## Dataset

32 seleções distribuídas em 5 confederações e 4 potes:

| Pot | CONMEBOL          | UEFA                                           | CONCACAF                | AFC                               | CAF               |
| --- | ----------------- | ---------------------------------------------- | ----------------------- | --------------------------------- | ----------------- |
| 1   | Argentina, Brazil | France, England, Spain                         | Canada*, Mexico*, USA\* |                                   |                   |
| 2   | Uruguay, Colombia | Germany, Portugal, Italy, Netherlands, Belgium |                         |                                   | Morocco           |
| 3   | Ecuador           | Croatia, Denmark, Switzerland, Poland          |                         | Japan, South Korea, Iran, Senegal |                   |
| 4   | Chile             | Serbia                                         | Costa Rica              | Australia, Saudi Arabia           | Nigeria, Cameroon |

\* Seleções sede

---

## Invariantes

- Resultado salvo sempre reflete participantes + configuração + seed específicos
- Resultado exibido é invalidado quando o setup muda
- Restrições valem no sorteio automático e nas trocas manuais
- Sorteio nunca depende de `Math.random` diretamente
- Falhas de `localStorage` não tornam a aplicação inutilizável

---

## Regras do sorteio

### Obrigatórias

| Regra                  | Módulo          | Descrição                                        |
| ---------------------- | --------------- | ------------------------------------------------ |
| Contagem correta       | `drawValidator` | `participants.length === groups * teamsPerGroup` |
| Sem duplicidade        | `drawValidator` | IDs únicos no Set de participantes               |
| Distribuição uniforme  | `drawEngine`    | Grupos com exatamente `teamsPerGroup` equipes    |
| Invalidação automática | `drawReducer`   | Resultado limpo quando setup muda                |

### Potes

Cada equipe tem `pot` de 1 a 4. O sorteio evita duas equipes do mesmo pote no mesmo grupo. Cenários inviáveis são rejeitados antes do sorteio.

### Confederação FIFA-like

| Confederação | Limite por grupo |
| ------------ | ---------------- |
| UEFA         | 2                |
| Demais       | 1                |

Validação roda antes do sorteio e também na troca manual.

### Seed determinística

RNG com algoritmo **mulberry32** e **Fisher-Yates shuffle**. Mesma entrada + mesma seed = mesmo resultado.

---

## Algoritmo

| Cenário                | Algoritmo    | Complexidade  |
| ---------------------- | ------------ | ------------- |
| Sem restrições         | Fisher-Yates | O(n)          |
| Com potes/confederação | Backtracking | Exponencial\* |

\* Converge rápido com 32 equipes. Configurações inviáveis são rejeitadas pelo validator antes de entrar no engine.

```text
drawEngine(participants, settings)
  ├─ drawValidator → valida contagem, duplicidade, potes e confederação
  ├─ sem restrições → shuffle + slice
  └─ com restrições → backtracking com rollback por grupo
```

---

## Comportamento sob falha

| Cenário                   | Comportamento                               |
| ------------------------- | ------------------------------------------- |
| Configuração inviável     | Validator rejeita com mensagem em português |
| Backtracking sem solução  | `Result.error` com mensagem clara           |
| localStorage corrompido   | Fallback para estado padrão                 |
| localStorage indisponível | Persistência absorve erro, UI continua      |
| Troca inválida            | Estado preservado, mensagem de erro exibida |
