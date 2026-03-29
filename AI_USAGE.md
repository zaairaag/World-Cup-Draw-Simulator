# Uso de Inteligencia Artificial

## Ferramentas utilizadas

- **Claude Code** (Anthropic) — assistente de desenvolvimento via CLI

## Etapas em que a IA ajudou

| Etapa              | Tipo de ajuda                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Arquitetura        | Discussao de estrutura de pastas e separacao de responsabilidades                        |
| Modelagem de tipos | Revisao dos domain types e sugestao do pattern Result\<T\>                               |
| Dominio do sorteio | Implementacao do algoritmo de backtracking para politica de confederacao                 |
| Componentes UI     | Estruturacao de componentes com styled-components e tema compartilhado                   |
| Tematizacao        | Evolucao para light/dark mode com provider de tema, persistencia e tokens compartilhados |
| Testes             | Geracao de testes de integracao e cenarios de edge case                                  |
| Acessibilidade     | Auditoria WCAG e implementacao de ARIA, skip link, live regions, contraste               |
| SEO                | Meta tags Open Graph, Twitter Card, JSON-LD, favicon, manifest                           |
| Performance        | Vendor splitting, async fonts, React.memo, useMemo para estado derivado                  |
| Tooling            | Configuracao de Husky, lint-staged, commitlint, EditorConfig                             |
| Refatoracao        | Limpeza de codigo, remocao de dead code, padronizacao de exports                         |
| Documentacao       | Estruturacao do README, matriz de aderencia, decisoes arquiteturais                      |

## Prompts representativos

- "Estruture o projeto com separacao de dominio, componentes, hooks, repositorios e testes"
- "Implemente o algoritmo de sorteio com backtracking para restricoes de confederacao e potes"
- "Crie um combobox acessivel com navegacao por teclado e sugestoes filtradas"
- "Configure husky, lint-staged, commitlint para conventional commits"
- "Implemente light e dark mode com toggle persistido e revise as superficies para nao deixar o dark incompleto"
- "Adicione animacoes leves com respeito a prefers-reduced-motion"
- "Faca uma auditoria de acessibilidade do projeto e implemente as melhorias"
- "Avalie se o codigo entrega 100% do desafio tecnico" (checklist contra enunciado)
- "Valide se o codigo esta em ingles — variaveis, classes, etc."

## O que foi adaptado manualmente

- **Decisoes de escopo**: escolha da Opcao A (fase de grupos), definicao de quais extras implementar, priorizacao de tarefas
- **Regras de dominio**: validacao das regras de confederacao contra a logica real da FIFA, ajuste dos limites (UEFA max 2, demais max 1)
- **Design visual**: layout, paleta de cores, tipografia, responsividade
- **Tema e motion**: definicao dos tokens visuais, criterio de quais transicoes manter e onde evitar excesso de animacao
- **Revisao de testes**: validacao de que os cenarios cobrem o fluxo real do usuario, ajuste de assertions
- **Trade-offs**: manter styled-components vs CSS Modules (ergonomia vs runtime), Context API vs Zustand (simplicidade vs escala), selects vs drag-and-drop (acessibilidade vs riqueza de interacao)

## Validacao dos resultados

- **Testes automatizados**: 131 testes passando (unitarios + integracao) verificados apos cada mudanca
- **TypeScript strict**: zero erros de tipo com `noUncheckedIndexedAccess` habilitado
- **ESLint + Prettier**: lint limpo em todo o codigo fonte
- **Build de producao**: `npm run build` gera bundles otimizados sem erros
- **Script de validacao**: `npm run validate` roda typecheck + lint + format check + testes como gate unico
- **Revisao manual**: cada alteracao sugerida pela IA foi revisada antes de aceitar, verificando se faz sentido no contexto do desafio e se nao quebra funcionalidade existente
- **Checklist do enunciado**: cruzamento item a item dos requisitos obrigatorios e extras com a implementacao
