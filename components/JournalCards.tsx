"use client";

import Link from "next/link";
import { useState } from "react";
import { TAGS, formatDate, type PostMeta, type Tag } from "@/lib/post-meta";

/**
 * The journal as a stack of cards: tag, date and read time; the title; the
 * one-line summary; and a way in. Filter chips narrow it to one kind of
 * entry. Each card opens its post; "medium ↗" opens the Medium copy when
 * there is one.
 */
export default function JournalCards({
  posts,
  medium,
}: {
  posts: PostMeta[];
  /** slug -> its Medium copy, for posts that have one */
  medium: Record<string, string>;
}) {
  const [tag, setTag] = useState<Tag | "All">("All");
  const used = TAGS.filter((t) => posts.some((p) => p.tag === t));
  const shown = tag === "All" ? posts : posts.filter((p) => p.tag === tag);

  return (
    <>
      <div className="mb-7 flex flex-wrap gap-2" role="tablist" aria-label="Filter entries">
        {(["All", ...used] as const).map((t) => {
          const on = t === tag;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTag(t)}
              className={`rounded-full px-[14px] py-[6px] text-[13.5px] transition-colors ${
                on ? "bg-accent font-semibold text-paper" : "glass-chip text-muted hover:text-ink"
              }`}
            >
              {t === "All" ? "All entries" : t}
            </button>
          );
        })}
      </div>

      <ul className="space-y-4">
        {shown.map((p) => (
          <li key={p.slug} className="glass glass-hover relative rounded-[20px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 text-[12.5px] text-muted">
              <span>
                <span className="font-semibold uppercase tracking-[0.8px] text-accent">{p.tag}</span>
                <span aria-hidden="true"> · </span>
                {formatDate(p.date)}
                <span aria-hidden="true"> · </span>
                {p.readTime} min read
              </span>
              {medium[p.slug] && (
                <a
                  href={medium[p.slug]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 shrink-0 text-muted no-underline hover:text-ink"
                >
                  medium ↗
                </a>
              )}
            </div>
            <h2 className="mt-3 text-[clamp(1.15rem,1.05rem+0.4vw,1.35rem)] leading-[1.3]">
              {/* the whole card opens the post: this link stretches over it */}
              <Link
                href={`/journal/${p.slug}`}
                className="text-ink no-underline after:absolute after:inset-0 after:rounded-[20px] after:content-['']"
              >
                {p.title}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-2 text-[15.5px] italic leading-[1.6] text-muted">{p.summary}</p>
            <div className="mt-4 flex items-center justify-between text-[13.5px]">
              <span className="font-semibold text-ink">Read article →</span>
              {p.part != null && p.seriesTotal != null && (
                <span className="text-muted">
                  Part {p.part} of {p.seriesTotal}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
