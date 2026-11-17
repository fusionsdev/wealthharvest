"use client";

import { useEffect, useRef } from "react";
import { fieldStore, prefersReducedMotion } from "@/lib/fieldStore";
import { GOLDEN_ANGLE, clamp01, gates, hash, lerp, pathPoint } from "@/lib/geometry";

/**
 * The generative field: one fixed canvas of points behind the whole page.
 * Every section names a scene with data-scene. As the next section scrolls
 * in, each point travels from its place in the current scene to its place in
 * the next one, so the same points form the seed head, the lattice, the
 * process flow and the network.
 */

type SceneName = "seed" | "hidden" | "lattice" | "latticeDim" | "flow" | "net" | "seedCorner" | "netOpen";
type Scene = { pos: Float32Array; alpha: number; size: number; lines: "seed" | "net" | null; flow: boolean; pairs?: number[] };

const INK = [11, 15, 12];
const IVORY = [241, 236, 223];
const CHAMP = [201, 183, 138];
const MOSS = [30, 59, 43];
const LIME = "rgb(200,241,105)";
const BUCKETS = 12;
const CORE = 34;

function mix(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(lerp(v, b[i], t)));
}

/** Colour and opacity per bucket: ivory at the centre, champagne, then moss fading into the ground. */
function bucketStyle(k: number): string {
  const t = (k + 0.5) / BUCKETS;
  const c = t < 0.45 ? mix(IVORY, CHAMP, t / 0.45) : mix(CHAMP, MOSS, (t - 0.45) / 0.55);
  const a = t < 0.45 ? 0.95 : lerp(0.9, 0.4, (t - 0.45) / 0.55);
  // Pre-blend against the ground so overlapping points do not brighten.
  const o = mix(INK, c, a);
  return `rgb(${o[0]},${o[1]},${o[2]})`;
}

export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const styles = Array.from({ length: BUCKETS }, (_, k) => bucketStyle(k));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let n = 0;
    let vertical = false;
    let scenes: Scene[] = [];
    let tops: number[] = [];
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let flowPos = new Float32Array(0);
    let shown = 0; // damped scene position, e.g. 2.4 = 40% from scene 2 to scene 3
    let reveal = reduced ? 1 : 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let time = 0;
    let idle = 0; // consecutive frames in which nothing moved
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    function seedScene(cx: number, cy: number, radius: number): Float32Array {
      const pos = new Float32Array(n * 2);
      const c = radius / Math.sqrt(n);
      for (let i = 0; i < n; i++) {
        const r = c * Math.sqrt(i + 1);
        const th = (i + 1) * GOLDEN_ANGLE;
        pos[i * 2] = cx + r * Math.cos(th);
        pos[i * 2 + 1] = cy + r * Math.sin(th);
      }
      return pos;
    }

    function latticeScene(): Float32Array {
      const pos = new Float32Array(n * 2);
      const cols = Math.max(1, Math.round(Math.sqrt((n * w) / h)));
      const rows = Math.ceil(n / cols);
      // Shuffle which point takes which cell, so the morph reads as settling, not unwinding.
      const cell = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(hash(i, 9) * (i + 1));
        [cell[i], cell[j]] = [cell[j], cell[i]];
      }
      for (let i = 0; i < n; i++) {
        pos[i * 2] = ((cell[i] % cols) + 0.5) * (w / cols);
        pos[i * 2 + 1] = (Math.floor(cell[i] / cols) + 0.5) * (h / rows);
      }
      return pos;
    }

    function netScene(open: boolean): Float32Array {
      const pos = new Float32Array(n * 2);
      const cx = w * 0.5;
      const cy = h * 0.42;
      const rx = Math.min(w * 0.46, 620);
      const ry = h * 0.27;
      for (let i = 0; i < n; i++) {
        let px = hash(i, 1) * w;
        let py = hash(i, 2) * h;
        if (open) {
          // Keep a clear ellipse behind the closing headline.
          const dx = (px - cx) / rx;
          const dy = (py - cy) / ry;
          const d = Math.hypot(dx, dy);
          if (d < 1) {
            const k = (1 + hash(i, 3) * 0.35) / Math.max(d, 0.05);
            px = cx + dx * rx * k;
            py = cy + dy * ry * k;
          }
        }
        pos[i * 2] = px;
        pos[i * 2 + 1] = py;
      }
      return pos;
    }

    function build() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      idle = 0;
      vertical = w < 768;
      n = vertical ? 420 : w < 1100 ? 640 : 900;
      x = new Float32Array(n);
      y = new Float32Array(n);
      flowPos = new Float32Array(n * 2);

      const cache = new Map<SceneName, Scene>();
      const make = (name: SceneName): Scene => {
        switch (name) {
          case "seed":
            // Below 1024px the seed sits under the headline; above it, beside the headline.
            return w < 1024
              ? { pos: seedScene(w * 0.5, h * 0.8, Math.min(w * 0.62, h * 0.42)), alpha: 1, size: 1, lines: "seed", flow: false }
              : { pos: seedScene(w * 0.8, h * 0.54, Math.min(w * 0.38, h * 0.62)), alpha: 1, size: 1, lines: "seed", flow: false };
          case "seedCorner":
            return { pos: seedScene(vertical ? w : w * 0.02, h * 1.04, vertical ? w * 0.85 : h * 0.75), alpha: 0.5, size: 1, lines: "seed", flow: false };
          case "lattice":
            return { pos: latticeScene(), alpha: 0.2, size: 0.45, lines: null, flow: false };
          case "latticeDim":
            return { pos: latticeScene(), alpha: 0.12, size: 0.4, lines: null, flow: false };
          case "flow":
            return { pos: flowPos, alpha: 1, size: 0.5, lines: null, flow: true };
          case "net":
            return { pos: netScene(false), alpha: 0.3, size: 0.6, lines: "net", flow: false };
          case "netOpen":
            return { pos: netScene(true), alpha: 0.7, size: 0.65, lines: "net", flow: false };
          default:
            return { pos: latticeScene(), alpha: 0, size: 0.45, lines: null, flow: false };
        }
      };

      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      scenes = sections.map((el) => {
        const name = el.dataset.scene as SceneName;
        if (!cache.has(name)) cache.set(name, make(name));
        return cache.get(name)!;
      });
      tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY);

      // Links for each network scene, between nearby points among the first 150.
      cache.forEach((scene) => {
        if (scene.lines !== "net") return;
        const pairs: number[] = [];
        const m = Math.min(n, 150);
        const reach = Math.min(w, h) * 0.13;
        for (let i = 0; i < m; i++)
          for (let j = i + 1; j < m; j++)
            if (Math.hypot(scene.pos[i * 2] - scene.pos[j * 2], scene.pos[i * 2 + 1] - scene.pos[j * 2 + 1]) < reach) pairs.push(i, j);
        scene.pairs = pairs;
      });
    }

    /** Scene position from scroll: section i+1 takes over while its top crosses the viewport. */
    function target(): number {
      const sy = window.scrollY;
      let f = 0;
      for (let i = 1; i < tops.length; i++) {
        const p = (sy + h - tops[i]) / (h * 0.85);
        if (p > 0) f = i - 1 + Math.min(1, p);
      }
      return f;
    }

    function updateFlow() {
      const g = gates(w, h, vertical);
      const spread = vertical ? 30 : 46;
      for (let i = 0; i < n; i++) {
        const u = (hash(i, 4) + time * 0.018) % 1;
        const p = pathPoint(g, u, vertical);
        // Streams narrow at each gate and widen between them.
        const off = (hash(i, 6) - 0.5) * 2 * spread * (0.2 + 0.8 * Math.sin(p.f * Math.PI));
        flowPos[i * 2] = p.x + (vertical ? off : 0);
        flowPos[i * 2 + 1] = p.y + (vertical ? 0 : off);
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (!reduced) time += dt;

      const goal = target();
      const before = shown;
      shown = reduced ? Math.round(goal) : shown + (goal - shown) * Math.min(1, dt * 6);
      if (Math.abs(goal - shown) < 0.0005) shown = goal;
      const growing = reveal < 1;
      if (growing) reveal = Math.min(1, reveal + dt / 2);

      const a = Math.min(scenes.length - 1, Math.floor(shown));
      const b = Math.min(scenes.length - 1, a + 1);
      const t = shown - a;
      const sa = scenes[a];
      const sb = scenes[b];
      if (!sa) return;

      const alpha = lerp(sa.alpha, sb.alpha, t);

      const flowing = sa.flow || sb.flow;
      const px0 = pointer.x;
      const py0 = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * 0.15;
      pointer.y += (pointer.ty - pointer.y) * 0.15;
      const pointing = Math.abs(pointer.x - px0) + Math.abs(pointer.y - py0) > 0.05;

      // A resting field is not redrawn: the last frame stays on the canvas.
      idle = growing || flowing || pointing || shown !== before ? 0 : idle + 1;
      if (idle > 2) return;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      if (alpha < 0.01) return;
      if (sa.flow || sb.flow) updateFlow();
      const count = Math.floor(n * (1 - Math.pow(1 - reveal, 3)));
      const reach = 150;

      for (let i = 0; i < count; i++) {
        // Each point leaves a little earlier or later than its neighbours.
        let ti = clamp01(t * 1.5 - hash(i, 5) * 0.5);
        ti = ti * ti * (3 - 2 * ti);
        let px = lerp(sa.pos[i * 2], sb.pos[i * 2], ti);
        let py = lerp(sa.pos[i * 2 + 1], sb.pos[i * 2 + 1], ti);
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < reach * reach && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = Math.pow(1 - d / reach, 2) * 26;
          px += (dx / d) * push;
          py += (dy / d) * push;
        }
        x[i] = px;
        y[i] = py;
      }

      const seedW = (sa.lines === "seed" ? 1 - t : 0) + (sb.lines === "seed" ? t : 0);
      const netW = (sa.lines === "net" ? 1 - t : 0) + (sb.lines === "net" ? t : 0);
      const flowW = (sa.flow ? 1 - t : 0) + (sb.flow ? t : 0);
      const size = lerp(sa.size, sb.size, t);

      ctx!.globalAlpha = alpha;
      ctx!.lineWidth = 0.6;
      if (seedW > 0.02) {
        // Parastichies: the Fibonacci spirals of a seed head, 21 and 34 points apart.
        ctx!.strokeStyle = `rgba(201,183,138,${0.16 * seedW * seedW})`;
        ctx!.beginPath();
        for (const step of [21, 34])
          for (let i = 0; i + step < count; i += 3) {
            ctx!.moveTo(x[i], y[i]);
            ctx!.lineTo(x[i + step], y[i + step]);
          }
        ctx!.stroke();
      }
      // Links belong to whichever network scene is closer, and fade out while points travel.
      const pairs = (t < 0.5 ? sa.pairs : sb.pairs) ?? sa.pairs ?? sb.pairs;
      const settled = sa.lines === "net" && sb.lines === "net" ? Math.abs(1 - 2 * t) : netW;
      if (pairs && settled > 0.02) {
        ctx!.strokeStyle = `rgba(201,183,138,${0.22 * settled * settled})`;
        ctx!.beginPath();
        for (let k = 0; k < pairs.length; k += 2) {
          const i = pairs[k];
          const j = pairs[k + 1];
          if (i >= count || j >= count) continue;
          ctx!.moveTo(x[i], y[i]);
          ctx!.lineTo(x[j], y[j]);
        }
        ctx!.stroke();
      }

      const radius = (i: number) => lerp(1.5, vertical ? 4.2 : 6, Math.pow(i / n, 0.8)) * size;

      if (flowW > 0.5) {
        // In the flow scene, points that have passed the active gate are lit.
        const lit = fieldStore.process;
        for (const pass of [0, 1]) {
          ctx!.fillStyle = pass ? LIME : "rgba(201,183,138,0.4)";
          ctx!.beginPath();
          for (let i = 0; i < count; i++) {
            const u = (hash(i, 4) + time * 0.018) % 1;
            if (u < lit !== !!pass) continue;
            const r = lerp(1, 2.4, hash(i, 7));
            ctx!.moveTo(x[i] + r, y[i]);
            ctx!.arc(x[i], y[i], r, 0, 6.2832);
          }
          ctx!.fill();
        }
      } else {
        const per = Math.ceil(n / BUCKETS);
        for (let k = 0; k < BUCKETS; k++) {
          ctx!.fillStyle = styles[k];
          ctx!.beginPath();
          for (let i = Math.max(CORE, k * per); i < Math.min(count, (k + 1) * per); i++) {
            const r = radius(i);
            ctx!.moveTo(x[i] + r, y[i]);
            ctx!.arc(x[i], y[i], r, 0, 6.2832);
          }
          ctx!.fill();
        }
        ctx!.fillStyle = LIME;
        ctx!.beginPath();
        for (let i = 0; i < Math.min(CORE, count); i++) {
          const r = 2.4 * Math.max(size, 0.6);
          ctx!.moveTo(x[i] + r, y[i]);
          ctx!.arc(x[i], y[i], r, 0, 6.2832);
        }
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    build();
    shown = target();
    start();

    // Rebuild on any layout change: viewport resize, font load, language switch.
    let queued = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(build);
    });
    observer.observe(document.body);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      cancelAnimationFrame(queued);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-0 h-svh w-full" />;
}
