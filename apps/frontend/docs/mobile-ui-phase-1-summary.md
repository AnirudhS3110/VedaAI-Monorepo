# Mobile UI — Phase 1: Responsive Layout Foundation

## Completed scope

Phase 1 only. No bottom nav, hamburger, or mobile topbar redesign yet (Phases 2–3).

## Changes

### Global (`globals.css`)
- `overflow-x: hidden` on `html` / `body`
- `min-height: 100dvh` on body
- `overflow-touch` utility for smooth mobile scrolling

### Shared tokens (`lib/responsive-layout.ts`)
- `pageX`: `px-4 sm:px-6 lg:px-8`
- `pageContainer`: `max-w-6xl`, `min-w-0`, `w-full`
- `mainScroll`: flex-safe scroll region
- `pageY`: `py-6 sm:py-8`

### Layout shell
- **`dashboard-shell`**: `h-dvh`, `overflow-x-hidden`, sidebar `hidden lg:flex` (prevents 375px horizontal overflow)
- **`content-area`**: uses shared responsive padding/container
- **`app-topbar`**: compact mobile height (`h-14`), responsive padding, truncated breadcrumb
- **`page-header`**: scalable title (`text-xl` → `lg:text-3xl`), `min-w-0`

### Pages audited
| Area | Updates |
|------|---------|
| Assignments grid | `min-w-0`, 1 col mobile, 2 md, 3 xl |
| Assignment cards | `break-words`, responsive padding |
| Create assignment | Single `ContentArea`, responsive form card padding |
| Form footer | Full-width buttons on mobile |
| Exam paper | Responsive padding, stacked time/marks, flexible name lines |
| AI banner | Responsive padding, `min-w-0` |
| Output view | `min-w-0` container |

## Breakpoints used
- Default: mobile (&lt;640px)
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+ (sidebar visible)
- `xl`: 1280px+ (assignment grid 3 cols)

## Desktop impact
- **lg+**: Sidebar + layout unchanged visually
- Topbar slightly tighter padding on `sm` only; desktop `lg:px-8` preserved

## Known interim limitation
- Below `lg`, sidebar is hidden until **Phase 2** (bottom nav + drawer). Use direct URLs or topbar back until then.

## Verify
```bash
cd frontend/vedaai && npm run build
```
Test widths: 375px, 768px, 1440px — no horizontal scroll on assignments, create, output.

## Next phase
**Phase 2 — Mobile navigation** (bottom nav, FAB, hamburger drawer).
