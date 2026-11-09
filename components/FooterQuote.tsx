"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "@/lib/quotes";

/**
 * A quote from my notes, a different one each visit. The page is rendered
 * ahead of time with the first quote; the visitor's own pick swaps in once it
 * loads. Tapping the quote shows the next one.
 */
export default function FooterQuote() {
  const [i, setI] = useState(0);

  useEffect(() => {
    // a fresh pick per visit (kept out of the server render, which is cached)
    const t = setTimeout(() => setI(Math.floor(Math.random() * QUOTES.length)), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <figure className="mx-auto mb-9 max-w-[560px]">
      <button
        type="button"
        onClick={() => setI((n) => (n + 1) % QUOTES.length)}
        title="Another one"
        className="group block w-full text-center"
      >
        <span aria-hidden="true" className="block font-display text-[34px] leading-none text-mark">
          &ldquo;
        </span>
        {/* a span, not a blockquote: a button may only hold inline content */}
        <span
          key={i}
          aria-live="polite"
          className="quote-in mt-1 block text-[17px] leading-[1.6] text-ink"
        >
          {QUOTES[i]}
        </span>
      </button>
      <figcaption className="mt-3 text-[11.5px] uppercase tracking-[1.4px] text-muted">
        from my notes
      </figcaption>
    </figure>
  );
}
