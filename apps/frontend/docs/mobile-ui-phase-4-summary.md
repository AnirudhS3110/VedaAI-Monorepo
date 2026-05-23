# Mobile UI — Phase 4: Assignments Page Responsive

## Completed scope

Assignments list, toolbar, cards, and empty state tuned for mobile Figma. Desktop `lg+` layout preserved.

## Toolbar (`assignments-toolbar.tsx`)

| Viewport | Layout |
|----------|--------|
| **&lt; lg** | Single row: **Filter By** (shrink) + pill **Search Name** (flex-1) |
| **lg+** | Original row: filter left, search right, placeholder "Search Assignment" |

## Cards (`assignment-card.tsx`)

- Single-column list spacing (`gap-3.5` mobile)
- **Underlined title** on mobile (Figma); plain on desktop
- Title links to assignment detail; `line-clamp-3` + `break-words`
- Menu button **44px** tap targets; dropdown `z-[60]` above FAB
- Metadata: `Assigned on :` / `Due :` (Figma spacing); stacks on narrow screens
- Softer card shadow; hover lift desktop-only

## Grid (`assignments-grid.tsx`)

- Semantic `<ul>` / `<li>`
- `grid-cols-1` → `md:grid-cols-2` → `xl:grid-cols-3`

## Page (`assignments-view.tsx`)

- Tighter top padding under mobile topbar sub-row
- `PageHeader` remains desktop-only

## Empty state

- Primary CTA hidden on mobile (FAB + hint text)
- CTA visible on `lg+`

## Verify

- 375px: filter + search one row; full-width cards; no horizontal scroll
- 1440px: 3-column grid, desktop toolbar, no title underline

## Next

**Phase 5 — Create assignment responsive**
