import type { Dict } from "@/i18n";
import DragScroll from "./DragScroll";
import SectionHead from "./SectionHead";
import SeedGlyph from "./SeedGlyph";

// One divergence angle per slot. 137.508 is the golden angle; the others sit a fraction of a degree away.
const angles = [137.508, 137.3, 138.3, 136.2];

/** A shelf of product slots. Every card is labelled as a placeholder until a real product exists. */
export default function Ventures({ t }: { t: Dict["ventures"] }) {
  return (
    <section id="ventures" data-scene="net" className="py-24 md:py-36">
      <div className="px-5 md:px-12">
        <SectionHead index="06" label={t.label} title={t.title} aside={t.hint} />
        <p className="-mt-4 mb-10 max-w-[40rem] text-[15px] text-sage md:-mt-6" data-reveal>
          {t.body}
        </p>
      </div>

      <DragScroll label={t.label}>
        {t.items.map((item, i) => (
          <li
            key={item.name}
            data-reveal
            data-cursor
            className="group relative flex w-[17.5rem] shrink-0 snap-start flex-col border border-ivory/15 bg-forest/40 transition-colors duration-500 hover:border-champ/60 hover:bg-forest/80 md:w-[19rem]"
          >
            <SeedGlyph angle={angles[i % angles.length]} className="mx-auto mt-6 h-52 w-52 transition-transform duration-[1400ms] ease-expo group-hover:rotate-[55deg]" />
            <div className="flex flex-1 flex-col p-5">
              <p>
                <span className="inline-block rounded-full border border-champ/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-champ">
                  {t.tag}
                </span>
              </p>
              <h3 className="display mt-4 min-h-[2.2em] text-3xl !leading-[1.08]">{item.name}</h3>
              <p className="label mt-8 flex flex-col gap-1">
                <span>
                  V/0{i + 1} · {item.category}
                </span>
                <span className="!text-champ">{t.status}</span>
              </p>
            </div>
          </li>
        ))}
      </DragScroll>

      <p className="label mt-8 px-5 !text-champ md:px-12" data-reveal>
        {t.note}
      </p>
    </section>
  );
}
