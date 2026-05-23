# Mobile UI — Phase 7 (Polish)

## Goals

- Touch-first interactions on mobile; hover only at `lg+`
- Single main scroll region; no nested scroll fights
- Respect `prefers-reduced-motion`
- Tighter spacing on small screens where duplicate chrome existed

## Changes

### Global (`globals.css`)

- `overflow-touch` — momentum scroll + `overscroll-behavior-y: contain`
- `touch-manipulation` — removes 300ms tap delay on controls
- `tap-highlight-none` — removes default WebKit tap flash
- `prefers-reduced-motion` — short-circuits animations/transitions

### Layout (`responsive-layout.ts`)

- Main scroll: `overflow-touch scroll-smooth`

### Interaction polish

| Component | Change |
|-----------|--------|
| `assignment-card` | Removed `whileHover`; `lg:hover` lift only; capped stagger delay; `active:scale-95` menu |
| `number-stepper` | `active:` + `lg:hover:` |
| `voice-input-button` | Touch classes + `lg:hover` |
| `due-date-field` | Clear button touch targets |
| `file-upload-zone` | 40px remove control + touch classes |
| `app-topbar` | Icon buttons `active:` + `lg:hover` |
| `mobile-bottom-nav` | `active:scale-95` on tabs |
| `mobile-create-fab` | Stronger `active:scale-90` |
| `mobile-nav-drawer` | `overflow-y-auto overscroll-contain` |
| `assignment-ai-banner` | Download CTA touch feedback |
| `generating-view` | Hide duplicate `PageHeader` below `lg` (topbar shows title) |

## Desktop

No visual regressions intended at `lg+`; hover shadows/lifts remain on cards and controls.

## QA notes

- Test at 375px: tap nav, FAB, card menu, create form steppers
- Verify no horizontal scroll on assignments list and paper view
- With OS “Reduce motion” on, animations should feel instant
