import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Field from "@/components/Field";
import Hero from "@/components/Hero";
import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Philosophy from "@/components/Philosophy";
import Process from "@/components/Process";
import Systems from "@/components/Systems";
import Ventures from "@/components/Ventures";
import { getDict } from "@/i18n";
import type { Locale } from "@/site.config";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDict(lang as Locale);

  return (
    <>
      <a href="#main" className="pill pill-solid fixed left-4 top-4 z-[100] -translate-y-24 focus:translate-y-0">
        {t.nav.skip}
      </a>
      <Field />
      <Nav t={t.nav} lang={lang as Locale} />
      <main id="main" className="relative z-10">
        {/* The hero stays pinned while the philosophy panel slides over it. */}
        <div>
          <Hero t={t.hero} />
          <Philosophy t={t.philosophy} />
        </div>
        <Capabilities t={t.capabilities} />
        <Process t={t.process} />
        <Systems t={t.systems} />
        <Ventures t={t.ventures} />
        <About t={t.about} />
        <Contact t={t.contact} nav={t.nav} lang={lang as Locale} />
      </main>
      <Motion />
      <Cursor />
    </>
  );
}
