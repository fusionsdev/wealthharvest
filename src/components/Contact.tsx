import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { Dict } from "@/i18n";
import { locales, site, type Locale } from "@/site.config";
import Magnetic from "./Magnetic";

/** Closing call to action and footer. Every contact value comes from site.config.ts. */
export default function Contact({ t, nav, lang }: { t: Dict["contact"]; nav: Dict["nav"]; lang: Locale }) {
  const c = site.contact;
  const rows = [
    { label: t.email, value: c.email, href: c.email && `mailto:${c.email}` },
    { label: t.messaging, value: c.messaging.replace(/^https?:\/\//, ""), href: c.messaging },
    { label: t.location, value: c.location, href: "" },
    { label: t.social, value: c.social.replace(/^https?:\/\//, ""), href: c.social },
  ].filter((r) => r.value);
  const primary = c.email ? `mailto:${c.email}` : c.messaging || c.social;

  return (
    <section id="contact" data-scene="netOpen" className="flex min-h-svh flex-col px-5 pt-28 md:px-12 md:pt-36">
      <p className="label">
        <span className="text-lime">08</span> <span aria-hidden="true">&nbsp;/&nbsp;</span> {t.label}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center" data-lines>
        <h2 className="display text-[length:calc(clamp(3rem,10.6vw,8.5rem)*var(--display-scale))]">
          <span className="mask-line">
            <span>{t.line1}</span>
          </span>
          <span className="mask-line">
            <span className="accent">{t.accent}</span>
          </span>
        </h2>
        <div className="mt-10 md:mt-12" data-reveal>
          {primary ? (
            <Magnetic strength={14}>
              <a href={primary} className="pill pill-solid !min-h-[3.75rem] !px-9 !text-[17px]">
                {t.cta} <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            </Magnetic>
          ) : (
            <p className="label rounded-full border border-champ/50 px-5 py-3 !text-champ">{t.pending}</p>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <dl className="hairline grid grid-cols-2 gap-6 border-t py-7 md:grid-cols-4">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="label">{r.label}</dt>
              <dd className="mt-1.5 break-words font-mono text-[13px]">
                {r.href ? (
                  <a href={r.href} className="transition-colors hover:text-lime" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {r.value}
                  </a>
                ) : (
                  r.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <footer className="hairline label flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t py-5">
        <p>
          wealthharvest © {new Date().getFullYear()} · {t.rights}
        </p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2" role="group" aria-label={nav.language}>
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                <Link href={`/${l}`} hrefLang={l} aria-current={l === lang ? "true" : undefined} className={`inline-flex min-h-11 items-center hover:text-lime ${l === lang ? "text-ivory" : ""}`}>
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </span>
          <a href="#top" className="inline-flex min-h-11 items-center gap-1.5 text-ivory hover:text-lime">
            {t.top} <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </section>
  );
}
