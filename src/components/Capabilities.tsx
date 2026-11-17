"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Dict } from "@/i18n";
import SectionHead from "./SectionHead";

/**
 * Five bands. On wide screens they sit side by side and the active one widens;
 * on narrow screens they stack and the active one unfolds. Hover, focus and
 * tap all open a band.
 */
export default function Capabilities({ t }: { t: Dict["capabilities"] }) {
  const [active, setActive] = useState(1);

  const list = (items: string[]) => (
    <ul>
      {items.map((it, k) => (
        <li key={it} className="hairline flex items-baseline justify-between gap-4 border-t py-2.5 text-sm">
          <span>{it}</span>
          <span className="label" aria-hidden="true">
            0{k + 1}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="capabilities" data-scene="lattice" className="px-5 py-24 md:px-12 md:py-36">
      <SectionHead index="03" label={t.label} title={t.title} aside={t.hint} />

      {/* Wide screens: horizontal bands. */}
      <div className="hidden h-[34rem] lg:flex" data-reveal>
        {t.items.map((item, i) => {
          const on = i === active;
          return (
            <div
              key={item.letter}
              onMouseEnter={() => setActive(i)}
              className={`hairline relative min-w-0 overflow-hidden border-l transition-[flex-grow,background-color] duration-700 ease-expo ${
                on ? "grow-[3.4] bg-forest" : "grow bg-ink/40"
              } basis-0`}
            >
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`cap-${item.letter}`}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="absolute inset-0 z-10 w-full cursor-default text-left"
              >
                <span className="sr-only">{item.title}</span>
              </button>

              {/* Collapsed face */}
              <div className={`absolute inset-0 p-6 transition-opacity duration-300 ${on ? "opacity-0" : "opacity-100 delay-200"}`} aria-hidden="true">
                <p className="label">0{i + 1}</p>
                <p className="mt-6 max-w-[11rem] text-[15px] leading-snug">{item.title}</p>
                <p className="display absolute bottom-3 left-5 text-[6rem] text-champ">{item.letter}</p>
              </div>

              {/* Open face. Fixed width, so text does not reflow while the band widens. */}
              <div
                id={`cap-${item.letter}`}
                className={`absolute inset-y-0 left-0 w-[34rem] max-w-[46vw] p-7 transition-opacity duration-500 ${on ? "opacity-100 delay-200" : "invisible opacity-0"}`}
              >
                <p className="display text-[6rem] !leading-[0.8] text-lime" aria-hidden="true">
                  {item.letter}
                </p>
                <h3 className="mt-6 max-w-[16ch] text-[1.65rem] leading-tight tracking-tight">{item.title}</h3>
                <p className="mb-5 mt-3 max-w-[44ch] text-sm text-sage">{item.body}</p>
                {list(item.list)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrow screens: vertical accordion. */}
      <div className="lg:hidden" data-reveal>
        {t.items.map((item, i) => {
          const on = i === active;
          return (
            <div key={item.letter} className={`hairline -mx-2 border-t px-2 transition-colors duration-500 ${on ? "bg-forest" : ""}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`cap-m-${item.letter}`}
                  onClick={() => setActive(on ? -1 : i)}
                  className="flex min-h-16 w-full items-center gap-4 py-3 text-left"
                >
                  <span className={`display w-8 text-4xl transition-colors ${on ? "text-lime" : "text-champ"}`} aria-hidden="true">
                    {item.letter}
                  </span>
                  <span className="flex-1 text-[15px] leading-snug">{item.title}</span>
                  <Plus size={18} aria-hidden="true" className={`shrink-0 text-sage transition-transform duration-500 ease-expo ${on ? "rotate-45" : ""}`} />
                </button>
              </h3>
              <div
                id={`cap-m-${item.letter}`}
                inert={!on}
                className={`grid transition-[grid-template-rows] duration-700 ease-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 text-sm text-sage">{item.body}</p>
                  <div className="pb-4">{list(item.list)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
