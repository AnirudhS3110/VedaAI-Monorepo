/**
 * Shared responsive layout tokens (Phase 1 foundation).
 * Use with cn() across pages and layout shells.
 */
export const responsiveLayout = {
  /** Horizontal page padding — shell provides max-lg inset; full padding from lg */
  pageX: "max-lg:px-0 px-4 sm:px-6 lg:px-8",
  /** Centered content column with overflow safety */
  pageContainer: "mx-auto w-full min-w-0 max-w-6xl",
  /** Main scroll region — prevents flex overflow on narrow viewports */
  mainScroll:
    "min-w-0 flex-1 overflow-x-hidden overflow-y-auto overflow-touch scroll-smooth",
  /** Standard vertical page padding */
  pageY: "max-lg:py-4 py-6 sm:py-8",
} as const;
