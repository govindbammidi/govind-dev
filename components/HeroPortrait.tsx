"use client";

import { useState } from "react";

/*
 * The portrait in the masthead, with a small switch under it: the cartoon
 * by default, the realistic drawing when it's on. Both sit in the same
 * square and cross-fade, so nothing shifts.
 */
export default function HeroPortrait() {
  const [real, setReal] = useState(false);
  const box = "h-[76px] w-[76px] sm:h-[88px] sm:w-[88px]";
  const layer = "absolute inset-0 h-full w-full bg-white object-cover transition-opacity duration-300 ease-settle";

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className={`relative overflow-hidden rounded-[20px] border border-line ${box}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/me.webp"
          alt="Bammidi Govinda Rao, cartoon portrait"
          width={88}
          height={88}
          aria-hidden={real}
          className={`${layer} ${real ? "opacity-0" : "opacity-100"}`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/me-real.webp"
          alt="Bammidi Govinda Rao, realistic portrait"
          width={88}
          height={88}
          decoding="async"
          aria-hidden={!real}
          className={`${layer} ${real ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={real}
        aria-label="Show realistic portrait"
        title={real ? "Back to the cartoon" : "See what I actually look like"}
        onClick={() => setReal((r) => !r)}
        // off: a filled grey track with a white knob, readable on either theme;
        // on: the accent track with a knob in the page colour
        className={`relative h-[18px] w-8 rounded-full transition-colors duration-200 ${
          real ? "bg-accent" : "bg-[color-mix(in_srgb,var(--color-ink)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-ink)_40%,transparent)]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1/2 size-[14px] -translate-y-1/2 rounded-full shadow-sm transition-[left,background-color] duration-200 ${
            real ? "left-[16px] bg-paper" : "left-[2px] bg-white"
          }`}
        />
      </button>
    </div>
  );
}
