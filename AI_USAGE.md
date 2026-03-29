# Uso de Inteligência Artificial

## Ferramentas utilizadas

- **Claude Code** (Anthropic) — assistente de desenvolvimento via CLI

## Etapas em que a IA ajudou

| Etapa              | Tipo de ajuda                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Arquitetura        | Discussão de estrutura de pastas e separação de responsabilidades                        |
| Modelagem de tipos | Revisão dos domain types e sugestão do pattern Result\<T\>                               |
| Domínio do sorteio | Implementação do algoritmo de backtracking para política de confederação                 |
| Componentes UI     | Estruturação de componentes com styled-components e tema compartilhado                   |
| Tematização        | Evolução para light/dark mode com provider de tema, persistência e tokens compartilhados |
| Testes             | Geração de testes de integração e cenários de edge case                                  |
| Acessibilidade     | Auditoria WCAG e implementação de ARIA, skip link, live regions, contraste               |
| SEO                | Meta tags Open Graph, Twitter Card, JSON-LD, favicon, manifest                           |
| Performance        | Vendor splitting, async fonts, React.memo, useMemo para estado derivado                  |
| Tooling            | Configuração de Husky, lint-staged, commitlint, EditorConfig                             |
| Refatoração        | Limpeza de código, remoção de dead code, padronização de exports                         |
| Documentação       | Estruturação do README e decisões arquiteturais                                          |

## Prompts representativos

- "Estruture o projeto com separação de domínio, componentes, hooks, repositórios e testes"
- "Implemente o algoritmo de sorteio com backtracking para restrições de confederação e potes"
- "Crie um combobox acessível com navegação por teclado e sugestões filtradas"
- "Configure husky, lint-staged, commitlint para conventional commits"
- "Implemente light e dark mode com toggle persistido e revise as superfícies para não deixar o dark incompleto"
- "Adicione animações leves com respeito a prefers-reduced-motion"
- "Faça uma auditoria de acessibilidade do projeto e implemente as melhorias"
- "Valide se o código está em inglês — variáveis, classes, etc."

## O que foi adaptado manualmente

- **Decisões de escopo**: escolha da fase de grupos, definição de quais extras implementar, priorização de tarefas
- **Regras de domínio**: validação das regras de confederação contra a lógica real da FIFA, ajuste dos limites (UEFA max 2, demais max 1)
- **Design visual**: layout, paleta de cores, tipografia, responsividade
- **Tema e motion**: definição dos tokens visuais, critério de quais transições manter e onde evitar excesso de animação
- **Revisão de testes**: validação de que os cenários cobrem o fluxo real do usuário, ajuste de assertions
- **Trade-offs**: styled-components vs CSS Modules (ergonomia vs runtime), Context API vs Zustand (simplicidade vs escala), selects vs drag-and-drop (acessibilidade vs riqueza de interação)

## Validação dos resultados

- **Testes automatizados**: 131 testes passando (unitários + integração) verificados após cada mudança
- **TypeScript strict**: zero erros de tipo com `noUncheckedIndexedAccess` habilitado
- **ESLint + Prettier**: lint limpo em todo o código-fonte
- **Build de produção**: `npm run build` gera bundles otimizados sem erros
- **Script de validação**: `npm run validate` roda typecheck + lint + format check + testes como gate único
- **Revisão manual**: cada alteração sugerida pela IA foi revisada antes de aceitar, verificando se faz sentido no contexto e se não quebra funcionalidade existente
