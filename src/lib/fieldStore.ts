/**
 * Tiny shared state between DOM sections and the canvas field.
 * Plain mutable object: the field reads it every frame, so React state would
 * only add re-renders.
 */
export const fieldStore = {
  /** Scroll progress through the pinned process section, 0 to 1. */
  process: 0,
};

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
