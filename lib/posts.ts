import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { TAGS, type PostMeta, type Tag } from "@/lib/post-meta";

export { TAGS, formatDate, type PostMeta, type Tag } from "@/lib/post-meta";

export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 200;

function computeReadTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function isTag(value: unknown): value is Tag {
  return typeof value === "string" && (TAGS as readonly string[]).includes(value);
}

function parsePost(filename: string): Post | null {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  if (data.draft === true) return null;
  if (!isTag(data.tag)) {
    throw new Error(
      `Post "${filename}" has invalid tag "${data.tag}". Use one of: ${TAGS.join(", ")}`,
    );
  }

  return {
    slug,
    title: String(data.title),
    summary: String(data.summary),
    date: String(data.date),
    tag: data.tag,
    arc: typeof data.arc === "string" ? data.arc : undefined,
    readTime:
      typeof data.readTime === "number" ? data.readTime : computeReadTime(content),
    featured: data.featured === true,
    series: typeof data.series === "string" ? data.series : undefined,
    part: typeof data.part === "number" ? data.part : undefined,
    medium: typeof data.medium === "string" ? data.medium : undefined,
    content,
  };
}

/** Newest first; within a day, standalone posts first, then series in part order. */
function comparePosts(a: Post, b: Post): number {
  const byDate = b.date.localeCompare(a.date);
  if (byDate) return byDate;
  const sa = a.series ?? "";
  const sb = b.series ?? "";
  if (sa !== sb) return sa.localeCompare(sb);
  if (sa) return (a.part ?? 0) - (b.part ?? 0);
  return a.title.localeCompare(b.title);
}

/** All published posts, featured first, then newest first (series kept in part order). */
export function getAllPosts(): Post[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f));

  const posts = files.map(parsePost).filter((p): p is Post => p !== null);

  const seriesCounts = new Map<string, number>();
  for (const p of posts) {
    if (p.series) seriesCounts.set(p.series, (seriesCounts.get(p.series) ?? 0) + 1);
  }
  for (const p of posts) {
    if (p.series) p.seriesTotal = seriesCounts.get(p.series);
  }

  return posts.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return comparePosts(a, b);
  });
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * Prev = older post, next = newer post, in plain date order.
 * Inside a series the nav follows reading order instead: next → the next
 * part, prev → the part before; past either end it falls back to chronology.
 */
export function getAdjacentPosts(slug: string): {
  prev?: PostMeta;
  next?: PostMeta;
} {
  const byDate = getAllPosts().slice().sort(comparePosts);
  const i = byDate.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  const me = byDate[i];

  if (me.series) {
    const idxs: number[] = [];
    byDate.forEach((p, j) => {
      if (p.series === me.series) idxs.push(j);
    });
    const parts = idxs.map((j) => byDate[j]); // ascending by part
    const pi = parts.findIndex((p) => p.slug === slug);
    const prev = parts[pi - 1] ?? byDate[Math.max(...idxs) + 1];
    const next = parts[pi + 1] ?? byDate[Math.min(...idxs) - 1];
    return {
      prev: prev ? toMeta(prev) : undefined,
      next: next ? toMeta(next) : undefined,
    };
  }

  return {
    prev: byDate[i + 1] ? toMeta(byDate[i + 1]) : undefined,
    next: byDate[i - 1] ? toMeta(byDate[i - 1]) : undefined,
  };
}

/** Strip content so lists can be passed to client components. */
export function toMeta(post: Post): PostMeta {
  const { slug, title, summary, date, tag, arc, readTime, featured, series, part, seriesTotal, medium } = post;
  return { slug, title, summary, date, tag, arc, readTime, featured, series, part, seriesTotal, medium };
}
