// Motion helpers — no custom ease arrays to avoid Framer Motion strict type issues

export const hidden = { opacity: 0, y: 24 };
export const hiddenScale = { opacity: 0, scale: 0.95 };
export const hiddenX = { opacity: 0, x: 28 };

export function visibleFadeUp(delay = 0) {
  return { opacity: 1, y: 0, transition: { duration: 0.6, delay } };
}

export function visibleScale(delay = 0) {
  return { opacity: 1, scale: 1, transition: { duration: 0.55, delay } };
}

export function visibleX(delay = 0) {
  return { opacity: 1, x: 0, transition: { duration: 0.5, delay } };
}

// Stagger container — used as Variants (no transition inside visible state)
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// Child variant for stagger — no ease, just duration
export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};
