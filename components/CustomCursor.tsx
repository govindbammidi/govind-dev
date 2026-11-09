"use client";

import { useEffect, useRef } from "react";

/**
 * A custom cursor: an arrow in the page's ink colour - white on the dark
 * theme, black on the light one - that dips slightly while the button is held.
 *
 * Only for a real mouse or trackpad (fine pointer that can hover) - phones
 * and tablets keep their own behaviour. Text fields get the normal text
 * cursor back. Position is written straight to the element's transform once
 * per animation frame, never through React state, so it costs nothing.
 */
export default function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const arrow = arrowRef.current;
    if (!arrow) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = 0;
    let y = 0;
    let raf = 0;
    let shown = false;

    const show = (on: boolean) => {
      if (on === shown) return;
      shown = on;
      root.classList.toggle("cursor-on", on);
    };
    const frame = () => {
      raf = 0;
      arrow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      x = e.clientX;
      y = e.clientY;
      // over a text field, hand back the real text cursor
      const t = e.target as Element | null;
      show(!t?.closest?.("input, textarea, select, [contenteditable='true']"));
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => show(false);
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-on", "cursor-down");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    // its own view-transition layer: a page change or theme switch otherwise
    // freezes the arrow inside the page snapshot, and with the real cursor
    // hidden there is no pointer at all until the transition ends
    <div ref={arrowRef} className="cursor-arrow" aria-hidden="true" style={{ viewTransitionName: "cursor" }}>
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M3.5 2.5 L19.5 11.2 L12.3 13 L9 20.5 Z" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
