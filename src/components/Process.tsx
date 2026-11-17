"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dict } from "@/i18n";
import { fieldStore } from "@/lib/fieldStore";
import { gates, pathData } from "@/lib/geometry";

/**
 * Pinned storytelling. The section is four screens tall and its content sticks
 * for the whole distance. Scroll progress draws the path, advances the active
 * step and tells the canvas field how far its points are lit.
 * Gate positions come from lib/geometry, the same source the field uses.
 */
export default function Process({ t }: { t: Dict["process"] }) {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const paths = root.current!.querySelectorAll<SVGSVGElement>("[data-flowpath]");
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // The path completes at 87% so the last step holds before release.
        const drawn = Math.min(1, self.progress * 1.15);
        fieldStore.process = drawn;
        // The curve only ever advances along one axis, so a clip edge reveals it exactly.
        // Gates span 12% to 88% across on wide screens and 30% to 86% down on narrow ones.
        paths.forEach((p) => {
          p.style.clipPath = p.dataset.flowpath === "v" ? `inset(0 0 ${70 - 56 * drawn}% 0)` : `inset(0 ${88 - 76 * drawn}% 0 0)`;
        });
        setStep(Math.min(4, Math.floor(drawn * 4 + 0.001)));
      },
    });
    // Web fonts change text height above this section, which moves the pin range.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => trigger.kill();
  }, []);

  const diagram = (vertical: boolean) => {
    const g = gates(100, 100, vertical);
    return (
      <div className={`absolute inset-0 ${vertical ? "md:hidden" : "hidden md:block"}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d={pathData(vertical)} fill="none" stroke="rgb(201 183 138 / 0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {!vertical && (
            <path
              d="M88 64 C 88 97, 12 97, 12 64"
              fill="none"
              stroke="var(--color-champ)"
              strokeWidth="1"
              strokeDasharray="3 6"
              vectorEffect="non-scaling-stroke"
              className={`transition-opacity duration-1000 ${step === 4 ? "opacity-60" : "opacity-0"}`}
            />
          )}
        </svg>
        <svg
          data-flowpath={vertical ? "v" : "h"}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: "inset(0 100% 0 0)" }}
          aria-hidden="true"
        >
          <path d={pathData(vertical)} fill="none" stroke="var(--color-lime)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>

        <ol>
          {t.steps.map((s, i) => {
            const on = i === step;
            const passed = i <= step;
            const above = !vertical && i % 2 === 1;
            return (
              <li key={s.name} aria-current={on ? "step" : undefined}>
                <span
                  aria-hidden="true"
                  style={{ left: `${g[i].x}%`, top: `${g[i].y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] transition-all duration-700 ease-expo ${
                    on ? "h-8 w-8 border-lime bg-lime" : passed ? "h-4 w-4 border-lime bg-ink" : "h-4 w-4 border-champ/70 bg-ink"
                  }`}
                />
                <div
                  style={
                    vertical
                      ? { left: "32%", top: `${g[i].y}%` }
                      : above
                        ? { left: `${g[i].x}%`, bottom: `calc(${100 - g[i].y}% + 2.25rem)` }
                        : { left: `${g[i].x}%`, top: `calc(${g[i].y}% + 2.25rem)` }
                  }
                  className={`absolute transition-opacity duration-500 ${
                    vertical ? "right-5 -translate-y-1/2" : "w-48 -translate-x-1/2 text-center lg:w-52"
                  } ${passed ? "opacity-100" : "opacity-45"}`}
                >
                  <p className="label">0{i + 1}</p>
                  <h3 className={`display text-[1.75rem] transition-colors duration-500 md:text-4xl ${on ? "text-lime" : ""}`}>{s.name}</h3>
                  <p className="mt-1 text-[12.5px] leading-snug text-sage md:text-[13px]">{s.line}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  return (
    <section ref={root} id="process" data-scene="flow" className="relative h-[400svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <header className="relative z-10 px-5 pt-20 md:px-12 md:pt-28">
          <p className="label mb-4">
            <span className="text-lime">04</span> <span aria-hidden="true">&nbsp;/&nbsp;</span> {t.label}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display max-w-[14ch] text-[length:calc(clamp(2.1rem,5.4vw,4.25rem)*var(--display-scale))] md:max-w-none">{t.title}</h2>
            <p className="label pb-2" aria-live="polite">
              {t.stepLabel} <span className="text-ivory">0{step + 1}</span> / 05
            </p>
          </div>
        </header>

        {diagram(false)}
        {diagram(true)}

        <p
          className={`label absolute inset-x-0 bottom-[6%] hidden text-center !text-champ transition-opacity duration-1000 md:block ${
            step === 4 ? "opacity-100" : "opacity-0"
          }`}
        >
          {t.loop}
        </p>
      </div>
    </section>
  );
}
