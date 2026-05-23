# VedaAI Mobile UI — Implementation Summary

Production-responsive dashboard UI for the Next.js frontend (`frontend/vedaai`). Desktop layouts at **`lg` (1024px)+** are preserved; mobile uses bottom navigation, drawer, and page-specific topbars.

Per-phase detail: `docs/mobile-ui-phase-{1..7}-summary.md`.

---

## Architecture

### Shell

- **`DashboardShell`** — `h-dvh` flex column; sidebar `hidden lg:flex`; single scrollable `<main>`.
- **`responsive-layout.ts`** — shared tokens: `pageX`, `pageContainer`, `mainScroll`, `pageY`.
- **`ContentArea`** — wraps page content with padding + max width.

### Navigation (mobile &lt; `lg`)

| Surface | Role |
|---------|------|
| `MobileBottomNav` | Home, Assignments, Library, AI Toolkit |
| `MobileCreateFab` | Orange `+` on `/assignments`, `/home` |
| `MobileNavDrawer` | Full nav + Create (hamburger from topbar) |
| `sidebar-nav-content.tsx` | Shared with desktop sidebar |

### Topbar (`mobile-topbar.ts`)

| Variant | Routes |
|---------|--------|
| `brand-only` | Assignment paper view |
| `tab-root` | `/assignments` (logo + secondary “Assignments” row) |
| `inner` | Create, generating (back + centered title) |
| Default | Logo + menu on other dashboard routes |

### Typography

- **Bricolage Grotesque** — app chrome
- **Inter (`--font-document`)** — exam paper / PDF-like output

---

## Breakpoints

| Token | Width | Usage |
|-------|-------|--------|
| default | &lt;640 | Mobile-first base |
| `sm` | 640px | Toolbar rows, typography steps |
| `md` | 768px | Some form grids |
| `lg` | 1024px | Sidebar visible; mobile chrome hidden |
| `xl` | 1280px | Wide grids |

---

## Components Added (mobile-specific)

- `mobile-bottom-nav.tsx`
- `mobile-create-fab.tsx`
- `mobile-nav-drawer.tsx`
- `mobile-nav-context.tsx`
- `topbar-menu-icon.tsx`
- `lib/mobile-topbar.ts`
- `lib/responsive-layout.ts`

---

## Major Pages Modified

| Area | Key files |
|------|-----------|
| Layout | `dashboard-shell.tsx`, `app-topbar.tsx`, `content-area.tsx`, `globals.css` |
| Assignments | `assignments-view.tsx`, `assignment-card.tsx`, `assignments-toolbar.tsx`, `assignments-empty-state.tsx` |
| Create | `create-assignment-form.tsx`, `question-type-row.tsx`, `question-types-section.tsx`, `form-step-footer.tsx` |
| Output | `exam-paper-document.tsx`, `exam-paper-section.tsx`, `exam-paper-question.tsx`, `assignment-ai-banner.tsx` |

---

## Phase Overview

1. **Foundation** — overflow-safe shell, shared layout tokens, `body` scroll lock with main-only scroll.
2. **Navigation** — bottom nav, FAB, drawer, shared sidebar content.
3. **Topbar** — route-aware mobile headers; desktop topbar unchanged.
4. **Assignments** — toolbar, cards, grid, empty state.
5. **Create assignment** — single-column form, mobile question cards, sticky footer, paper totals.
6. **Generated paper** — readable typography, MCQ wrapping, mobile download affordance.
7. **Polish** — touch utilities, `lg:hover` vs `active:`, reduced motion, scroll containment.

---

## Responsive QA Checklist

Test in DevTools (or devices) at **375**, **768**, **1024**, **1440**:

| Page | Checks |
|------|--------|
| `/assignments` | Filter + search one row; FAB visible; card menu 44px; no `overflow-x` |
| `/assignments/create` | Sticky footer above bottom nav; steppers tappable |
| `/assignments/[id]/generating` | Progress visible; topbar title only (no duplicate header) |
| `/assignments/[id]` | Paper scrolls; banner download; sections regenerate |
| `/home` | Bottom nav + FAB |
| `lg+` | Sidebar + desktop FAB; no bottom nav |

**Build:** `cd frontend/vedaai && npm run build`

---

## Remaining Limitations

- **Library / AI Toolkit** — bottom nav entries may be disabled or placeholder until those modules ship.
- **Hover on shadcn `Button`** — global `button.tsx` variants still use default `hover:`; dashboard hot paths use `lg:hover` / `active:` overrides where touched.
- **Manual E2E** — assignment generation WebSocket, PDF download, and API delete should still be verified on a real device.
- **Tablet (768–1023)** — uses mobile chrome (no sidebar) by design until a dedicated tablet nav is requested.

---

## Implementation Rules (observed)

- No backend or auth changes for mobile UI work.
- Reused existing components; mobile wrappers only where needed.
- Framer Motion retained for page transitions and nav indicator; reduced when OS prefers less motion.
