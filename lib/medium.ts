import { site } from "@/lib/site";

/*
 * Journal entries are cross-posted to Medium. A post page links to its Medium
 * copy ("Original on Medium", "Read & clap on Medium") when one exists, found
 * by title in the public Medium feed. Fetched with the page and refreshed
 * daily, so a newly cross-posted entry picks up its link without a deploy.
 * The feed only carries recent stories; anything not in it just gets the
 * "Follow on Medium" link to the profile.
 */

const FEED = `https://medium.com/feed/${new URL(site.medium).pathname.slice(1)}`;

/** Lowercase letters and digits only, so curly quotes and dashes still match. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

export async function mediumStories(): Promise<Map<string, string>> {
  const stories = new Map<string, string>();
  try {
    const res = await fetch(FEED, { next: { revalidate: 86400 } });
    if (!res.ok) return stories;
    const xml = await res.text();
    for (const item of xml.split("<item>").slice(1)) {
      const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1];
      const link = item.match(/<link>([^<]+)<\/link>/)?.[1];
      if (!title || !link) continue;
      // drop Medium's ?source=rss tracking parameter
      stories.set(norm(title), link.split("?")[0]);
    }
  } catch {
    /* Medium unreachable at build time - posts just show the profile link */
  }
  return stories;
}

/** For a list page: each post's Medium copy, keyed by slug, for those that have one. */
export async function mediumUrlsBySlug(posts: { slug: string; title: string }[]): Promise<Record<string, string>> {
  const stories = await mediumStories();
  const out: Record<string, string> = {};
  for (const p of posts) {
    const url = stories.get(norm(p.title));
    if (url) out[p.slug] = url;
  }
  return out;
}

export async function mediumUrlFor(title: string): Promise<string | null> {
  const key = norm(title);
  if (!key) return null;
  return (await mediumStories()).get(key) ?? null;
}
