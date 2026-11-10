/** Pure post metadata types & helpers - safe to import from client components. */

export const TAGS = ["Engineering", "Interviews", "Product", "Production", "Startup", "Personal"] as const;
export type Tag = (typeof TAGS)[number];

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO yyyy-mm-dd
  tag: Tag;
  arc?: string;
  readTime: number; // minutes
  featured: boolean;
  /** posts sharing a series name render as one connected story, ordered by part */
  series?: string;
  part?: number;
  seriesTotal?: number; // derived, not frontmatter
  medium?: string; // the Medium copy, pinned so it outlives the feed
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** yyyy-mm - the grouping key for a post's month. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** "August 2026" - the heading for a month of entries. */
export function formatMonth(iso: string): string {
  return new Date(`${monthKey(iso)}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Aug" - the month as it appears in the jump index. */
export function formatMonthShort(iso: string): string {
  return new Date(`${monthKey(iso)}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}

/** "Aug 22" - the year is redundant under a month heading, so it's dropped. */
export function formatDayMonth(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}
