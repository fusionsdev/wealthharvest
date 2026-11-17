import type { Dict } from "@/i18n";

/** Five stacked layers, each one inset further, read bottom to top as a stack. */
export default function Systems({ t }: { t: Dict["systems"] }) {
  return (
    <section id="systems" data-scene="latticeDim" className="px-5 py-24 md:px-12 md:py-36">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <div data-lines>
          <p className="label mb-6">
            <span className="text-lime">05</span> <span aria-hidden="true">&nbsp;/&nbsp;</span> {t.label}
          </p>
          <h2 className="display max-w-[13ch] text-[length:calc(clamp(2.4rem,5.4vw,4.25rem)*var(--display-scale))]">
            <span className="mask-line">
              <span>{t.title}</span>
            </span>
          </h2>
          <p className="mt-8 max-w-[26rem] text-[15px] text-sage" data-reveal>
            {t.body}
          </p>
          <p className="label mt-10 max-w-[26rem] !leading-relaxed !text-champ" data-reveal>
            {t.disclaimer}
          </p>
        </div>

        <div className="relative lg:pl-10">
          {/* Axis: the arrow and its caption run along the stack on wide screens. */}
          <div aria-hidden="true" className="absolute bottom-2 left-0 top-2 hidden w-px bg-champ/50 lg:block">
            <span className="absolute -left-[4px] -top-1 h-0 w-0 border-x-[4.5px] border-b-[9px] border-x-transparent border-b-champ/80" />
          </div>
          <ol className="flex flex-col gap-3" reversed>
            {t.layers.map((layer, i) => (
              <li
                key={layer.name}
                data-reveal
                style={{ marginInline: `calc(${i} * clamp(0px, 1.4vw, 18px))` }}
                className="group flex items-center gap-5 border border-ivory/20 bg-forest/45 px-5 py-4 transition-[border-color,background-color,transform] duration-500 ease-expo hover:-translate-y-1 hover:border-lime hover:bg-forest md:py-5"
              >
                <span className="label transition-colors group-hover:!text-lime">L0{5 - i}</span>
                <div>
                  <h3 className="text-lg md:text-[19px]">{layer.name}</h3>
                  <p className="mt-0.5 text-[12.5px] text-sage">{layer.items}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="label mt-6 lg:text-right">{t.axis}</p>
        </div>
      </div>
    </section>
  );
}
