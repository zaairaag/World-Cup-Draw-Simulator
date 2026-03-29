# Testes

Estratégia, cobertura e catálogo completo.

---

## Visão geral

**23 arquivos** · **132 testes** · Vitest + Testing Library

| Métrica          | Valor  |
| ---------------- | ------ |
| Statements/lines | 95.47% |
| Branches         | 92.26% |
| Functions        | 96.49% |

| Tipo            | Arquivos | Testes | Cobertura                                    |
| --------------- | -------- | ------ | -------------------------------------------- |
| Unitários       | 14       | 62     | Domínio, reducers, utilitários, persistência |
| Integração (UI) | 9        | 70     | Fluxos completos com render, user-event e UI |

---

## Catálogo

### Unitários

<details>
<summary><b>Expandir</b></summary>

**`drawValidator.test.ts`** (8 testes)

- Rejeita grupo < mínimo
- Rejeita participantes != configuração
- Rejeita IDs duplicados
- Aceita participantes válidos
- Rejeita distribuição de confederação inviável com FIFA-like
- Aceita distribuição viável com FIFA-like
- Rejeita distribuição de pote inviável
- Aceita distribuição FIFA-like que depende do limite duplo da UEFA

**`drawEngine.test.ts`** (3 testes)

- Cria grupos uniformes sem duplicatas
- Retorna erro de validação em vez de gerar sorteio inválido
- Cria grupos FIFA-like sem violar limites de confederação

**`confederationPolicy.test.ts`** (6 testes)

- Retorna sem limite quando policy = none
- Retorna limite 2 para UEFA com FIFA-like
- Retorna limite 1 para CONMEBOL com FIFA-like
- Permite segundo time UEFA no grupo com FIFA-like
- Rejeita terceiro time UEFA no grupo com FIFA-like
- Rejeita grupo que excede limite da UEFA

**`drawReducer.test.ts`** (10 testes)

- Atualiza settings e mantém slice configurado
- Transiciona por loading e drawn
- Invalida resultado stale sem perder settings
- Invalida resultado quando policy de confederação muda
- Troca equipes entre grupos e preserva tamanho
- Mantém estado quando mesmo time é enviado duas vezes
- Rejeita swap quando tenta reusar o mesmo grupo
- Armazena erro de sorteio e mantém slice configurado
- Rejeita swap que quebraria policy de confederação
- Armazena resultado anterior após swap e limpa após undo

**`filterTeams.test.ts`** (4 testes)

- Normaliza case e acentos
- Filtra por nome ou código e exclui selecionados
- Filtra por confederação e query combinados
- Retorna equipes selecionadas com filtro "selected"

**`localStorageRepository.test.ts`** (7 testes)

- Salva e carrega dados estruturados
- Retorna null para chaves ausentes
- Retorna erro para JSON inválido
- Limpa dados persistidos
- Retorna indisponível quando window.localStorage não existe
- Fallback para erros genéricos em exceções non-Error
- Retorna erro de leitura quando storage lança exceção

**`summarizeDrawResult.test.ts`** (1 teste)

- Deriva métricas factuais a partir do resultado

**`savedDrawHistory.test.ts`** (3 testes)

- Cria entrada salva com label e preserva metadados
- Hidrata entries legados sem label com fallback legível
- Descarta registros malformados na sanitização

</details>

### Integração (UI)

<details>
<summary><b>Expandir</b></summary>

**`App.test.tsx`** (7 testes)

- Roteia search trigger do header para o combobox de participantes
- Inicia em modo claro sem preferência persistida
- Alterna dark mode pelo header e persiste seleção
- Restaura dark mode da preferência persistida na montagem

**`teamSearchFlow.test.tsx`** (7 testes)

- Abre a view de participantes e permite seleção por teclado via código
- Atualiza lista de sugestões apenas após debounce
- Suporta busca por código, remoção, clear all e feedback de vazio
- Filtra catálogo por confederação e mantém query composta com chip ativo

**`drawConfigurationFlow.test.tsx`** (11 testes)

- Desbloqueia configuração progressivamente, suporta autofill e armazena resultado
- Registra mudanças de policy de confederação na atividade
- Aplica preset pelo mesmo fluxo de settings e invalida resultado atual
- Mostra feedback de validação e desabilita botão com FIFA-like
- Roda sorteio bem-sucedido para set viável com FIFA-like

**`drawResultsPanel.test.tsx`** (19 testes)

- Compartilha resultado via Web Share API e loga feedback
- Copia resultado via clipboard quando share não está disponível
- Abre modal de save com label sugerido antes de salvar
- Restaura composição anterior após undo do último swap

</details>

---

## Build de produção

| Arquivo      | Tamanho  | Gzip    | Conteúdo                                   |
| ------------ | -------- | ------- | ------------------------------------------ |
| `vendor.js`  | 157 kB   | 51.6 kB | React, React DOM, React Router             |
| `index.js`   | 125.6 kB | 28.4 kB | Código da aplicação, domínio, componentes  |
| `styles.js`  | 31 kB    | 11.9 kB | styled-components runtime                  |
| `index.html` | 4.4 kB   | 1.3 kB  | HTML com meta tags, JSON-LD, font preloads |

Total gzip: **~93 kB**
