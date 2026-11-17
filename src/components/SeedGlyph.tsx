/**
 * A small static seed head, drawn as SVG on the server.
 * Changing the divergence angle by a fraction of a degree changes the whole
 * pattern, so each venture gets a distinct mark from the same rule.
 * Points are zero-length round-capped strokes, grouped by ring to keep markup small.
 */
export default function SeedGlyph({ angle, count = 230, className }: { angle: number; count?: number; className?: string }) {
  const rings = 6;
  const paths = Array.from({ length: rings }, () => "");
  const c = 96 / Math.sqrt(count);
  let core = "";

  for (let i = 1; i <= count; i++) {
    const r = c * Math.sqrt(i);
    const th = (i * angle * Math.PI) / 180;
    const d = `M${(110 + r * Math.cos(th)).toFixed(1)} ${(110 + r * Math.sin(th)).toFixed(1)}h0`;
    if (i <= 10) core += d;
    else paths[Math.min(rings - 1, Math.floor((i / count) * rings))] += d;
  }

  const colour = ["#f1ecdf", "#e4d9bd", "#d3c49e", "#c9b78a", "#8f9a6f", "#55694f"];

  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true" fill="none" strokeLinecap="round">
      {paths.map((d, k) => (
        <path key={k} d={d} stroke={colour[k]} strokeWidth={2 + k * 0.7} opacity={1 - k * 0.09} />
      ))}
      <path d={core} stroke="#c8f169" strokeWidth={3} />
    </svg>
  );
}
