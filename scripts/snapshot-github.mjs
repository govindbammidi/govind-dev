// Refreshes data/github-contributions.json - the fallback the Activity graph
// uses when GitHub can't be reached at build time (see lib/github.ts).
// Uses GITHUB_TOKEN if set, otherwise the GitHub CLI's login (`gh auth token`).
//
//   npm run snapshot:github

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const USER = "govindbammidi";
const token = process.env.GITHUB_TOKEN || execSync("gh auth token", { encoding: "utf8" }).trim();

const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
  totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { login: USER } }),
});
if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
const cal = (await res.json()).data.user.contributionsCollection.contributionCalendar;

const snapshot = {
  asOf: new Date().toISOString().slice(0, 10),
  total: cal.totalContributions,
  days: cal.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 })),
  ),
};
writeFileSync(new URL("../data/github-contributions.json", import.meta.url), JSON.stringify(snapshot) + "\n");
console.log(`saved ${snapshot.total} contributions over ${snapshot.days.length} days (as of ${snapshot.asOf})`);
