/**
 * Mobile-only UI tokens (max-lg / < 1024px).
 * Desktop styles at lg+ are unchanged — apply these with max-lg: prefixes only.
 */
export const mobileUi = {
  shellBackground: "max-lg:bg-[#F3F3F5]",
  shellInsetX: "max-lg:px-3",
  shellInsetTop: "max-lg:pt-2",

  /** Floating top bar card (logo row only) */
  topBarShell:
    "max-lg:overflow-hidden max-lg:rounded-2xl max-lg:border max-lg:border-white/70 max-lg:bg-white max-lg:shadow-[0_4px_24px_rgba(0,0,0,0.1)]",

  /** Page title row — sits on #CECECE canvas, not inside the white navbar */
  pageTitleBar: "max-lg:mt-2 max-lg:bg-transparent",

  /** Light circular back control (Figma) */
  backButton:
    "touch-manipulation tap-highlight-none flex size-10 shrink-0 items-center justify-center rounded-full bg-white/95 text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors active:bg-white active:scale-95",

  /** Elevated content cards on gray canvas */
  elevatedCard:
    "max-lg:rounded-[1.25rem] max-lg:border max-lg:border-white/80 max-lg:bg-white max-lg:shadow-[0_6px_28px_rgba(0,0,0,0.1)]",

  /** Toolbar / filter row container */
  toolbarShell:
    "max-lg:rounded-2xl max-lg:border max-lg:border-white/70 max-lg:bg-white max-lg:p-2 max-lg:shadow-[0_4px_20px_rgba(0,0,0,0.08)]",

  bottomNavShadow:
    "max-lg:shadow-[0_10px_40px_rgba(0,0,0,0.32)]",

  fabShadow:
    "max-lg:shadow-[0_8px_28px_rgba(0,0,0,0.18)]",

  cardGap: "max-lg:gap-4",

  /** Create assignment form (mobile only) */
  createFormPage: "max-lg:-mx-3 max-lg:min-h-full max-lg:bg-[#E6E6E6] max-lg:px-3",
  createFormCard:
    "max-lg:border-0 max-lg:bg-[#E6E6E6] border-[#E8E8E8] shadow-md max-lg:p-0 max-lg:shadow-none",
  createFormField:
    "max-lg:border-[#E8E8E8] max-lg:bg-[#F6F6F6] max-lg:shadow-none",
  createFormTextarea:
    "max-lg:border max-lg:border-solid max-lg:border-[#E8E8E8] max-lg:bg-[#F6F6F6] max-lg:shadow-none",
} as const;
