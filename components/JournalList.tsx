"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import EntryRow from "@/components/EntryRow";
import {
  TAGS,
  formatMonth,
  formatMonthShort,
  monthKey,
  type PostMeta,
  type Tag,
} from "@/lib/post-meta";

type Filter = "all" | Tag;
type Density = "full" | "compact";

/** Consecutive posts sharing a series collapse into one connected segment. */
function segments(posts: PostMeta[]): { series?: string; posts: PostMeta[] }[] {
  const segs: { series?: string; posts: PostMeta[] }[] = [];
  for (const p of posts) {
    const tail = segs[segs.length - 1];
    if (p.series && tail?.series === p.series) tail.posts.push(p);
    else segs.push({ series: p.series, posts: [p] });
  }
  return segs;
}

/** Posts arrive newest-first, so the entries of one month are already adjacent. */
function months(posts: PostMeta[]) {
  const out: {
    key: string;
    label: string;
    short: string;
    posts: PostMeta[];
  }[] = [];
  for (const p of posts) {
    const key = monthKey(p.date);
    const tail = out[out.length - 1];
    if (tail?.key === key) tail.posts.push(p);
    else
      out.push({
        key,
        label: formatMonth(p.date),
        short: formatMonthShort(p.date),
        posts: [p],
      });
  }
  return out;
}

/** Searches what the row actually shows - title, summary, arc and tag. */
function matches(post: PostMeta, q: string): boolean {
  if (!q) return true;
  return (
    post.title.toLowerCase().includes(q) ||
    post.summary.toLowerCase().includes(q) ||
    post.tag.toLowerCase().includes(q) ||
    (post.arc?.toLowerCase().includes(q) ?? false)
  );
}

export default function JournalList({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState<Density>("full");
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const visible = useMemo(
    () =>
      posts.filter(
        (p) => (filter === "all" || p.tag === filter) && matches(p, q),
      ),
    [posts, filter, q],
  );

  /* counts are faceted against the search but not the tag filter, so the pills
     show you where the hits are while you type */
  const counts = useMemo(() => {
    const map = { all: 0 } as Record<Filter, number>;
    for (const t of TAGS) map[t] = 0;
    for (const p of posts) {
      if (!matches(p, q)) continue;
      map.all += 1;
      map[p.tag] += 1;
    }
    return map;
  }, [posts, q]);

  const groups = useMemo(() => months(visible), [visible]);
  const lastSlug = visible[visible.length - 1]?.slug;
  const filters: Filter[] = ["all", ...TAGS];

  /* "/" jumps to the search field, the way it does in a reader */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (
        el?.tagName === "INPUT" ||
        el?.tagName === "TEXTAREA" ||
        el?.isContentEditable
      )
        return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* front matter - the search line, the tags, then the month index, set
          like the opening pages of a printed volume */}
      <div className="border-b border-line pt-[26px]">
        {/* a ruled line to write on, rather than a boxed widget */}
        <div className="group/search">
          <div className="flex items-center gap-[11px] pb-[12px]">
            <label htmlFor="journal-search" className="sr-only">
              Search entries
            </label>
            {/* drawn rather than typed - the glass glyphs have no reliable
                mono coverage, and this one inherits the rust exactly */}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-[13px] w-[13px] shrink-0 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <circle cx="6.75" cy="6.75" r="4.25" />
              <path d="M10 10l3.5 3.5" />
            </svg>
            <input
              id="journal-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
              placeholder={`Search ${posts.length} entries…`}
              className="w-full bg-transparent font-mono text-[13px] text-ink caret-accent outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searching ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className="shrink-0 font-mono text-[11px] text-muted transition-colors hover:text-accent"
              >
                clear
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="glass-chip shrink-0 rounded-[6px] px-[6px] py-[2px] font-mono text-[10.5px] text-muted/80"
              >
                /
              </kbd>
            )}
          </div>
          {/* the rule inks over when the field takes focus */}
          <span
            aria-hidden="true"
            className="block h-px bg-line transition-colors duration-300 ease-settle group-focus-within/search:bg-accent"
          />
        </div>

        <div
          className="flex flex-wrap gap-[10px] py-[22px] font-mono text-[12.5px]"
          role="group"
          aria-label="Filter posts by tag"
        >
          {filters.map((f) => {
            const active = filter === f;
            const empty = counts[f] === 0;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                disabled={empty && !active}
                onClick={() => setFilter(f)}
                className={`inline-flex items-center gap-[9px] rounded-full border px-[14px] py-[7px] transition-colors active:translate-y-[1px] ${
                  active
                    ? "glass-btn border-transparent"
                    : empty
                      ? "cursor-not-allowed border-line/60 bg-transparent text-muted/40"
                      : "glass-chip text-tag hover:text-accent"
                }`}
              >
                <span>{f === "all" ? "All" : f}</span>
                <span
                  aria-hidden="true"
                  className="h-[11px] w-px bg-current opacity-25"
                />
                <span
                  className={`text-[11px] leading-none tabular-nums ${
                    active ? "text-paper" : "text-muted"
                  }`}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pb-[20px] font-mono text-[11.5px]">
          {!searching && groups.length > 1 ? (
            <nav
              aria-label="Jump to month"
              className="flex flex-wrap items-center gap-[11px] text-muted"
            >
              <span className="uppercase tracking-[0.5px] text-muted/70">
                jump
              </span>
              {groups.map((g) => (
                <a
                  key={g.key}
                  href={`#${g.key}`}
                  className="text-muted no-underline transition-colors hover:text-accent"
                >
                  {g.short}{" "}
                  <span className="tnum text-muted/55">{g.posts.length}</span>
                </a>
              ))}
            </nav>
          ) : (
            <p className="text-muted">
              <span className="tnum text-ink">{visible.length}</span> of{" "}
              <span className="tnum">{posts.length}</span> entries
            </p>
          )}

          <div
            role="group"
            aria-label="Row density"
            className="flex items-center gap-[3px]"
          >
            {(["full", "compact"] as Density[]).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={density === d}
                onClick={() => setDensity(d)}
                className={`rounded-[2px] px-[9px] py-[4px] transition-colors ${
                  density === d
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-accent"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} of {posts.length} entries shown
      </p>

      {/* key remount makes the list settle back in when the shape changes */}
      <div
        key={`${filter}-${density}`}
        className="rise pb-10 [animation-duration:0.45s]"
      >
        {groups.map((g) => (
          <section key={g.key} aria-labelledby={`h-${g.key}`}>
            {/* while searching, chronology stops being the organising idea */}
            {!searching && (
              <div
                id={g.key}
                className="flex scroll-mt-[78px] items-baseline gap-[14px] pb-[2px] pt-[30px]"
              >
                <h2
                  id={`h-${g.key}`}
                  className="font-mono text-[11.5px] uppercase tracking-[1.2px] text-muted"
                >
                  {g.label}
                </h2>
                <span className="leader" aria-hidden="true" />
                <span className="tnum font-mono text-[11.5px] text-muted/70">
                  {g.posts.length}
                </span>
              </div>
            )}

            {segments(g.posts).map((seg) =>
              seg.series && seg.posts.length > 1 ? (
                <section
                  key={`series-${seg.series}`}
                  aria-label={`${seg.series} - a ${seg.posts.length}-part story`}
                >
                  <div className="flex items-center gap-[10px] pt-[26px] font-mono text-[11.5px] uppercase tracking-[0.5px] text-accent-soft">
                    <span
                      aria-hidden="true"
                      className="h-px w-[26px] bg-accent-soft/60"
                    />
                    a {seg.posts.length}-part story · {seg.series}
                  </div>
                  {/* the rail ties the parts together as one thread */}
                  <div className="border-l-2 border-accent/20 pl-[16px] sm:pl-[22px]">
                    {seg.posts.map((post) => (
                      <EntryRow
                        key={post.slug}
                        post={post}
                        last={post.slug === lastSlug}
                        compact={density === "compact"}
                        query={q}
                      />
                    ))}
                  </div>
                </section>
              ) : (
                seg.posts.map((post) => (
                  <EntryRow
                    key={post.slug}
                    post={post}
                    last={post.slug === lastSlug}
                    compact={density === "compact"}
                    query={q}
                  />
                ))
              ),
            )}
          </section>
        ))}

        {visible.length === 0 && (
          <div className="py-[36px]">
            <p className="text-[18px] text-muted">
              {searching ? (
                <>
                  Nothing matches{" "}
                  <span className="font-mono text-[16px] text-ink">
                    &ldquo;{query.trim()}&rdquo;
                  </span>
                  {filter !== "all" && <> in {filter}</>}.
                </>
              ) : (
                "Nothing here yet. Soon."
              )}
            </p>
            {searching && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  searchRef.current?.focus();
                }}
                className="mt-3 font-mono text-[12px] text-accent underline decoration-accent/30 underline-offset-[4px] transition-colors hover:decoration-accent"
              >
                clear search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
