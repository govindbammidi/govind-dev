import { PRODUCTS, getAllProjects } from "@/lib/projects";

/*
 * Everything on /projects, in one shape: the products in production, the
 * prototypes built for clients, and the side projects built for people
 * around me. Products and prototypes come from lib/projects.ts, so their
 * wording is written once; the side projects are short enough to live here.
 */

export const CATEGORIES = ["Products", "Prototypes", "Side projects"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Status = { label: string; tone: "live" | "pilot" | "proto" };

export interface ArchiveItem {
  key: string;
  name: string;
  /** one-word area shown beside the name */
  area: string;
  category: Category;
  status: Status;
  blurb: string;
  stack: string[];
  /** the running app */
  live?: string;
  /** an on-site page about it: a case study or a journal story */
  more?: { href: string; label: string };
  /** a screenshot in /public/projects, when there is one */
  image?: string;
  /** detail page: what it is, in a paragraph or two */
  overview: string[];
  /** detail page: the full stack (cards show the short `stack`) */
  tech: string[];
  /** detail page: what it does */
  features: { title?: string; body: string }[];
  /** detail page: how it's built - the decisions worth reading */
  highlights?: string[];
}

const LIVE: Status = { label: "Live", tone: "live" };

const hrefOf = (links: { label: string; href: string }[], kind: "external" | "internal") =>
  links.find((l) => (kind === "external" ? l.href.startsWith("http") : l.href.startsWith("/")))?.href;

export function getArchiveItem(key: string): ArchiveItem | undefined {
  return getArchive().find((p) => p.key === key);
}

export function getArchive(): ArchiveItem[] {
  const [erp, vinodam] = PRODUCTS;
  const [metro, childCare] = getAllProjects();

  return [
    {
      key: "school-erp",
      name: erp.name,
      area: "School ERP",
      category: "Products",
      status: LIVE,
      blurb: erp.short,
      stack: erp.stack,
      live: hrefOf(erp.links, "external"),
      image: "/projects/school-erp.webp",
      overview: [erp.body],
      tech: erp.stack,
      features: [
        { body: "15+ modules: admissions, timetable, marks, fees and subscriptions." },
        { body: "Role-based access control across four roles." },
        { body: "Razorpay webhook-driven subscriptions, with a trial, a grace period and upgrades." },
        { body: "Piloted with two schools, with their feedback turned into product changes." },
      ],
      highlights: [
        "Moved from single-tenant Firebase to schema-per-tenant PostgreSQL behind an Adapter/Repository data layer, so each school's data lives in its own schema.",
        "The API checks that the signed-in user belongs to the requested school, then runs that request's queries against that school's schema only.",
        "Tested end to end with Vitest unit tests and a Playwright E2E suite.",
        "Deployed with Docker and Nginx on DigitalOcean through GitHub Actions.",
      ],
    },
    {
      key: "vinodam",
      name: vinodam.name,
      area: "Live events",
      category: "Products",
      status: LIVE,
      blurb: vinodam.short,
      stack: vinodam.stack,
      live: hrefOf(vinodam.links, "external"),
      more: { href: hrefOf(vinodam.links, "internal") ?? "/journal", label: "the story" },
      image: "/projects/vinodam.webp",
      overview: [vinodam.body],
      tech: vinodam.stack,
      features: [
        { body: "Three synchronized screens: admin control, a projector display and participants' phones." },
        { body: "Real-time scoring, timers and leaderboards." },
        { body: "Teams join an event with a unique event code." },
        { body: "Its first live event ran with 300 students without breaking." },
      ],
    },
    {
      key: metro.slug,
      name: metro.cardTitle,
      area: "Operations",
      category: "Prototypes",
      status: { label: "Pilot", tone: "pilot" },
      blurb: metro.short,
      stack: metro.stack,
      live: hrefOf(metro.links, "external"),
      more: { href: `/work/${metro.slug}`, label: "case study" },
      image: `/projects/${metro.slug}.webp`,
      overview: metro.overview,
      tech: metro.stack,
      features: metro.features,
      highlights: metro.highlights,
    },
    {
      key: childCare.slug,
      name: childCare.cardTitle,
      area: "Communication",
      category: "Prototypes",
      status: { label: "Prototype", tone: "proto" },
      blurb: childCare.short,
      stack: childCare.stack,
      live: hrefOf(childCare.links, "external"),
      more: { href: `/work/${childCare.slug}`, label: "case study" },
      image: `/projects/${childCare.slug}.webp`,
      overview: childCare.overview,
      tech: childCare.stack,
      features: childCare.features,
      highlights: childCare.highlights,
    },
    {
      key: "geoguard",
      name: "GeoGuard",
      area: "Fleet tracking",
      category: "Side projects",
      status: LIVE,
      blurb:
        "Draw geofences on a map, track vehicles, and get an alert the moment one enters or leaves a zone. PostGIS does the geometry; alerts reach the dashboard live over WebSocket.",
      stack: ["Go", "PostGIS", "React", "WebSocket"],
      live: "https://geoguard-geofencing.vercel.app",
      image: "/projects/geoguard.webp",
      overview: [
        "Draw virtual boundaries (geofences) on a map, track vehicles, and get an alert the moment a vehicle enters or leaves a zone, especially a restricted one.",
        "A Go API checks each location update against PostGIS, works out which zones a vehicle entered or left, stores the events, and pushes alerts to the dashboard over WebSocket once the database commit lands.",
      ],
      tech: ["Go", "PostgreSQL + PostGIS", "React", "TypeScript", "Leaflet", "WebSocket", "Docker", "GitHub Actions"],
      features: [
        { body: "Draw geofences on the map, and click it to move a vehicle." },
        { body: "Entry and exit detection, with restricted-zone entries always raising an alert." },
        { body: "Live toasts and an alert feed over WebSocket, plus a filterable, paginated violation history." },
        { body: "Alert rules per geofence, per vehicle and per event type." },
        { body: "Per-IP rate limiting on location updates, optional API-key auth, and pagination on every list." },
      ],
      highlights: [
        "Point-in-polygon in PostGIS (ST_Covers with a GIST index), so a point on the border counts as inside and lookups stay fast with many zones.",
        "Each vehicle's row is locked while its ping is processed, so two pings arriving together can't create duplicate entry events.",
        "A ping older than the last one processed goes into history only, so out-of-order delivery never fakes an exit or entry.",
        "Alerts are pushed only after the commit, so clients never hear about an event that was rolled back; one hub goroutine owns the client list and drops slow clients.",
        "Tests run against PostGIS in CI, and the backend ships as a Docker image with its migrations built in.",
      ],
    },
    {
      key: "site-bill-automator",
      name: "Site Bill Automator",
      area: "Built for my father",
      category: "Side projects",
      status: LIVE,
      blurb:
        "Bills for my father's painting contracts: an Android app and a web app sharing one Firestore database, with one-tap PDFs whose maths is never wrong.",
      stack: ["Kotlin", "Jetpack Compose", "Next.js", "Firestore"],
      live: "https://web-sable-rho-20.vercel.app",
      image: "/projects/site-bill-automator.webp",
      overview: [
        "My father is a paint contractor. Every time he finished painting a bank branch, someone had to make the bill for the owner: material lists, work measurements, totals. That someone was me, typing every line into MS Word and running each calculation on a phone calculator. I made calculation mistakes more than once, and my father let me know about it.",
        "So I built the proper fix: an Android app and a web app sharing one Firestore database in real time. A bill that used to eat an evening now takes minutes.",
      ],
      tech: ["Kotlin", "Jetpack Compose", "Next.js", "Firebase Firestore", "PDF generation", "PWA"],
      features: [
        { body: "Multi-section bills with work measurements, per-day rates and advances." },
        { body: "The Android app and the web app share one database, live." },
        { body: "One-tap PDF bills whose maths is never wrong." },
        { body: "Installable on the phone as a web app too." },
      ],
    },
    {
      key: "roots",
      name: "Roots",
      area: "Built for myself",
      category: "Side projects",
      status: LIVE,
      blurb:
        "An expense and lending tracker that opens offline and keeps up with who owes what. Built for myself; now my friends use it.",
      stack: ["React", "Capacitor", "Firebase", "offline-first"],
      live: "https://expensetracker-seven-zeta.vercel.app",
      image: "/projects/roots.webp",
      overview: [
        "I was spending a lot, lending money to friends and forgetting about it. My system was a notepad app on my phone and redoing the maths by hand: who owes me, what I owe, constant confusion.",
        "Roots is the fix: a simple expense tracker that also tracks money lent and borrowed per person. I kept it simple enough that my friends now use it daily too.",
      ],
      tech: ["React", "Capacitor (Android)", "Firebase", "offline-first", "Recharts"],
      features: [
        { body: "Expenses, and money lent or borrowed, tracked per person." },
        { body: "Repayments, budgets and recurring expenses." },
        { body: "Charts and a monthly overview." },
        { body: "Opens offline, and installs on Android." },
      ],
    },
  ];
}
