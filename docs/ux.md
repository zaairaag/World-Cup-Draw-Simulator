# UX e acessibilidade

Acessibilidade, tema, motion e SEO.

---

## Acessibilidade

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

---

## Tema

Tema `light` e `dark` com 29 cores semânticas, tokens compartilhados e persistência em `localStorage`.

| Token       | Valores                                        |
| ----------- | ---------------------------------------------- |
| Spacing     | xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px |
| Radii       | sm: 8px, md: 16px, lg: 32px, xl: 48px          |
| Typography  | Inter (body/heading), JetBrains Mono (mono)    |
| Motion      | fast: 160ms, base: 320ms, slow: 560ms          |
| Breakpoints | xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280  |

---

## Motion

Animações curtas e funcionais:

- Entrada do painel de resultado
- Reveal escalonado dos grupos (stagger: 90ms)
- Microinterações de hover/focus
- Transições de tema e superfícies
- `prefers-reduced-motion` desabilita tudo

---

## SEO

O `index.html` inclui:

- Open Graph (title, description, image, locale)
- Twitter Card (summary_large_image)
- JSON-LD (WebApplication schema)
- Favicon SVG + PNG 32px + Apple Touch Icon
- Web manifest
- Font preloading sem bloqueio de render
