"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dict } from "@/i18n";
import { prefersReducedMotion } from "@/lib/fieldStore";

const words = (s: string) => s.split(" ").filter(Boolean);

export default function Philosophy({ t }: { t: Dict["philosophy"] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Words fill in as the statement travels up the viewport.
      gsap.to("[data-word]", {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: { trigger: "[data-statement]", start: "top 82%", end: "bottom 45%", scrub: 0.4 },
      });
      // The growth line draws from left to right.
      gsap.fromTo(
        "[data-draw]",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: "[data-draw]", start: "top 90%", end: "top 35%", scrub: 0.4 } },
      );
      gsap.fromTo("[data-dot]", { scale: 0 }, { scale: 1, transformOrigin: "center", scrollTrigger: { trigger: "[data-draw]", start: "top 55%", toggleActions: "play none none reverse" } });
    }, root);
    return () => ctx.revert();
  }, []);

  const word = (w: string, i: number, cls = "") => (
    <span key={`${w}-${i}`} data-word className={cls}>
      {w}{" "}
    </span>
  );

  return (
    <section
      ref={root}
      id="philosophy"
      data-scene="hidden"
      className="on-ivory relative bg-ivory px-5 py-24 text-ink md:px-12 md:py-36"
    >
      <p className="label mb-8 !text-moss">
        <span className="font-medium text-forest">02</span> <span aria-hidden="true">&nbsp;/&nbsp;</span> {t.label}
      </p>

      <h2 data-statement className="display max-w-[15ch] text-[length:calc(clamp(2.8rem,8vw,6.5rem)*var(--display-scale))] md:max-w-[17ch]">
        {words(t.a).map((w, i) => word(w, i))}
        <br />
        {words(t.b).map((w, i) => word(w, i))}
        {words(t.bAccent).map((w, i) => word(w, i, "italic [:lang(th)_&]:not-italic"))}
        <span className="text-ink/60 [:lang(th)_&]:block">{words(t.c).map((w, i) => word(w, i))}</span>
      </h2>

      <div className="relative my-12 h-24 md:my-16 md:h-36" aria-hidden="true">
        <svg data-draw viewBox="0 0 1200 160" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0 150 C 340 150, 440 96, 700 92 S 1040 60, 1200 8" fill="none" stroke="var(--color-forest)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        </svg>
        <span data-dot className="absolute left-[58.33%] top-[57.5%] -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full bg-forest" />
      </div>

      <ul className="grid gap-10 md:grid-cols-3">
        {t.cols.map((c, i) => (
          <li key={c.title} className="border-t border-ink/25 pt-4" data-reveal>
            <p className="label !text-moss">0{i + 1}</p>
            <h3 className="mt-2 text-xl">{c.title}</h3>
            <p className="mt-2 max-w-[34ch] text-[15px] text-ink/70">{c.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-12 max-w-[60ch] text-[15px] text-ink/70" data-reveal>
        {t.note}
      </p>
    </section>
  );
}
