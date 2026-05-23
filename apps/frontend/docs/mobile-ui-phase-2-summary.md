# Mobile UI — Phase 2: Mobile Navigation

## Completed scope

Bottom navigation, floating create button, hamburger drawer, and mobile topbar basics. Desktop sidebar unchanged at `lg+`.

## New components

| File | Role |
|------|------|
| `mobile-nav-context.tsx` | Drawer open/close state |
| `sidebar-nav-content.tsx` | Shared nav links (desktop sidebar + drawer) |
| `mobile-bottom-nav.tsx` | Fixed pill nav: Home, Assignments, Library, AI Toolkit |
| `mobile-create-fab.tsx` | White circle + orange `+` on `/assignments` and `/home` |
| `mobile-nav-drawer.tsx` | Slide-over from right with full sidebar content |
| `lib/nav-utils.ts` | Shared `isNavActive()` |

## Behavior

### Bottom nav (`< lg`)
- Dark rounded bar, safe-area bottom padding
- Active tab: white label + top indicator bar (Framer Motion)
- Disabled: Library, AI Toolkit (same as desktop)

### FAB
- Visible on `/assignments` and `/home` only
- Sits above bottom nav
- Links to `/assignments/create`
- Desktop sticky FAB hidden (`lg:flex` only on `CreateAssignmentFab`)

### Hamburger drawer
- Full sidebar nav + create + settings + sign out
- Closes on link click, overlay tap, or Escape
- `body` scroll locked while open

### Mobile topbar (partial — full polish in Phase 3)
- Logo on root routes; back + title on nested routes
- Bell, avatar, menu button
- Sticky on mobile

### Main content
- `pb-[calc(5.5rem+safe-area)]` on mobile so content clears bottom nav

## Constants

`mobileBottomNavItems` in `constants/navigation.ts`

## Desktop

No visual change at `lg+`: fixed sidebar, original topbar breadcrumb, center create FAB on assignments list.

## Verify

```bash
cd frontend/vedaai && npm run build
```

375px: bottom nav, FAB on assignments, menu opens drawer, navigate Home/Assignments.

1024px+: sidebar visible, no bottom nav.

## Next

**Phase 3 — Mobile topbar** (full Figma match: spacing, notifications, account).
