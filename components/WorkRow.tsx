import Link from "next/link";
import type { WorkRow as WorkRowData } from "@/lib/projects";

/** One ruled line of the homepage work list: what it is, one sentence, the
 *  stack, and where to see it. Compact on purpose - the page has to read in
 *  the time a recruiter gives it. */
export default function WorkRow({
  row,
  last = false,
}: {
  row: WorkRowData;
  last?: boolean;
}) {
  const link =
    "border-b border-transparent text-accent no-underline transition-colors hover:border-accent";

  return (
    <article className={`py-[22px] ${last ? "" : "border-b border-line"}`}>
      <div className="mb-[6px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-[22px] font-medium leading-[1.25] tracking-[-0.4px] text-ink">
          {row.href ? (
            <Link
              href={row.href}
              className="no-underline transition-colors hover:text-accent"
            >
              {row.title}
            </Link>
          ) : (
            row.title
          )}
        </h3>
        <span className="font-mono text-[11.5px] uppercase tracking-[1px] text-muted">
          {row.kicker}
        </span>
      </div>
      <p className="mb-[10px] max-w-[620px] text-[17.5px] text-lede">
        {row.short}
      </p>
      {/* stack and links on separate lines, so every row has the same shape
          however long the stack runs */}
      <p className="mb-[6px] font-mono text-[12.5px] text-muted">
        {row.stack.join(" · ")}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-[18px] gap-y-1 font-mono text-[12.5px]">
        {row.links.map((l) =>
          /^https?:/.test(l.href) ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              {l.label} →
            </a>
          ) : (
            <Link key={l.href} href={l.href} className={link}>
              {l.label} →
            </Link>
          ),
        )}
      </div>
    </article>
  );
}
