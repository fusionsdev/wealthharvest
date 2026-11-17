# WealthHarvest

Marketing site for WealthHarvest, an AI-powered growth and technology venture studio.
One page, English and Thai, built with Next.js 16, TypeScript, Tailwind CSS 4 and GSAP.

## Run

```bash
npm install
npm run dev      # http://localhost:3000, redirects to /en
npm run build
npm run start
```

Deploy to any Next.js host. Both locales are prerendered as static HTML.

## Before launch

1. Fill in `src/site.config.ts`. Contact values ship empty. An empty value hides its row,
   and with no email, messaging link or social link the closing button is replaced by a
   "being finalised" note.
2. Replace the four venture cards in `src/i18n/en.ts` and `src/i18n/th.ts` when real
   products exist. They are labelled "Concept placeholder" until then.
3. Regenerate `public/og.png` (1200 x 630) if the hero changes.
4. Have a Thai speaker review `src/i18n/th.ts`.

## Structure

```
src/
  site.config.ts        site URL, contact details, locales
  i18n/                 typed dictionaries: en.ts, th.ts
  lib/geometry.ts       golden angle, process gates and curve (shared by canvas and DOM)
  lib/fieldStore.ts     scroll progress shared between the process section and the field
  app/[lang]/           layout (fonts, metadata, JSON-LD) and the page
  app/globals.css       design tokens, type styles, reveal states
  components/
    Field.tsx           the canvas particle field
    Motion.tsx          scroll reveals (IntersectionObserver + CSS)
    Nav, Hero, Philosophy, Capabilities, Process, Systems, Ventures, About, Contact
    Magnetic, Cursor, DragScroll, SeedGlyph, SectionHead
```

## Design system

| Token | Value | Use |
| --- | --- | --- |
| ink | `#0b0f0c` | page ground |
| forest | `#12261c` | raised surfaces |
| moss | `#1e3b2b` | depth, labels on ivory |
| ivory | `#f1ecdf` | text, the light section |
| champ | `#c9b78a` | labels, hairlines, letters |
| lime | `#c8f169` | actions and live state |
| sage | `#8c9a8e` | secondary text |

Type: Instrument Serif for display, Geist for text, Geist Mono for labels.
Thai falls through to Noto Serif Thai and IBM Plex Sans Thai in the same font stacks.
Thai display sizes are multiplied by `--display-scale: 0.74`.

## Animation architecture

Three layers, each with one job.

**Canvas field (`Field.tsx`).** One fixed 2D canvas behind the page holds 900 points
(640 on tablets, 420 on phones). Every section names a scene with `data-scene`.
The field reads scroll position each frame and moves every point from its place in the
current scene to its place in the next:

| Scene | Section | Arrangement |
| --- | --- | --- |
| `seed` | Hero | phyllotaxis: point n at radius c·√n, angle n·137.5° |
| `lattice` | Capabilities, Systems | a grid, dimmed behind content |
| `flow` | How we build | streams through five gates, lit up to the active step |
| `net` | Ventures, Contact | scattered points with links between neighbours |
| `seedCorner` | About | a second seed rising from the corner |

The pointer pushes nearby points aside. The loop pauses when the tab is hidden and skips
drawing when nothing moved. Device pixel ratio is capped at 2. No WebGL is required.

**Scroll-driven DOM (GSAP ScrollTrigger).** Used in two places only: the word-by-word
fill and line drawing in Philosophy, and the pinned Process section, where scroll
progress draws the path, advances the step and tells the field how far points are lit.
Canvas and DOM share gate positions through `lib/geometry.ts`.

**Reveals and microinteractions (CSS).** `Motion.tsx` runs one IntersectionObserver that
adds a class; CSS transitions do the rest. The hero uses CSS keyframes that start at first
paint. Bands, menu, shelf cards and buttons use CSS transitions. `Magnetic.tsx` and
`Cursor.tsx` use `gsap.quickTo` on mouse and trackpad devices.

**Reduced motion.** A script in `<head>` adds `html.motion` only when the visitor allows
motion. Every hidden initial state is scoped to that class. With reduced motion the field
draws a static seed and snaps between scenes, reveals are off, and smooth scrolling,
the magnetic button and the cursor ring are disabled.

## Accessibility

Semantic landmarks and heading order, a skip link, visible focus rings, a focus-trapped
mobile menu that closes on Escape, `aria-expanded` on bands, arrow-key scrolling on the
venture shelf, 44px minimum touch targets, `lang` and `hreflang` on both locales.
