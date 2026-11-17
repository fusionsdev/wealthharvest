import type { Dict } from "@/i18n";

export default function About({ t }: { t: Dict["about"] }) {
  return (
    <section id="about" data-scene="seedCorner" className="px-5 py-24 md:px-12 md:py-40">
      <p className="label mb-8">
        <span className="text-lime">07</span> <span aria-hidden="true">&nbsp;/&nbsp;</span> {t.label}
      </p>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20">
        <h2 className="display text-[length:calc(clamp(1.9rem,4.3vw,3.4rem)*var(--display-scale))] !leading-[1.06] [:lang(th)_&]:!leading-[1.4]" data-reveal>
          {t.statement}
        </h2>
        <div>
          <p className="label mb-3" data-reveal>
            {t.principlesLabel}
          </p>
          <ol>
            {t.principles.map((p, i) => (
              <li key={p.title} className="hairline flex gap-5 border-t py-4" data-reveal>
                <span className="label w-7 pt-1 !text-lime" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-lg">{p.title}</h3>
                  <p className="mt-0.5 text-[13px] text-sage">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
