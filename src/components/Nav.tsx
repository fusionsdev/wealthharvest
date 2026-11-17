"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dict } from "@/i18n";
import { locales, type Locale } from "@/site.config";

const ids = ["capabilities", "process", "systems", "ventures", "about"] as const;

export default function Nav({ t, lang }: { t: Dict["nav"]; lang: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Solid bar after the first screen; slides away on scroll down, returns on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 400);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section that crosses the middle of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock page scroll, close on Escape, keep focus inside, restore focus on close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const items = [toggle.current!, ...focusable()];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const button = toggle.current;
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const langSwitch = (
    <div className="label flex items-center gap-2" role="group" aria-label={t.language}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true">/</span>}
          <Link
            href={`/${l}`}
            hrefLang={l}
            aria-current={l === lang ? "true" : undefined}
            className={`inline-flex min-h-11 items-center transition-colors hover:text-lime ${l === lang ? "text-ivory" : ""}`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 ease-expo ${
          hidden && !open ? "-translate-y-full" : ""
        } ${scrolled && !open ? "bg-ink/80 backdrop-blur-md" : ""}`}
      >
        <nav aria-label="Primary" className="flex h-16 items-center justify-between px-5 md:h-20 md:px-12">
          <a href="#top" className="flex min-h-11 items-center gap-2.5 text-[15px] font-medium tracking-tight">
            <span className="h-2.5 w-2.5 rounded-full bg-lime" aria-hidden="true" />
            wealthharvest
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {ids.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`group relative py-2 text-[13px] transition-colors hover:text-ivory ${active === id ? "text-ivory" : "text-sage"}`}
                >
                  {t[id]}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-lime transition-transform duration-500 ease-expo group-hover:scale-x-100 ${
                      active === id ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <div className="hidden lg:block">{langSwitch}</div>
            <a href="#contact" className="pill pill-ghost hidden !min-h-10 !px-4 text-[13px] sm:inline-flex">
              {t.cta} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <button
              ref={toggle}
              type="button"
              className="label -mr-2 min-h-11 px-2 !text-ivory lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? t.close : t.menu}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-forest px-5 pb-8 pt-24 transition-[clip-path,visibility] duration-700 ease-expo lg:hidden ${
          open ? "visible [clip-path:inset(0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="flex-1">
          {ids.map((id, i) => (
            <li key={id} className="hairline border-t">
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                className={`display flex items-baseline justify-between py-4 text-[2.6rem] transition-[opacity,transform] duration-700 ease-expo ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                {t[id]}
                <span className="label">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          {langSwitch}
          <a href="#contact" onClick={() => setOpen(false)} className="pill pill-solid">
            {t.cta}
          </a>
        </div>
      </div>
    </>
  );
}
