"use client";

import { useRef } from "react";

/**
 * Horizontal shelf. Touch and trackpad scroll it natively, a mouse can drag
 * it, and arrow keys scroll it when it has focus.
 */
export default function DragScroll({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  return (
    <ul
      ref={ref}
      role="list"
      tabIndex={0}
      aria-label={label}
      className="no-scrollbar flex cursor-grab snap-x gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 active:cursor-grabbing md:scroll-px-12 md:px-12"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") return;
        drag.current = { active: true, startX: e.clientX, startScroll: ref.current!.scrollLeft, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.active) return;
        const dx = e.clientX - d.startX;
        if (Math.abs(dx) > 4 && !d.moved) {
          d.moved = true;
          // Snap fights a live drag, so it is off until release.
          ref.current!.style.scrollSnapType = "none";
          ref.current!.setPointerCapture(e.pointerId);
        }
        if (d.moved) ref.current!.scrollLeft = d.startScroll - dx;
      }}
      onPointerUp={() => {
        drag.current.active = false;
        ref.current!.style.scrollSnapType = "";
      }}
      onPointerCancel={() => {
        drag.current.active = false;
        ref.current!.style.scrollSnapType = "";
      }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        ref.current!.scrollBy({ left: e.key === "ArrowRight" ? 320 : -320, behavior: "smooth" });
      }}
    >
      {children}
    </ul>
  );
}
