# Mobile UI — Phase 6: Generated Paper Mobile View

## Completed scope

Assignment output / exam paper tuned for mobile reading (Figma paper + answer key). Inter font preserved via `--font-document`. Desktop `lg+` unchanged.

## AI banner (`assignment-ai-banner.tsx`)

- Compact dark card matching Figma
- **Download** as icon button bottom-left on mobile (`absolute bottom-3 left-3`)
- Full “Download as PDF” label from `sm+`

## Paper container (`exam-paper-document.tsx`)

- Mobile: `rounded-xl`, lighter shadow, `px-4 py-5`
- Header scales (`text-base` → `lg:text-xl`)
- Time/marks stack on mobile
- Student fields: stacked labels + underline lines with `min-h` for writing space
- **Answer Key**: `break-words` / `overflow-wrap: anywhere` for long model answers and equations
- Slightly smaller mobile typography; `sm+` matches prior desktop paper sizes

## Sections (`exam-paper-section.tsx`)

- Section title centered; **Regenerate** below title on mobile, inline on `sm+`
- Tighter section spacing on mobile
- Regenerate overlay readable on narrow screens

## Questions (`exam-paper-question.tsx`)

- `text-sm` + `leading-[1.65]` on mobile
- Question text wraps (`break-words`, `overflow-wrap: anywhere`)
- MCQ options: `pl-4`, extra vertical spacing between options
- Difficulty tags: Easy / Moderate / Challenging (unchanged labels)

## Output page (`assignment-output-view.tsx`)

- Tighter spacing under topbar; padding aligned with other mobile pages

## Verify

375px `/assignments/[id]`:

- Greeting card + download icon
- Scroll full paper without horizontal overflow
- MCQ options readable
- Answer key wraps long text

1024px+: prior paper layout and typography.

## Next

**Phase 7 — Mobile polish** (animations, hover-only desktop, scroll fixes)
