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

## Como rodar

```bash
npm install
npm run dev
# http://localhost:5173
```

Requer Node.js >= 18.

---

## Como validar

```bash
npm run test         # suíte completa com Vitest
npm run coverage     # suíte com cobertura (95%+ statements)
npm run validate     # typecheck + lint + format + testes
npm run build        # typecheck + build de produção
```

CI/CD via GitHub Actions — roda `validate` e `build` em todo push para `main` e em pull requests.

---

## Deploy

**Produção:** [worldcupdraw.zairagoncalves.com](https://worldcupdraw.zairagoncalves.com) — hospedado na Vercel com deploy automático.

---

## Stack

| Tecnologia                   | Motivo                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| **React 18 + TypeScript**    | Tipagem forte e modelagem explícita do domínio               |
| **Vite 6**                   | Build rápido e integração nativa com Vitest                  |
| **Context API + useReducer** | Suficiente para o escopo, sem biblioteca de estado adicional |
| **styled-components 6**      | Tema tipado e co-localização de estilos                      |
| **Vitest + Testing Library** | Testes orientados ao comportamento real do usuário           |

Apenas 4 dependências em runtime: `react`, `react-dom`, `react-router-dom` e `styled-components`.

---

## Funcionalidades

- Catálogo de seleções com busca por nome/código e combobox acessível
- Configuração de grupos, equipes por grupo e política de confederação
- Sorteio automático com seed determinística (reproduzível)
- Potes e restrições FIFA-like por confederação
- Ajuste manual por troca entre grupos com validação
- Histórico de sorteios com comparação lado a lado
- Compartilhamento via Web Share API / clipboard
- Dark mode com persistência
- Animações com suporte a `prefers-reduced-motion`
- Persistência completa em `localStorage`

---

## Próximos passos

- Backend e sincronização remota
- Fase de mata-mata
- Drag-and-drop acessível nas trocas
- Suporte a múltiplas edições da Copa

---

## Documentação

| Documento                             | Conteúdo                                            |
| ------------------------------------- | --------------------------------------------------- |
| [Arquitetura](./docs/architecture.md) | Estrutura, decisões técnicas e alternativas         |
| [Regras de domínio](./docs/domain.md) | Modelagem de tipos, algoritmo e invariantes         |
| [Testes](./docs/testing.md)           | Estratégia, cobertura e catálogo completo           |
| [UX e acessibilidade](./docs/ux.md)   | Acessibilidade, tema, motion e SEO                  |
| [Uso de IA](./AI_USAGE.md)            | Ferramentas, etapas assistidas e adaptações manuais |
