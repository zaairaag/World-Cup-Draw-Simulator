# Uso de Inteligencia Artificial

## Ferramentas utilizadas

- **Claude Code** (Anthropic) — assistente de desenvolvimento via CLI

## Etapas em que a IA ajudou

| Etapa | Tipo de ajuda |
|---|---|
| Arquitetura | Discussao de estrutura de pastas e separacao de responsabilidades |
| Modelagem de tipos | Revisao dos domain types e sugestao do pattern Result\<T\> |
| Dominio do sorteio | Implementacao do algoritmo de backtracking para politica de confederacao |
| Componentes UI | Estruturacao de componentes com styled-components e tema compartilhado |
| Testes | Geracao de testes de integracao e cenarios de edge case |
| Acessibilidade | Auditoria WCAG e implementacao de ARIA, skip link, live regions, contraste |
| SEO | Meta tags Open Graph, Twitter Card, JSON-LD, favicon, manifest |
| Performance | Vendor splitting, async fonts, React.memo, useMemo para estado derivado |
| Tooling | Configuracao de Husky, lint-staged, commitlint, EditorConfig |
| Refatoracao | Limpeza de codigo, remocao de dead code, padronizacao de exports |

## Prompts representativos

- "Faca uma auditoria de acessibilidade do projeto e implemente as melhorias"
- "Configure husky, lint-staged, commitlint para conventional commits"
- "Avalie se o codigo entrega 100% do desafio tecnico" (checklist contra enunciado)
- "Otimize a performance para deploy em producao"
- "Valide se o codigo esta em ingles — variaveis, classes, etc."

## O que foi adaptado manualmente

- **Decisoes de escopo**: escolha da Opcao A (fase de grupos), definicao de quais extras implementar, priorizacao de tarefas
- **Regras de dominio**: validacao das regras de confederacao contra a logica real da FIFA, ajuste dos limites (UEFA max 2, demais max 1)
- **Design visual**: layout inspirado no portal ge.globo.com, paleta de cores, tipografia, responsividade
- **Revisao de testes**: validacao de que os cenarios cobrem o fluxo real do usuario, ajuste de timeouts e assertions
- **Trade-offs**: manter styled-components (requisito do projeto) vs migrar para CSS Modules (melhor performance), Context API vs Zustand (simplicidade vs escala)

## Validacao dos resultados

- **Testes automatizados**: 126 testes passando (unitarios + integracao) verificados apos cada mudanca
- **TypeScript strict**: zero erros de tipo com `noUncheckedIndexedAccess` habilitado
- **ESLint + Prettier**: lint limpo em todo o codigo fonte
- **Build de producao**: `npm run build` gera bundles otimizados sem erros
- **Revisao manual**: cada alteracao sugerida pela IA foi revisada antes de aceitar, verificando se faz sentido no contexto do desafio e se nao quebra funcionalidade existente
- **Checklist do enunciado**: cruzamento item a item dos requisitos obrigatorios e extras com a implementacao
