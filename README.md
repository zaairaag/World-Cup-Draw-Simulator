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

<p align="center">
  <a href="https://worldcupdraw.zairagoncalves.com"><strong>Acessar a aplicação ao vivo</strong></a>
</p>

---

Simulador de sorteio da fase de grupos da Copa do Mundo feito em React + TypeScript.

O escopo implementado foi a **Opção A — fase de grupos**. Mata-mata ficou deliberadamente fora do MVP.

---

## 🛠️ Stack

| Escolha                      | Motivo                                                                      |
| ---------------------------- | --------------------------------------------------------------------------- |
| **React 18 + TypeScript**    | Tipagem forte e modelagem explícita do domínio                              |
| **Vite 6**                   | Setup simples, build rápido e integração nativa com Vitest                  |
| **Context API + useReducer** | Suficiente para o escopo atual, sem custo extra de biblioteca de estado     |
| **styled-components 6**      | Tema tipado, co-localização de estilos e composição simples de tokens       |
| **react-router-dom 6**       | Estrutura preparada para crescer, mesmo com rota única no MVP               |
| **Vitest + Testing Library** | Mesma pipeline do Vite e testes orientados ao comportamento real do usuário |

### Dependências de produção

Apenas 4 bibliotecas em runtime:

```text
react 18.3 · react-dom 18.3 · react-router-dom 6.30 · styled-components 6.1
```

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js >= 18
- npm (instalado com o Node)

```bash
npm install
npm run dev
```

Aplicação local: `http://localhost:5173`

---

## 🌐 Deploy

- **Produção:** `https://worldcupdraw.zairagoncalves.com`
- **Hospedagem:** Vercel
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`) — executa `npm ci`, `npm run validate` e `npm run build` em push para `main` e em pull requests

---

## 🧪 Como validar

Última execução local de `npm run coverage`:

- `95.47%` statements / lines
- `92.26%` branches
- `96.49%` functions

```bash
npm run test         # suíte completa com Vitest
npm run coverage     # suíte completa com cobertura
npm run validate     # typecheck + lint + format check + testes (gate único)
npm run build        # typecheck + build de produção
```

| Script                    | Comando real                                    | Descrição                        |
| ------------------------- | ----------------------------------------------- | -------------------------------- |
| `dev`                     | `vite`                                          | Servidor de desenvolvimento Vite |
| `build`                   | `tsc -b && vite build`                          | Typecheck + build de produção    |
| `preview`                 | `vite preview`                                  | Serve o build localmente         |
| `typecheck`               | `tsc -b`                                        | Verificação de tipos isolada     |
| `lint` / `lint:fix`       | `eslint .` / `eslint . --fix`                   | ESLint sem/com autofix           |
| `format` / `format:check` | `prettier --write ...` / `prettier --check ...` | Prettier write/check             |
| `test`                    | `vitest run`                                    | Suíte completa com Vitest        |
| `coverage`                | `vitest run --coverage`                         | Suíte completa com cobertura     |
| `validate`                | `typecheck && lint && format:check && test`     | Gate de qualidade completo       |
| `prepare`                 | `husky`                                         | Instala os hooks do Husky        |

---

## 📦 Funcionalidades

### Requisitos obrigatórios

- Catálogo local de seleções com camada de repositório substituível
- Busca por nome e código com combobox acessível
- Navegação por teclado no autocomplete
- Seleção e remoção de participantes
- Configuração de quantidade de grupos e equipes por grupo
- Sorteio automático com re-sorteio
- Ajuste manual por troca entre grupos
- Persistência em `localStorage`
- Estados vazios, loading e mensagens de validação
- Tipagem de domínio para `Team`, `Group`, `DrawSettings`, `DrawResult` e contratos relacionados
- Testes unitários e de integração cobrindo fluxo principal, persistência e regras de domínio

### Extras

- **Potes + restrições por confederação**
- **Seed de aleatoriedade** para reproduzir sorteios
- **Compartilhamento de resultado** com Web Share API e fallback para clipboard
- **Histórico de sorteios**
- **Animações leves + acessibilidade completa**, incluindo focus management e suporte a `prefers-reduced-motion`

### Melhorias adicionais

- **Dark mode com toggle visível no header** e persistência da preferência em `localStorage`
- Comparação lado a lado entre sorteios salvos
- Undo da última troca manual
- Presets de configuração (padrão, compacto, FIFA-like)
- Download do resultado em JSON
- Quick filters por confederação no catálogo
- Log de atividade da sessão

---

## 🚀 Próximos passos

- Introduzir backend e sincronização remota dos sorteios
- Adicionar fase de mata-mata
- Evoluir para drag-and-drop acessível nas trocas
- Expandir o domínio para múltiplas edições da Copa

---

## 📚 Documentação detalhada

- [Arquitetura](./docs/architecture.md) — estrutura, providers, decisões técnicas e alternativas consideradas
- [Regras de domínio](./docs/domain.md) — modelagem de tipos, algoritmo de sorteio e invariantes
- [Testes](./docs/testing.md) — estratégia, cobertura e catálogo completo
- [UX e acessibilidade](./docs/ux.md) — acessibilidade, tema, motion e SEO
