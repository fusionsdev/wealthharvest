/** Numbered mono label plus a masked display title, shared by most sections. */
export default function SectionHead({ index, label, title, aside }: { index: string; label: string; title: string; aside?: string }) {
  return (
    <header className="mb-10 md:mb-14" data-lines>
      <p className="label mb-4">
        <span className="text-lime">{index}</span> <span aria-hidden="true">&nbsp;/&nbsp;</span> {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="display max-w-[18ch] text-[length:calc(clamp(2.4rem,5.4vw,4.25rem)*var(--display-scale))]">
          <span className="mask-line">
            <span>{title}</span>
          </span>
        </h2>
        {aside && (
          <p className="label hidden pb-2 lg:block" data-reveal>
            {aside}
          </p>
        )}
      </div>
    </header>
  );
}
