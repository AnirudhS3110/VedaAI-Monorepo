# Mobile UI — Phase 5: Create Assignment Responsive

## Completed scope

Create assignment form optimized for mobile (Figma long-scroll layout). Desktop `lg+` unchanged.

## Form layout (`create-assignment-form.tsx`)

- Single-column fields on mobile; 2-column grid from `sm` for class/title
- Subject full width on mobile (`sm:col-span-2`)
- `text-base` inputs on mobile (better tap/readability), `sm:text-sm` on larger screens
- Tighter vertical rhythm (`space-y-5`, `pt-3` under topbar)
- Extra bottom padding (`max-lg:pb-32`) for sticky footer + bottom nav
- Section dividers: question types + additional information

## Question rows (`question-type-row.tsx`)

**Mobile:** card per row — type dropdown full width, remove top-right, count + marks in 2-column grid.

**Desktop (`sm+`):** original 4-column grid alignment.

## Totals (`question-types-section.tsx`)

- Paper totals box with per-type breakdown (restored)
- Full-width “Add Question Type” on mobile
- Column headers desktop-only (`lg:grid`)

## Upload (`file-upload-zone.tsx`)

- Shorter min-height on mobile, responsive padding
- Full-width “Browse Files” button on narrow screens

## Footer (`form-step-footer.tsx`)

- **Sticky** above bottom nav on mobile (`max-lg:sticky`)
- Blurred bar with border; full-width Previous / Next
- Loading state on submit (“Creating…”)

## Mic (`voice-input-button.tsx`)

- `size-10` touch target, `rounded-xl`

## Progress (`form-progress.tsx`)

- Fixed invalid `px-auto` class

## Verify

375px `/assignments/create`: scroll form, stacked fields, card question rows, sticky Next, mic accessible.

1024px+: multi-column details, grid question rows, centered footer buttons.

## Next

**Phase 6 — Generated paper mobile view**
