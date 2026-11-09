import Link from "next/link";
import { formatDate, formatDayMonth, type PostMeta } from "@/lib/post-meta";

/** Marks the searched run inside a title - a rust underline, never a highlighter. */
function Marked({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const at = text.toLowerCase().indexOf(query);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent text-accent underline decoration-accent/40 decoration-1 underline-offset-[3px]">
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </>
  );
}

export default function EntryRow({
  post,
  last = false,
  compact = false,
  query = "",
}: {
  post: PostMeta;
  last?: boolean;
  /** one ruled line per entry, the way a printed index sets them */
  compact?: boolean;
  /** lowercased search term, underlined where it appears in the title */
  query?: string;
}) {
  /* the rust rule and the sideways shift are shared by both densities, so a
     row feels like the same object whichever way it's set */
  const rule = (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-1/2 w-[3px] -translate-y-1/2 scale-y-0 bg-accent transition-transform duration-300 ease-settle group-hover:scale-y-100 ${
        compact ? "h-[19px]" : "h-9"
      }`}
    />
  );

  if (compact) {
    return (
      <Link
        href={`/journal/${post.slug}`}
        className={`group relative block py-[10px] no-underline ${
          last ? "" : "border-b border-line/55"
        }`}
      >
        {rule}
        <div className="flex items-baseline gap-[14px] transition-transform duration-300 ease-settle group-hover:translate-x-[10px]">
          <span className="tnum w-[52px] shrink-0 font-mono text-[11.5px] text-muted">
            {formatDayMonth(post.date)}
          </span>
          <h3 className="font-display text-[19px] font-medium leading-[1.3] tracking-[-0.2px] text-ink transition-colors group-hover:text-accent">
            <Marked text={post.title} query={query} />
          </h3>
          {post.part != null && (
            <span className="shrink-0 font-mono text-[10.5px] text-accent-soft">
              pt {post.part}
            </span>
          )}
          {/* the leader carries the eye across to the folio, as on a contents page */}
          <span className="leader hidden sm:block" aria-hidden="true" />
          <span className="tnum hidden shrink-0 font-mono text-[11px] text-muted/80 sm:block">
            {post.readTime} min
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/journal/${post.slug}`}
      className={`group relative block py-[26px] no-underline ${
        last ? "" : "border-b border-line"
      }`}
    >
      {rule}
      {/* content shifts via transform (compositor), not padding (layout reflow) */}
      <div className="transition-transform duration-300 ease-settle group-hover:translate-x-[14px]">
        <div className="mb-[10px] flex items-center gap-[14px] font-mono text-[12px] text-muted">
          <span className="uppercase tracking-[0.5px] text-accent">
            {post.tag}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime} min</span>
          {post.part != null && post.seriesTotal != null && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-accent-soft">
                part {post.part} of {post.seriesTotal}
              </span>
            </>
          )}
        </div>
        <h3 className="mb-2 font-display text-[27px] font-medium leading-[1.2] tracking-[-0.5px] text-ink transition-colors group-hover:text-accent">
          <Marked text={post.title} query={query} />
        </h3>
        <p className="max-w-[580px] text-[18px] text-muted">{post.summary}</p>
        {post.arc && (
          <div className="mt-3 font-mono text-[11px] tracking-[0.5px] text-accent-soft">
            arc: {post.arc}
          </div>
        )}
      </div>
    </Link>
  );
}
