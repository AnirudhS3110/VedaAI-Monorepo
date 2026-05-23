/** Shared Framer Motion variants for landing sections */
export const easeOut = [0.25, 0.1, 0.25, 1] as const;

export const viewportOnce = { once: false, margin: "-60px" } as const;

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: easeOut },
} as const;

export const fadeUpHero = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: easeOut },
} as const;

export const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
} as const;

export const floatY = {
  animate: { y: [0, -6, 0] as number[] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
};
