import { getContributions } from "@/lib/github";
import { site } from "@/lib/site";

/*
 * The last year of GitHub contributions, drawn as the familiar green grid.
 * Rendered on the server and refreshed daily, no client JavaScript. Where the
 * numbers come from, and the fallbacks, are in lib/github.ts.
 */

const CELL = 10; // 53 weeks of 10px + 3px gaps fit the 704px column without scrolling
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 18; // room for the month labels

const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default async function GitHubActivity() {
  // never empty: falls back to the saved snapshot if GitHub can't be reached
  const feed = await getContributions();

  // Columns are weeks starting on Sunday, as on github.com: pad the first
  // week so each day lands on its weekday row
  const days = feed.days;
  const lead = new Date(`${days[0].date}T00:00:00`).getDay();
  const weeks = Math.ceil((lead + days.length) / 7);
  const width = weeks * STEP - GAP;
  const height = TOP + 7 * STEP - GAP;

  // A month label over the first week that starts in that month
  const months: { x: number; label: string }[] = [];
  let lastMonth = -1;
  days.forEach((d, i) => {
    const slot = lead + i;
    if (slot % 7 !== 0) return;
    const m = new Date(`${d.date}T00:00:00`).getMonth();
    if (m === lastMonth) return;
    lastMonth = m;
    const x = Math.floor(slot / 7) * STEP;
    // skip a label that would collide with the previous one
    if (months.length && x - months[months.length - 1].x < 3 * STEP) return;
    months.push({
      x,
      label: new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", { month: "short" }),
    });
  });

  const first = days[0].date.slice(0, 4);
  const last = days[days.length - 1].date.slice(0, 4);
  const range = first === last ? first : `${first}-${last.slice(2)}`;

  return (
    <div>
      {/* rtl on the scroller opens a too-wide graph at its right end, on the
          most recent weeks; the graph itself reads left to right */}
      <div className="gh-scroll overflow-x-auto pb-1" dir="rtl">
        <div dir="ltr" className="w-max">
        <svg
          className="gh-graph block"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${feed.total} GitHub contributions in the last year`}
        >
          {months.map((m) => (
            <text key={m.x} x={m.x} y={10} className="gh-month">
              {m.label}
            </text>
          ))}
          {days.map((d, i) => {
            const slot = lead + i;
            return (
              <rect
                key={d.date}
                x={Math.floor(slot / 7) * STEP}
                y={TOP + (slot % 7) * STEP}
                width={CELL}
                height={CELL}
                rx={2.5}
                className={`gh-cell gh-l${d.level}`}
              >
                <title>
                  {`${d.count === 0 ? "No" : d.count} contribution${d.count === 1 ? "" : "s"} on ${dayLabel(d.date)}`}
                </title>
              </rect>
            );
          })}
        </svg>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-muted">
        <a href={site.github} className="no-underline hover:text-accent">
          {feed.total.toLocaleString("en-US")} contributions in {range}
        </a>
        <span className="flex items-center gap-[5px]" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width={CELL} height={CELL} className="block">
              <rect width={CELL} height={CELL} rx={2.5} className={`gh-cell gh-l${l}`} />
            </svg>
          ))}
          More
        </span>
      </div>
    </div>
  );
}
