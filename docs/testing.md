# Testes

Estratégia, cobertura, catálogo completo e build de produção.

---

## Visão geral

**23 arquivos** · **132 testes** · Vitest + Testing Library

| Métrica          | Valor  |
| ---------------- | ------ |
| Statements/lines | 95.47% |
| Branches         | 92.26% |
| Functions        | 96.49% |

| Tipo            | Arquivos | Testes | O que cobre                                                |
| --------------- | -------- | ------ | ---------------------------------------------------------- |
| Unitários       | 14       | 62     | Domínio, reducers, utilitários, persistência, presets      |
| Integração (UI) | 9        | 70     | Fluxos completos com render, user-event e assertions de UI |

### Como executar

```bash
npm run test         # suíte completa
npm run coverage     # suíte com cobertura (v8)
npm run validate     # typecheck + lint + format check + testes
```

---

## Catálogo completo

### Testes unitários

<details>
<summary><b>drawValidator.test.ts (8 testes)</b></summary>

- Rejeita grupo < mínimo
- Rejeita participantes != configuração
- Rejeita IDs duplicados
- Aceita participantes válidos
- Rejeita distribuição de confederação inviável com FIFA-like
- Aceita distribuição viável com FIFA-like
- Rejeita distribuição de pote inviável
- Aceita distribuição FIFA-like que depende do limite duplo da UEFA
</details>

<details>
<summary><b>drawEngine.test.ts (3 testes)</b></summary>

- Cria grupos uniformes sem duplicatas
- Retorna erro de validação em vez de gerar sorteio inválido
- Cria grupos FIFA-like sem violar limites de confederação
</details>

<details>
<summary><b>confederationPolicy.test.ts (6 testes)</b></summary>

- Retorna sem limite quando policy = none
- Retorna limite 2 para UEFA com FIFA-like
- Retorna limite 1 para CONMEBOL com FIFA-like
- Permite segundo time UEFA no grupo com FIFA-like
- Rejeita terceiro time UEFA no grupo com FIFA-like
- Rejeita grupo que excede limite da UEFA
</details>

<details>
<summary><b>drawReducer.test.ts (10 testes)</b></summary>

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
</details>

<details>
<summary><b>teamsReducer.test.ts (6 testes)</b></summary>

- Carrega catálogo de seleções
- Seleciona e desseleciona equipes
- Preenche seleção com autofill
- Limpa toda a seleção
- Restaura seleção do localStorage
- Ignora IDs órfãos no restore
</details>

<details>
<summary><b>filterTeams.test.ts (4 testes)</b></summary>

- Normaliza case e acentos
- Filtra por nome ou código e exclui selecionados
- Filtra por confederação e query combinados
- Retorna equipes selecionadas com filtro "selected"
</details>

<details>
<summary><b>localStorageRepository.test.ts (7 testes)</b></summary>

- Salva e carrega dados estruturados
- Retorna null para chaves ausentes
- Retorna erro para JSON inválido
- Limpa dados persistidos
- Retorna indisponível quando window.localStorage não existe
- Fallback para erros genéricos em exceções non-Error
- Retorna erro de leitura quando storage lança exceção
</details>

<details>
<summary><b>summarizeDrawResult.test.ts (1 teste)</b></summary>

- Deriva métricas factuais a partir do resultado
</details>

<details>
<summary><b>savedDrawHistory.test.ts (3 testes)</b></summary>

- Cria entrada salva com label e preserva metadados
- Hidrata entries legados sem label com fallback legível
- Descarta registros malformados na sanitização
</details>

<details>
<summary><b>compareSavedDraws.test.ts (3 testes)</b></summary>

- Identifica grupos idênticos entre dois sorteios
- Detecta diferenças de composição por grupo
- Retorna diff vazio quando os sorteios são iguais
</details>

<details>
<summary><b>drawPresets.test.ts (3 testes)</b></summary>

- Preset padrão aplica 8 grupos de 4
- Preset compacto aplica 4 grupos de 4
- Preset FIFA-like ativa policy de confederação
</details>

<details>
<summary><b>groupLabel.test.ts (2 testes)</b></summary>

- Gera labels A-Z para até 26 grupos
- Gera labels AA, AB... para mais de 26 grupos
</details>

<details>
<summary><b>shareDrawResult.test.ts (3 testes)</b></summary>

- Compartilha via Web Share API quando disponível
- Fallback para clipboard quando share não está disponível
- Retorna erro quando nenhum método de compartilhamento funciona
</details>

<details>
<summary><b>random.test.ts (3 testes)</b></summary>

- Gera sequência determinística com mesma seed
- Gera sequências diferentes com seeds diferentes
- Fisher-Yates shuffle produz permutação válida
</details>

### Testes de integração (UI)

<details>
<summary><b>App.test.tsx (7 testes)</b></summary>

- Roteia search trigger do header para o combobox de participantes
- Inicia em modo claro sem preferência persistida
- Alterna dark mode pelo header e persiste seleção
- Restaura dark mode da preferência persistida na montagem
</details>

<details>
<summary><b>teamSearchFlow.test.tsx (7 testes)</b></summary>

- Abre a view de participantes e permite seleção por teclado via código
- Atualiza lista de sugestões apenas após debounce
- Suporta busca por código, remoção, clear all e feedback de vazio
- Filtra catálogo por confederação e mantém query composta com chip ativo
</details>

<details>
<summary><b>drawConfigurationFlow.test.tsx (11 testes)</b></summary>

- Desbloqueia configuração progressivamente, suporta autofill e armazena resultado
- Registra mudanças de policy de confederação na atividade
- Aplica preset pelo mesmo fluxo de settings e invalida resultado atual
- Mostra feedback de validação e desabilita botão com FIFA-like
- Roda sorteio bem-sucedido para set viável com FIFA-like
</details>

<details>
<summary><b>drawResultsPanel.test.tsx (19 testes)</b></summary>

- Compartilha resultado via Web Share API e loga feedback
- Copia resultado via clipboard quando share não está disponível
- Abre modal de save com label sugerido antes de salvar
- Restaura composição anterior após undo do último swap
</details>

<details>
<summary><b>savedDrawComparison.test.tsx (5 testes)</b></summary>

- Exibe comparação lado a lado entre dois sorteios salvos
- Destaca grupos com diferenças de composição
- Mostra mensagem quando sorteios são idênticos
</details>

<details>
<summary><b>swapFlow.test.tsx (6 testes)</b></summary>

- Executa troca entre dois grupos e atualiza UI
- Bloqueia troca que viola política de confederação
- Permite undo da última troca
- Preserva estado quando troca é inválida
</details>

<details>
<summary><b>historyFlow.test.tsx (4 testes)</b></summary>

- Salva sorteio com label customizado
- Lista sorteios salvos em ordem cronológica
- Restaura sorteio salvo e aplica no estado atual
- Remove sorteio do histórico
</details>

<details>
<summary><b>persistenceRestore.test.tsx (5 testes)</b></summary>

- Restaura seleção de equipes do localStorage na montagem
- Restaura configuração e resultado do sorteio
- Ignora dados corrompidos e inicia com estado limpo
- Filtra IDs órfãos que não existem mais no catálogo
</details>

<details>
<summary><b>themeToggle.test.tsx (4 testes)</b></summary>

- Inicia em tema claro por padrão
- Alterna entre claro e escuro
- Persiste preferência no localStorage
- Restaura preferência na montagem
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
