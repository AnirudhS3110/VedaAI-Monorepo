# Mobile UI — Phase 3: Mobile Topbar

## Completed scope

Full mobile topbar aligned with Figma screenshots. Desktop topbar unchanged at `lg+`.

## Layout modes (`lib/mobile-topbar.ts`)

| Route | Mobile layout |
|-------|----------------|
| `/home` | Brand row: logo + bell + avatar + menu |
| `/assignments` | Brand row + secondary row: back → Home, centered **Assignments** |
| `/assignments/[id]` | Brand row only (paper view — logo + actions) |
| `/assignments/create`, `…/generating` | Single row: back, centered title, balanced spacer |

## Visual details

- White sticky header with `safe-area-inset-top`
- Compact `h-14` primary row; `h-12` secondary title row on assignments tab
- Orange notification dot (Figma)
- Avatar with subtle ring
- Two-line **menu** icon (`TopbarMenuIcon`)
- Compact logo variant (`VedaLogo compact`)

## Desktop

- Same rounded card topbar, breadcrumb + back, name + chevron on account
- No hamburger on desktop

## Page headers

- `PageHeader` hidden on mobile for assignments list and create form (title comes from topbar)
- Still shown on `lg+`

## Files

- `app-topbar.tsx` — refactored mobile/desktop split
- `topbar-menu-icon.tsx`
- `lib/mobile-topbar.ts`
- `veda-logo.tsx` — `compact` prop
- `page-header.tsx` — optional `className`

## Verify

375px: `/assignments` → logo row + Assignments title row; `/assignments/create` → back + Create Assignment; `/assignments/[id]` → logo row only.

1024px+: desktop breadcrumb bar unchanged.

## Next

**Phase 4 — Assignments page responsive** (cards, search/filter stack).
