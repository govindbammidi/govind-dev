import snapshot from "@/data/github-contributions.json";
import { site } from "@/lib/site";

/*
 * The last year of GitHub contributions, from the first source that answers:
 *
 *   1. GitHub's GraphQL API - when GITHUB_TOKEN is set in Vercel (any token,
 *      no scopes needed: contribution counts are public)
 *   2. the public contributions feed (github-contributions-api.jogruber.de),
 *      which needs no token but scrapes GitHub's calendar page and goes down
 *      whenever that page times out
 *   3. the snapshot in data/github-contributions.json, refreshed with
 *      `npm run snapshot:github` - so the graph is never empty
 *
 * Each live source gets a few seconds; a slow one can't stall the build.
 */

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; days: Day[]; source: "github" | "feed" | "snapshot" };

const USER = new URL(site.github).pathname.replace(/\//g, "");
const TIMEOUT_MS = 8000;
const DAY_S = 86400;

const LEVEL: Record<string, Day["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fromGraphQL(): Promise<Contributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: USER } }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: DAY_S },
  });
  if (!res.ok) return null;
  const cal = (await res.json())?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal?.weeks?.length) return null;
  const days: Day[] = cal.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 })),
  );
  return { total: cal.totalContributions, days, source: "github" };
}

async function fromFeed(): Promise<Contributions | null> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: DAY_S },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { total?: { lastYear?: number }; contributions?: Day[] };
  if (!data.contributions?.length) return null;
  return { total: data.total?.lastYear ?? 0, days: data.contributions, source: "feed" };
}

export async function getContributions(): Promise<Contributions> {
  for (const source of [fromGraphQL, fromFeed]) {
    try {
      const got = await source();
      if (got) return got;
    } catch {
      /* timed out or unreachable - try the next one */
    }
  }
  return { total: snapshot.total, days: snapshot.days as Day[], source: "snapshot" };
}
