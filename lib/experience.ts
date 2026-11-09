/**
 * Experience length, derived from the start date instead of hardcoded, so the
 * numbers on the site never go stale.
 *
 * Call these inside a component, never at module scope - a module-level value is
 * computed once when the server loads the file and would survive an ISR
 * re-render. Pages using them set `revalidate` so the value refreshes without a
 * deploy.
 */

/** Joined Maahita Technologies - September 2024. */
const START = { year: 2024, month: 9 } as const;

/** Whole months elapsed since the start date. */
function monthsSince(now: Date): number {
  const months =
    (now.getUTCFullYear() - START.year) * 12 +
    (now.getUTCMonth() + 1 - START.month);
  return Math.max(0, months);
}

/**
 * Decimal years, to one place. This is a true decimal, not the month count
 * after a dot: 19 months is 1.6 (7/12 = 0.58), not 1.7. Rounded to the nearest
 * tenth, so it moves every month or two.
 */
function years(now: Date): number {
  return Math.round((monthsSince(now) / 12) * 10) / 10;
}

/** "1.6", "2" - a whole number drops the pointless ".0". */
function trim(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}

/** Compact form for the stat chips: "1.6 yrs". */
export function experienceShort(now: Date = new Date()): string {
  const value = years(now);
  return `${trim(value)} ${value === 1 ? "yr" : "yrs"}`;
}

/** Prose form for body copy: "1.6 years". */
export function experienceLong(now: Date = new Date()): string {
  const value = years(now);
  return `${trim(value)} ${value === 1 ? "year" : "years"}`;
}
