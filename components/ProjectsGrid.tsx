"use client";

import Link from "next/link";
import { useState } from "react";
import type { ArchiveItem, Category } from "@/lib/archive";

const TONE = {
  live: "text-[#16a34a] dark:text-[#4ade80]",
  pilot: "text-[#d97706] dark:text-[#fbbf24]",
  proto: "text-[#2563eb] dark:text-[#60a5fa]",
} as const;

/**
 * The project archive: filter chips over a two-column grid of cards. Each
 * card is a cover (a screenshot when there is one, otherwise the name set
 * large on glass), then name, status, a two-line blurb and the stack. The
 * whole card opens the project's page; the globe opens the live app.
 */
export default function ProjectsGrid({
  items,
  categories = [],
  filters = true,
}: {
  items: ArchiveItem[];
  categories?: readonly Category[];
  /** the home page shows a few highlights, without the filter chips */
  filters?: boolean;
}) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? items : items.filter((p) => p.category === filter);

  return (
    <>
      {filters && (
      <div className="mb-7 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {(["All", ...categories] as const).map((c) => {
          const on = c === filter;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(c)}
              className={`rounded-full px-[14px] py-[6px] text-[13.5px] transition-colors ${
                on ? "bg-accent font-semibold text-paper" : "glass-chip text-muted hover:text-ink"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2">
        {shown.map((p) => (
          <li key={p.key} className="glass glass-hover relative flex flex-col rounded-[22px] p-3">
            <Cover item={p} />
            <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="min-w-0 text-[17px] leading-[1.3]">
                  {/* the whole card opens the project page: this link stretches over it */}
                  <Link
                    href={`/projects/${p.key}`}
                    className="text-ink no-underline after:absolute after:inset-0 after:rounded-[22px] after:content-['']"
                  >
                    {p.name}
                  </Link>{" "}
                  <span className="text-[13px] font-normal tracking-normal text-muted">{p.area}</span>
                </h2>
                <span className={`flex shrink-0 items-center gap-[6px] text-[12.5px] font-semibold ${TONE[p.status.tone]}`}>
                  <span className="h-[6px] w-[6px] rounded-full bg-current" aria-hidden="true" />
                  {p.status.label}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-body">{p.blurb}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                <div className="flex min-w-0 flex-wrap gap-[6px]">
                  {p.stack.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-line px-[7px] py-[2px] text-[12px] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="relative z-10 flex shrink-0 items-center gap-1">
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name}: open the live app`}
                      title="Live app"
                      className="grid h-8 w-8 place-items-center rounded-full text-muted no-underline hover:bg-paper-2 hover:text-ink"
                    >
                      <Globe />
                    </a>
                  )}
                  <Link
                    href={`/projects/${p.key}`}
                    aria-label={`${p.name}: details`}
                    title="Details"
                    className="grid h-8 w-8 place-items-center rounded-full text-muted no-underline hover:bg-paper-2 hover:text-ink"
                  >
                    <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Cover({ item }: { item: ArchiveItem }) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.image}
        alt={`${item.name} screenshot`}
        loading="lazy"
        className="aspect-[16/10] w-full rounded-[14px] border border-line object-cover object-top"
      />
    );
  }
  // no screenshot yet: the name, set large on a quiet panel
  return (
    <div className="grid aspect-[16/10] w-full place-items-center rounded-[14px] border border-line bg-paper-2 p-6 text-center">
      <span className="font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
        {item.name}
      </span>
    </div>
  );
}

function Globe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}
