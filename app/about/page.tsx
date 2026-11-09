import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Me from "@/components/Me";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import SchemaHall from "@/components/figures/schema-hall/SchemaHall";
import { experienceLong } from "@/lib/experience";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who I am, how I work, and how I got here: a full-stack developer who learned engineering by building, read as The Architect.",
};

// experienceLong() is computed per render, so the page refreshes it daily
export const revalidate = 86400;

/*
 * The work personality comes from Proof CV: a 28-minute conversation with
 * Yoshi (their interviewer) on 14 September, read back as an archetype. It
 * is not self-assessment - these are patterns across what I described.
 */
const PERSONA = {
  name: "The Architect",
  line: "Designs robust systems with an eye on future growth and maintainability.",
  superpower:
    "Turning first ideas into robust, scalable products, anticipating future needs and architectural challenges.",
  goodAt: ["Proactive builder", "Architectural thinker", "Rapid learner", "Technical explainer", "Full-stack ownership"],
  thrivesOn: ["End-to-end ownership", "Learning from senior teams", "Impactful technical decisions", "Fast-paced growth"],
  roles: ["Full Stack Engineer", "Backend Engineer", "Technical Lead", "Solutions Architect"],
  patterns: ["Build from scratch", "Own the solution", "Future-proof design", "Learn by doing"],
  evidence: [
    "Built the Vinodam quiz platform from scratch without waiting for instructions, and had a 70% complete demo in three days.",
    "Slowly took ownership of building the school ERP, front end and back end.",
    "Led the move from Firebase to multi-tenant PostgreSQL, with adapter files so the data layer can change again later.",
    "Designed the security checks and data shaping that keep each school's queries inside its own schema.",
    "Prefers getting hands dirty: start from a base and iterate, rather than wait for perfect.",
  ],
};

type Milestone = { when: string; title: string; body: string; points?: string[] };

const JOURNEY: Milestone[] = [
  {
    when: "2021",
    title: "Where it started",
    body: "Began a B.Tech in Artificial Intelligence & Machine Learning at a normal tier-3 college in Srikakulam. Basic programming, some full-stack fundamentals, almost no production experience.",
  },
  {
    when: "Sep 2024",
    title: "Joined a startup in my 4th year",
    body: "Joined Maahita Technologies as an intern on the founding team of an early-stage SaaS product, and started shipping production code almost immediately. No perfect roadmap, no mature process: we learned from real schools and evolved.",
    points: [
      "Took ownership of the school ERP across the stack, and demoed it to schools in person.",
      "Moved it from Firebase to schema-per-tenant PostgreSQL behind an adapter layer, so each school's data lives in its own schema.",
      "Built Vinodam, a live quiz platform, in secret from a principal's challenge. Its first event ran with 300 students.",
    ],
  },
  {
    when: "Along the way",
    title: "Learned to defend every choice",
    body: "Engineers with more than a decade of experience reviewed everything. They rejected my PRs, asked me why, and made me defend my decisions. Constants, design consistency, tests, naming, feature gating: I learned the value of each long after I had argued against it.",
  },
  {
    when: "2025",
    title: "Graduated",
    body: "B.Tech, AI & ML, from SVCET Srikakulam (JNTUGV), CGPA 8.17, First Class.",
  },
  {
    when: "Jul 2026",
    title: "JNTUGV Gold Medal",
    body: "Highest academic performance in the AIML branch across all JNTUGV-affiliated colleges, awarded at the university's first convocation. I've never thought of it as my real achievement.",
  },
  {
    when: "Now",
    title: "Open to roles",
    body: "Looking for a growing team where I can own features end to end, contribute to architecture, and keep learning from people better than me.",
  },
];

const VALUES = [
  "learning by building",
  "honesty about mistakes",
  "respecting experienced people",
  "continuous improvement",
  "ownership",
  "curiosity",
  "practical engineering",
  "product thinking",
  "long-term thinking",
];

function Chips({ items, strong = false }: { items: string[]; strong?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className={`glass-chip whitespace-nowrap rounded-full px-[13px] py-[6px] text-[13.5px] ${strong ? "text-ink" : "text-tag"}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[12px] uppercase tracking-[1.5px] text-muted">{children}</p>;
}

export default function AboutPage() {
  const years = experienceLong();

  return (
    <>
      <header className="border-b border-line pb-10 pt-[72px]">
        <div className="mx-auto max-w-[760px] px-7">
          <p className="kicker rise mb-5">About</p>
          <h1 className="rise rise-1 font-display text-display leading-[1.05]">
            I learned engineering by building, not by grinding.
          </h1>
          <p className="rise rise-2 mt-5 max-w-[600px] text-[18px] text-muted">
            Who I am, how I work, and how I got here.
          </p>
        </div>
      </header>

      {/* who I am */}
      <section className="border-b border-line py-[46px]">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="01" className="mb-[26px]">
            Who I am
          </SectionLabel>
          <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
            <div>
              <Me size={220} className="aspect-square w-full max-w-[220px] rounded-[28px] border border-line" />
              <p className="mt-4 text-[17px] font-semibold">{site.title}</p>
              <p className="text-[14px] text-muted">Full Stack Developer (Founding Team)</p>
              <p className="text-[14px] text-muted">Maahita Technologies · Remote</p>
            </div>
            <div className="text-[17.5px] leading-[1.75] text-body">
              <p className="mb-5">
                I&apos;m Govind, a full-stack developer on the founding team at Maahita
                Technologies, where I build a multi-tenant school ERP across React,
                Node.js and PostgreSQL. That&apos;s {years} of shipping real software to
                real schools.
              </p>
              <p className="mb-5">
                I joined as a 4th-year B.Tech intern and started shipping production code
                almost immediately. I came from a normal tier-3 college. The gold medal came
                later; my real growth started after I joined.
              </p>
              <p>
                I learned software engineering by shipping, debugging, maintaining and
                improving a real SaaS system: from mentors, from mistakes, from customers,
                from testers and from production incidents.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* the line under everything */}
      <section className="border-b border-line py-[56px]">
        <Reveal className="mx-auto max-w-[760px] px-7 text-center">
          <p className="font-display text-[clamp(1.6rem,1.1rem+2vw,2.4rem)] font-semibold leading-[1.2] tracking-[-0.025em]">
            &ldquo;Good engineering optimises for the change you can&apos;t see coming.&rdquo;
          </p>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] text-muted">
            Not just the task in front of you. It&apos;s the lesson under almost
            everything I write here.
          </p>
        </Reveal>
      </section>

      {/* work personality */}
      <section className="border-b border-line py-[46px]" id="persona">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="02" className="mb-[26px]">
            Work personality
          </SectionLabel>
          <div className="glass rounded-[24px] p-6 sm:p-8">
            <Label>How I work, read by Proof CV</Label>
            <h2 className="font-display text-[clamp(2rem,1.5rem+2vw,2.75rem)] leading-[1.05]">
              {PERSONA.name}
            </h2>
            <p className="mt-3 max-w-[520px] text-[17.5px] text-body">{PERSONA.line}</p>

            <div className="mt-7 border-l-2 border-accent pl-5">
              <Label>Superpower</Label>
              <p className="text-[19px] font-medium leading-[1.5] text-ink">{PERSONA.superpower}</p>
            </div>

            {/* one group per row, so no chip has to wrap inside its pill */}
            <div className="mt-8 space-y-6">
              <div>
                <Label>Good at</Label>
                <Chips items={PERSONA.goodAt} strong />
              </div>
              <div>
                <Label>Thrives on</Label>
                <Chips items={PERSONA.thrivesOn} />
              </div>
              <div>
                <Label>Roles to explore</Label>
                <Chips items={PERSONA.roles} />
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <Label>Patterns noticed</Label>
              <Chips items={PERSONA.patterns} strong />
              <p className="mt-3 text-[13.5px] text-muted">
                Not skills I claimed: patterns across what I described.
              </p>
            </div>

            <details className="group mt-6 border-t border-line pt-5">
              <summary className="cursor-pointer list-none text-[15px] font-medium text-ink">
                Why this reading{" "}
                <span className="inline-block text-muted transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>
              <ul className="mt-4 space-y-2 text-[16px] leading-[1.6] text-body">
                {PERSONA.evidence.map((e) => (
                  <li key={e} className="flex gap-3">
                    <span className="text-muted" aria-hidden="true">
                      ›
                    </span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </details>

            <p className="mt-6 text-[13px] text-muted">
              From a 28-minute conversation with Yoshi on Proof CV, 14 September.
            </p>
          </div>
        </Reveal>
      </section>

      {/* how I build: the architecture that reading is about */}
      <section className="border-b border-line py-[46px]" id="how-i-build">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="03" className="mb-[22px]">
            How I build
          </SectionLabel>
          <div className="mb-[26px] border-l-2 border-accent pl-5">
            <p className="mb-[4px] text-[12px] uppercase tracking-[1.2px] text-muted">
              Multi-tenant architecture
            </p>
            <p className="text-[17.5px] leading-[1.55] text-body">
              Each school has its own PostgreSQL schema behind a shared Express API and
              React frontend. The API checks that the signed-in user belongs to the
              requested school, then runs that request&apos;s queries against that
              school&apos;s schema only.
            </p>
          </div>
          <SchemaHall />
        </Reveal>
      </section>

      {/* journey */}
      <section className="border-b border-line py-[46px]" id="journey">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="04" className="mb-[30px]">
            Journey &amp; milestones
          </SectionLabel>
          <ol className="relative ml-[7px] border-l border-line">
            {JOURNEY.map((m, i) => (
              <li key={m.title} className={`relative pl-8 ${i === JOURNEY.length - 1 ? "" : "pb-9"}`}>
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-[6px] h-[13px] w-[13px] rounded-full border-2 border-paper ${
                    m.when === "Now" ? "bg-accent" : "bg-muted"
                  }`}
                />
                <p className="text-[12.5px] uppercase tracking-[1.2px] text-muted">{m.when}</p>
                <h3 className="mt-1 text-[20px] leading-[1.3]">{m.title}</h3>
                <p className="mt-2 text-[16.5px] leading-[1.7] text-body">{m.body}</p>
                {m.points && (
                  <ul className="mt-3 space-y-2 text-[16px] leading-[1.6] text-body">
                    {m.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="text-muted" aria-hidden="true">
                          ›
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* values */}
      <section className="py-[46px]">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="05" className="mb-[22px]">
            What I care about
          </SectionLabel>
          <Chips items={VALUES} />
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
