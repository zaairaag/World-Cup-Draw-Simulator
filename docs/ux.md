# UX e acessibilidade

Recursos de acessibilidade, sistema de tema, motion e SEO.

---

## Acessibilidade

Itens tratados como requisitos de produto, não como polimento:

| Recurso                    | Implementação                                               |
| -------------------------- | ----------------------------------------------------------- |
| Combobox acessível         | `role="combobox"`, `aria-expanded`, `aria-activedescendant` |
| Navegação por teclado      | Arrow keys, Enter, Escape, Home, End no autocomplete        |
| Tabs semânticas            | `role="tablist"`, `role="tab"`, `role="tabpanel"`           |
| Live regions               | `aria-live="polite"` para loading e feedback                |
| Skip link                  | Link para `#main-content` visível em focus                  |
| Focus management em modais | Foco inicial controlado, `Escape` para fechar               |
| Feedback de erro e sucesso | Texto visível, não apenas cor                               |
| Dark mode                  | Toggle com persistência e modo claro como padrão            |
| Reduced motion             | `prefers-reduced-motion` respeitado em todas as animações   |

### Detalhes do combobox

O `TeamSearchCombobox` implementa o pattern ARIA 1.2 combobox com listbox:

- `aria-expanded` indica se a lista de sugestões está aberta
- `aria-activedescendant` aponta para a sugestão em foco virtual
- Arrow Up/Down navega pelas sugestões sem mover o cursor do input
- Enter seleciona a sugestão ativa
- Escape fecha a lista e limpa o foco virtual
- Home/End vão para a primeira/última sugestão
- Debounce de 200ms evita atualizações excessivas durante a digitação

### Tabs

As abas do `DrawPage` seguem o pattern ARIA tabs:

- `role="tablist"` no container
- `role="tab"` em cada aba com `aria-selected`
- `role="tabpanel"` no conteúdo com `aria-labelledby`
- Navegação por Arrow Left/Right entre abas

---

## Tema centralizado e tipado

O sistema visual possui tema `light` e `dark` com 29 cores semânticas cada, persistência da preferência em `localStorage` e `ThemeModeProvider` com tema claro como padrão inicial.

### Tokens

| Token       | Valores                                        |
| ----------- | ---------------------------------------------- |
| Spacing     | xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px |
| Radii       | sm: 8px, md: 16px, lg: 32px, xl: 48px          |
| Typography  | Inter (body/heading), JetBrains Mono (mono)    |
| Motion      | fast: 160ms, base: 320ms, slow: 560ms          |
| Breakpoints | xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280  |

### Cores semânticas

As 29 cores são organizadas por função, não por valor visual:

- **Superfícies**: background, surface, surfaceHover, surfaceActive, overlay
- **Texto**: textPrimary, textSecondary, textMuted, textOnPrimary
- **Interação**: primary, primaryHover, primaryActive, focus, link
- **Feedback**: success, error, warning, info
- **Bordas**: border, borderSubtle, divider
- **Componentes**: headerBg, footerBg, cardBg, inputBg, badgeBg

---

## Motion

Animações curtas e funcionais, com propósito claro:

| Animação          | Duração    | Propósito                                   |
| ----------------- | ---------- | ------------------------------------------- |
| Entrada do painel | 320ms      | Feedback visual de que o sorteio foi gerado |
| Reveal escalonado | 90ms/grupo | Guiar o olhar pela sequência de grupos      |
| Hover/focus       | 160ms      | Feedback imediato de interação              |
| Transição de tema | 320ms      | Suavizar a troca entre light e dark         |

`prefers-reduced-motion: reduce` desabilita todas as animações, mantendo apenas transições de opacidade instantâneas para feedback mínimo.

---

## SEO e meta tags

O `index.html` inclui:

| Recurso         | Detalhe                                                |
| --------------- | ------------------------------------------------------ |
| Open Graph      | title, description, image, locale, type                |
| Twitter Card    | summary_large_image com imagem dedicada                |
| JSON-LD         | WebApplication schema com name, url, description       |
| Favicon         | SVG (preferencial) + PNG 32px + Apple Touch Icon 180px |
| Web manifest    | `manifest.json` com nome, cores e ícones               |
| Font preloading | `media="print"` + `onload` para não bloquear render    |
| Canonical       | URL canônica apontando para o domínio de produção      |
| Viewport        | `width=device-width, initial-scale=1` com theme-color  |
