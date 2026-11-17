"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/fieldStore";

/**
 * Page-wide scroll reveals. Mounted once. One IntersectionObserver and CSS
 * transitions, so no animation library runs for these.
 *   [data-reveal]  fades and rises when it enters the viewport.
 *   [data-lines]   releases the masked display lines inside it.
 * Elements that enter together are staggered 80ms apart. Hidden states and
 * transitions live in globals.css under html.motion.
 */
export default function Motion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const delay = i++ * 80;
          el.style.setProperty("--d", `${delay}ms`);
          el.classList.add("in");
          if (el.hasAttribute("data-reveal")) {
            // Hand the element back to its own styles once it has arrived, so hover transitions work.
            window.setTimeout(() => {
              el.removeAttribute("data-reveal");
              el.classList.remove("in");
              el.style.removeProperty("--d");
            }, delay + 1000);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    document.querySelectorAll("[data-reveal], [data-lines]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
