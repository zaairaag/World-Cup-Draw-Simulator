# Estratégia de testes

Cobertura, distribuição e catálogo completo de testes do projeto.

---

## Visão geral

A suíte atual cobre **23 arquivos de teste** e **132 testes**.

Última execução local de `npm run coverage`:

- `95.47%` statements / lines
- `92.26%` branches
- `96.49%` functions

### Distribuição por tipo

| Tipo            | Arquivos | Testes | O que cobre                                                |
| --------------- | -------- | ------ | ---------------------------------------------------------- |
| Unitários       | 14       | 62     | Domínio, reducers, utilitários, persistência, presets      |
| Integração (UI) | 9        | 70     | Fluxos completos com render, user-event e assertions de UI |

---

## Catálogo completo

### Testes unitários

<details>
<summary><b>Clique para expandir</b></summary>

**`drawValidator.test.ts`** (8 testes)

- rejeita grupo < mínimo
- rejeita participantes != configuração
- rejeita IDs duplicados
- aceita participantes válidos
- rejeita distribuição de confederação inviável com FIFA-like
- aceita distribuição viável com FIFA-like
- rejeita distribuição de pote inviável
- aceita distribuição FIFA-like que depende do limite duplo da UEFA

**`drawEngine.test.ts`** (3 testes)

- cria grupos uniformes sem duplicatas
- retorna erro de validação em vez de gerar sorteio inválido
- cria grupos FIFA-like sem violar limites de confederação

**`confederationPolicy.test.ts`** (6 testes)

- retorna sem limite quando policy = none
- retorna limite 2 para UEFA com FIFA-like
- retorna limite 1 para CONMEBOL com FIFA-like
- permite segundo time UEFA no grupo com FIFA-like
- rejeita terceiro time UEFA no grupo com FIFA-like
- rejeita grupo que excede limite da UEFA

**`drawReducer.test.ts`** (10 testes)

- atualiza settings e mantém slice configurado
- transiciona por loading e drawn
- invalida resultado stale sem perder settings
- invalida resultado quando policy de confederação muda
- troca equipes entre grupos e preserva tamanho
- mantém estado quando mesmo time é enviado duas vezes
- rejeita swap quando tenta reusar o mesmo grupo
- armazena erro de sorteio e mantém slice configurado
- rejeita swap que quebraria policy de confederação
- armazena resultado anterior após swap e limpa após undo

**`filterTeams.test.ts`** (4 testes)

- normaliza case e acentos
- filtra por nome ou código e exclui selecionados
- filtra por confederação e query combinados
- retorna equipes selecionadas com filtro "selected"

**`localStorageRepository.test.ts`** (7 testes)

- salva e carrega dados estruturados
- retorna null para chaves ausentes
- retorna erro para JSON inválido
- limpa dados persistidos
- retorna indisponível quando window.localStorage não existe
- fallback para erros genéricos em exceções non-Error
- retorna erro de leitura quando storage lança exceção

**`summarizeDrawResult.test.ts`** (1 teste)

- deriva métricas factuais a partir do resultado

**`savedDrawHistory.test.ts`** (3 testes)

- cria entrada salva com label e preserva metadados
- hidrata entries legados sem label com fallback legível
- descarta registros malformados na sanitização
</details>

### Testes de integração (UI)

<details>
<summary><b>Clique para expandir</b></summary>

**`App.test.tsx`** (7 testes)

- roteia search trigger do header para o combobox de participantes
- inicia em modo claro sem preferência persistida
- alterna dark mode pelo header e persiste seleção
- restaura dark mode da preferência persistida na montagem

**`teamSearchFlow.test.tsx`** (7 testes)

- abre a view de participantes e permite seleção por teclado via código
- atualiza lista de sugestões apenas após debounce
- suporta busca por código, remoção, clear all e feedback de vazio
- filtra catálogo por confederação e mantém query composta com chip ativo

**`drawConfigurationFlow.test.tsx`** (11 testes)

- desbloqueia configuração progressivamente, suporta autofill e armazena resultado
- registra mudanças de policy de confederação na atividade
- aplica preset pelo mesmo fluxo de settings e invalida resultado atual
- mostra feedback de validação e desabilita botão com FIFA-like
- roda sorteio bem-sucedido para set viável com FIFA-like

**`drawResultsPanel.test.tsx`** (19 testes)

- compartilha resultado via Web Share API e loga feedback
- copia resultado via clipboard quando share não está disponível
- abre modal de save com label sugerido antes de salvar
- restaura composição anterior após undo do último swap
</details>

---

## Build de produção

O build gera 3 chunks otimizados com vendor splitting:

| Arquivo      | Tamanho  | Gzip    | Conteúdo                                    |
| ------------ | -------- | ------- | ------------------------------------------- |
| `vendor.js`  | 157 kB   | 51.6 kB | React, React DOM, React Router              |
| `index.js`   | 125.6 kB | 28.4 kB | Código da aplicação, domínio, componentes   |
| `styles.js`  | 31 kB    | 11.9 kB | styled-components runtime                   |
| `index.html` | 4.4 kB   | 1.3 kB  | HTML com meta tags, JSON-LD e font preloads |

Total gzip: **~93 kB**
