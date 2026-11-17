import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Dict } from "@/i18n";
import Magnetic from "./Magnetic";

export default function Hero({ t }: { t: Dict["hero"] }) {
  return (
    <section id="top" data-scene="seed" className="sticky top-0 flex min-h-svh flex-col justify-start px-5 pb-10 pt-28 md:px-12 md:pt-36 lg:justify-center lg:pt-24">
      {/* Keeps the headline readable where it crosses the field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink from-35% to-transparent to-75% lg:bg-gradient-to-r lg:from-ink lg:from-45% lg:to-transparent lg:to-80%"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink from-25% to-transparent" />

      <div className="hero-in relative">
        <p className="label mb-5 max-w-[30ch] md:max-w-none" data-hero style={{ "--i": 0 } as React.CSSProperties}>
          {t.eyebrow}
        </p>
        <h1 className="display text-[length:calc(clamp(3rem,13.4vw,10rem)*var(--display-scale))]">
          <span className="mask-line">
            <span>{t.line1}</span>
          </span>
          <span className="mask-line">
            <span>
              <em className="accent">{t.line2Accent}</em> <span className="whitespace-nowrap">{t.line2Rest}</span>
            </span>
          </span>
        </h1>
        <p className="mt-7 max-w-[26rem] text-base text-sage md:mt-9 md:text-[17px]" data-hero style={{ "--i": 1 } as React.CSSProperties}>
          {t.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:mt-10" data-hero style={{ "--i": 2 } as React.CSSProperties}>
          <Magnetic>
            <a href="#contact" className="pill pill-solid">
              {t.cta} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Magnetic>
          <a href="#capabilities" className="pill pill-ghost">
            {t.secondary}
          </a>
        </div>
      </div>

      <div className="label absolute bottom-6 right-5 hidden bg-ink/85 px-3 py-2 text-right md:right-9 lg:block" data-hero style={{ "--i": 3 } as React.CSSProperties}>
        <p aria-hidden="true">φ = 137.5°</p>
        <p className="mt-1 flex items-center justify-end gap-1.5 text-ivory">
          {t.scroll} <ArrowDown size={12} aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
