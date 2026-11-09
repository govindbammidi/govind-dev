"use client";

import { useEffect, useRef } from "react";
import { markMoving, useLiquidLens } from "@/lib/liquidLens";

/*
 * A filter row in the nav's material: one capsule of liquid glass, the
 * chosen option in a pill that slides between them (the island's
 * `.nav-thumb`). On a phone the row scrolls sideways inside the capsule
 * rather than wrapping, and the chosen option is brought into view.
 * Used by the journal and the project archive.
 */
export default function GlassTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** what the row filters, for screen readers */
  label: string;
  className?: string;
}) {
  // the same bending rim as the nav island (Chromium; elsewhere the CSS frost)
  const barRef = useRef<HTMLDivElement>(null);
  useLiquidLens(barRef, { bezel: 14, shift: 12, aberration: 3 });

  // the thumb is placed by measuring the chosen button, as in the nav, so a
  // font swap or a resize just re-measures
  const rowRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  // while it slides the pill is a clear lens that bends the labels it
  // passes over (Chromium; elsewhere it is just clear glass)
  useLiquidLens(thumbRef, { bezel: 12, shift: 9, aberration: 4, cssVar: "--thumb-lens" });
  useEffect(() => {
    const row = rowRef.current;
    const thumb = thumbRef.current;
    if (!row || !thumb) return;
    const chosen = () => row.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`);
    const place = () => {
      // scroll (and so clip) only when the options don't fit: a scroller
      // cuts off the pill's shadow, so where they fit nothing is clipped
      row.toggleAttribute("data-scroll", row.scrollWidth > row.clientWidth + 1);
      const el = chosen();
      if (!el) return;
      const left = `${el.offsetLeft}px`;
      if (thumb.hasAttribute("data-on") && thumb.style.left !== left) markMoving(thumb);
      thumb.style.left = left;
      thumb.style.width = `${el.offsetWidth}px`;
      thumb.setAttribute("data-on", "");
    };
    place();
    const el = chosen();
    if (el && row.scrollWidth > row.clientWidth) {
      const still = !placed.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollTo({
        left: el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2,
        behavior: still ? "auto" : "smooth",
      });
    }
    placed.current = true;
    const ro = new ResizeObserver(place);
    ro.observe(row);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div ref={barRef} className={`lg-bar ${className}`}>
      <div
        ref={rowRef}
        role="tablist"
        aria-label={label}
        // the padding lives on the row, not the capsule, so when it scrolls
        // the pill keeps room for its shadow inside the clipped edge
        // the gaps and padding leave room for the pill, which rests larger
        // than its button
        className="lg-scroll relative flex items-center gap-[8px] rounded-full px-[8px] py-[6px]"
      >
        <span ref={thumbRef} aria-hidden="true" className="nav-thumb top-[6px] bottom-[6px]" />
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="tab"
              aria-selected={on}
              data-value={o.value}
              onClick={() => onChange(o.value)}
              className={`nav-link shrink-0 whitespace-nowrap rounded-full px-[13px] py-[6px] text-[13.5px] transition-colors hover:text-accent ${
                on ? "font-medium text-accent" : "text-muted"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
