"use client";

import Link from "next/link";
import { useState } from "react";
import GlassTabs from "@/components/GlassTabs";
import { TAGS, formatDate, type PostMeta, type Tag } from "@/lib/post-meta";

/**
 * The journal as a stack of cards: tag, date and read time; the title; the
 * one-line summary; and a way in. Filter chips narrow it to one kind of
 * entry. Each card opens its post; "medium ↗" opens the Medium copy when
 * there is one. The parts of a series share one card that lists them in
 * reading order.
 */

type Item = { kind: "post"; post: PostMeta } | { kind: "series"; name: string; posts: PostMeta[] };

/** One item per standalone post; a series becomes one item where its first part appears. */
function group(posts: PostMeta[]): Item[] {
  const items: Item[] = [];
  const bySeries = new Map<string, PostMeta[]>();
  for (const p of posts) {
    if (!p.series) {
      items.push({ kind: "post", post: p });
      continue;
    }
    const parts = bySeries.get(p.series);
    if (parts) parts.push(p);
    else {
      const fresh = [p];
      bySeries.set(p.series, fresh);
      items.push({ kind: "series", name: p.series, posts: fresh });
    }
  }
  for (const parts of bySeries.values()) parts.sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
  // a filter can leave a single part of a series: show it as an ordinary card
  return items.map((it) => (it.kind === "series" && it.posts.length === 1 ? { kind: "post", post: it.posts[0] } : it));
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
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
      <GlassTabs
        className="mb-7"
        label="Filter entries"
        value={tag}
        onChange={setTag}
        options={(["All", ...used] as const).map((t) => ({ value: t, label: t === "All" ? "All entries" : t }))}
      />

      <ul className="space-y-4">
        {group(shown).map((it) =>
          it.kind === "series" ? (
            <li key={`series-${it.name}`} className="glass rounded-[20px] p-5 sm:p-6">
              <div className="text-[12.5px] text-muted">
                <span className="font-semibold uppercase tracking-[0.8px] text-accent">{it.posts[0].tag}</span>
                <span aria-hidden="true"> · </span>
                {formatDate(it.posts[0].date)}
                <span aria-hidden="true"> · </span>
                {it.posts.length}-part story
              </div>
              <h2 className="mt-3 text-[clamp(1.15rem,1.05rem+0.4vw,1.35rem)] leading-[1.3] text-ink">
                {capitalise(it.name)}
              </h2>
              <ol className="mt-3 border-t border-line">
                {it.posts.map((p) => (
                  <li key={p.slug} className="border-b border-line last:border-b-0">
                    <Link
                      href={`/journal/${p.slug}`}
                      className="group flex items-baseline gap-4 py-3 no-underline"
                    >
                      <span className="tnum w-4 shrink-0 text-[13.5px] text-muted">{p.part}</span>
                      <span className="min-w-0 flex-1 text-[15.5px] leading-[1.45] text-ink group-hover:underline group-hover:underline-offset-[4px]">
                        {p.title}
                      </span>
                      <span className="shrink-0 text-[12.5px] text-muted">{p.readTime} min</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ) : (
            <PostCard key={it.post.slug} p={it.post} medium={medium[it.post.slug]} />
          ),
        )}
      </ul>
    </>
  );
}

function PostCard({ p, medium }: { p: PostMeta; medium?: string }) {
  return (
    <li className="glass glass-hover relative rounded-[20px] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 text-[12.5px] text-muted">
        <span>
          <span className="font-semibold uppercase tracking-[0.8px] text-accent">{p.tag}</span>
          <span aria-hidden="true"> · </span>
          {formatDate(p.date)}
          <span aria-hidden="true"> · </span>
          {p.readTime} min read
        </span>
        {medium && (
          <a
            href={medium}
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
  );
}
