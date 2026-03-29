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
| Dark mode                  | Toggle com persistência e modo claro como padrão inicial    |
| Reduced motion             | `prefers-reduced-motion` respeitado em todas as animações   |

---

## Tema centralizado e tipado

O sistema visual possui:

- tema `light` e tema `dark` com 29 cores semânticas cada
- `ThemeModeProvider` com tema claro como padrão inicial
- tokens compartilhados de cor, espaçamento, sombras, tipografia e motion
- persistência da preferência em `localStorage`

| Token       | Valores                                        |
| ----------- | ---------------------------------------------- |
| Spacing     | xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px |
| Radii       | sm: 8px, md: 16px, lg: 32px, xl: 48px          |
| Typography  | Inter (body/heading), JetBrains Mono (mono)    |
| Motion      | fast: 160ms, base: 320ms, slow: 560ms          |
| Breakpoints | xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280  |

---

## Motion

As animações foram mantidas curtas e funcionais:

- entrada do painel de resultado
- reveal escalonado dos grupos (stagger step: 90ms)
- microinterações de hover/focus
- transições de tema e superfícies

Também foi adicionado `prefers-reduced-motion`, para o comportamento continuar acessível quando o usuário pede menos animação.

---

## SEO e meta tags

O `index.html` inclui:

- Open Graph tags completas (title, description, image, locale)
- Twitter Card (summary_large_image)
- JSON-LD structured data (WebApplication schema)
- Favicon SVG + PNG 32px + Apple Touch Icon
- Web manifest (`manifest.json`)
- Font preloading com `media="print"` + `onload` para não bloquear render
