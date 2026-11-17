/** Golden angle in radians: the divergence angle of a sunflower seed head. */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export type Point = { x: number; y: number };

/** Deterministic pseudo-random value in [0, 1) for particle i and channel s. */
export function hash(i: number, s: number): number {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * The five gates of the process loop, in the coordinate space w x h.
 * Horizontal on wide screens, vertical on narrow ones. The canvas field and
 * the DOM diagram both call this, so particles and labels always line up.
 */
export function gates(w: number, h: number, vertical: boolean): Point[] {
  return Array.from({ length: 5 }, (_, i) =>
    vertical
      ? { x: w * (i % 2 ? 0.2 : 0.12), y: h * (0.3 + i * 0.14) }
      : { x: w * (0.12 + i * 0.19), y: h * (i % 2 ? 0.5 : 0.6) },
  );
}

/** Point at u in [0, 1] along the eased curve through the gates. */
export function pathPoint(g: Point[], u: number, vertical: boolean): Point & { f: number } {
  const s = Math.min(3.9999, Math.max(0, u * 4));
  const k = Math.floor(s);
  const f = s - k;
  const e = (1 - Math.cos(f * Math.PI)) / 2;
  const a = g[k];
  const b = g[k + 1];
  return vertical
    ? { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * f, f }
    : { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * e, f };
}

/** SVG path data for the gate curve inside a 100 x 100 viewBox. */
export function pathData(vertical: boolean, samples = 96): string {
  const g = gates(100, 100, vertical);
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const p = pathPoint(g, i / samples, vertical);
    d += `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return d;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
