import Link from "next/link";
import Footer from "@/components/Footer";
import GitHubActivity from "@/components/GitHubActivity";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import SchemaHall from "@/components/figures/schema-hall/SchemaHall";
import { experienceShort } from "@/lib/experience";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// the experience chip is derived from the start date, so re-render daily and
// let it move on its own instead of freezing at whatever the last deploy computed.
export const revalidate = 86400;

/*
 * The home page is the resume. A recruiter gives it under a minute, so it reads
 * top to bottom like the PDF: who, the numbers, experience, projects, skills,
 * education. The journal and the background story sit behind one quiet link at
 * the end. Keep this text in step with /Govind_Resume.pdf
 * (source: resume-variants/resume_fullstack_body.tex).
 *
 * `**word**` inside a bullet renders bold, the same words the PDF bolds.
 */

const RESUME_PDF = "/Govind_Resume.pdf";
const RESUME_FILENAME = "Bammidi_Govinda_Rao_Resume.pdf";

const NUMBERS = [
  { value: "15+", label: "ERP modules shipped" },
  { value: "570", label: "REST endpoints" },
  { value: "240+", label: "versioned DB migrations" },
  { value: "300", label: "students on a live event app" },
];

const EXPERIENCE = [
  "Joined at the early product stage and owned core areas of the company's **multi-tenant school ERP**, across product requirements, React/TypeScript frontend, Node.js/Express APIs, PostgreSQL, testing and deployment.",
  "Helped migrate the platform from single-tenant Firebase to **schema-per-tenant PostgreSQL** behind an Adapter/Repository data layer, isolating each school's data in its own schema.",
  "Implemented core business logic across **15+ ERP modules** (admissions, timetable, marks, fees, subscriptions), from requirement to release.",
  "Built authentication and **role-based access control** across four roles, and a **Razorpay** webhook-driven subscription lifecycle (trial, grace period, upgrade).",
  "Visited schools to **demo the product**, gather requirements and join negotiations and follow-ups, helping onboard **two pilot schools**; turned their feedback into product changes.",
  "Tested and debugged the product end to end (**Vitest** unit tests, **Playwright** E2E suite) and fixed production issues while pilot schools were using it.",
  "Deployed with **Docker and Nginx on DigitalOcean** via GitHub Actions and owned production releases.",
];

const PROJECTS: {
  title: string;
  stack: string;
  when: string;
  points: { tag: string; text: string }[];
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Maahita School ERP",
    stack: "React · TypeScript · Node.js/Express · PostgreSQL · Docker",
    when: "2024 – present",
    points: [
      {
        tag: "Problem",
        text: "Multiple schools needed one shared platform with each school's data kept isolated.",
      },
      {
        tag: "Built",
        text: "A **schema-per-tenant PostgreSQL** architecture with the tenant search path set per connection, **240+ versioned migrations** with paired rollbacks, and a CI schema-drift check.",
      },
      {
        tag: "Shipped",
        text: "The REST API layer behind **15+ ERP modules**, covered by Vitest unit and Playwright E2E tests, including Razorpay billing, PDF receipts and WhatsApp broadcasts.",
      },
      {
        tag: "Result",
        text: "A pilot-ready school ERP, **piloted with two schools** and refined through their feedback.",
      },
    ],
    links: [{ label: "deployed app", href: "https://school.maahita.com/" }],
  },
  {
    title: "Vinodam, live quiz platform",
    stack: "React · Firebase · real-time sync",
    when: "2026",
    points: [
      {
        tag: "Problem",
        text: "A school principal needed a TV-quiz-show style platform for a student event, within a few weeks.",
      },
      {
        tag: "Built",
        text: "An admin console, projector view and student phone screen synced in real time (rounds, timers, scoring, live leaderboards, join by event code). Built v1 solo; the team adopted and hardened it into a named Maahita product.",
      },
      {
        tag: "Result",
        text: "Ran live with about **300 students**; scores and leaderboards updated for hours without a failure.",
      },
    ],
    links: [{ label: "live app", href: "https://vinodam-maahita.web.app/" }],
  },
];

const SKILLS = [
  { group: "Languages", items: "JavaScript, TypeScript, SQL, Python, HTML, CSS" },
  { group: "Frontend", items: "React, React Router, Vite, Tailwind CSS" },
  { group: "Backend", items: "Node.js, Express.js, REST APIs, JWT" },
  { group: "Database", items: "PostgreSQL (JSONB, migrations), Firebase" },
  { group: "Auth & payments", items: "Firebase Auth, Razorpay" },
  {
    group: "DevOps & testing",
    items: "Docker, Nginx, GitHub Actions, DigitalOcean, Git, Vitest, Playwright",
  },
  {
    group: "Practices",
    items:
      "Design patterns (Adapter, Factory, Repository), layered architecture, spec-first design, Agile (Jira)",
  },
];

/** Three entries, one of each kind, for interviewers who want the depth. */
const WRITING = [
  { kind: "Interview retrospective", slug: "the-interview-wasnt-about-my-code" },
  { kind: "Debugging lesson", slug: "the-discount-was-zero-because-two-clocks-disagreed" },
  { kind: "Architecture note", slug: "every-school-thinks-its-the-only-one" },
];

const link =
  "border-b border-transparent text-accent no-underline transition-colors hover:border-accent";

/** Renders `**bold**` spans inside a resume bullet. */
function Rich({ text }: { text: string }) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <b key={i} className="font-semibold text-ink">
        {part}
      </b>
    ) : (
      part
    ),
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative mb-[9px] pl-5 text-[16.5px] leading-[1.55] text-body">
      <span className="absolute left-0 text-accent" aria-hidden="true">
        ›
      </span>
      {children}
    </li>
  );
}

export default function HomePage() {
  const facts = [
    `${experienceShort()} experience`,
    "Immediate joiner",
    "JNTUGV Gold Medalist",
    "Remote or relocation",
  ];

  const posts = getAllPosts();
  const writing = WRITING.flatMap((w) => {
    const post = posts.find((p) => p.slug === w.slug);
    return post ? [{ ...w, title: post.title }] : [];
  });

  return (
    <>
      <header className="border-b border-line pb-12 pt-[64px]">
        <div className="mx-auto max-w-[760px] px-7">
          <p className="kicker rise mb-[20px]">Open to roles</p>
          <h1 className="rise rise-1 mb-[14px] font-display text-masthead font-medium leading-[1.02] tracking-[-1.5px]">
            Bammidi Govinda Rao
          </h1>
          {/* role and stack on their own lines, so neither has to be read out of a sentence */}
          <p className="rise rise-2 mb-[6px] font-display text-[22px] font-medium text-accent sm:text-[24px]">
            Full Stack Developer (Founding Team)
          </p>
          <p className="rise rise-2 mb-[18px] font-mono text-[14px] tracking-[0.2px] text-tag">
            React · TypeScript · Node.js · PostgreSQL
          </p>
          <p className="rise rise-2 mb-[24px] max-w-[620px] text-[18px] text-lede sm:text-[19px]">
            At Maahita Technologies, I built core parts of a multi-tenant school
            ERP, working across product requirements, architecture, testing,
            deployment and production support.
          </p>
          <div className="rise rise-3 mb-[28px] flex flex-wrap gap-[10px] font-mono text-[12.5px]">
            {facts.map((f) => (
              <span
                key={f}
                className="glass-chip rounded-full px-[13px] py-[6px] text-tag"
              >
                <i className="not-italic text-accent" aria-hidden="true">
                  ◆{" "}
                </i>
                {f}
              </span>
            ))}
          </div>
          <div className="rise rise-4 flex flex-wrap items-center gap-x-[22px] gap-y-3 font-mono text-[13px]">
            <a
              href={RESUME_PDF}
              download={RESUME_FILENAME}
              className="inline-flex items-center gap-2 glass-btn rounded-full px-[22px] py-[11px] no-underline"
            >
              ↓ Download resume
            </a>
            {/* shown in full: recruiters copy the address more often than they click it */}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              linkedin →
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              github →
            </a>
            <a
              href={site.medium}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              medium →
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-line py-[34px]" aria-label="Key numbers">
        <Reveal className="mx-auto grid max-w-[760px] grid-cols-2 gap-x-6 gap-y-6 px-7 sm:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label}>
              <div className="tnum font-display text-[34px] font-medium leading-none tracking-[-0.8px] text-accent">
                {n.value}
              </div>
              <div className="mt-[8px] font-mono text-[12px] leading-[1.4] text-muted">
                {n.label}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="experience">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="01" className="mb-[22px]">
            Experience
          </SectionLabel>
          <div className="mb-[14px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-display text-[22px] font-medium tracking-[-0.4px]">
              Full Stack Developer (Founding Team)
            </h2>
            <span className="font-mono text-[12px] text-muted">
              Sep 2024 – present
            </span>
          </div>
          <div className="mb-[16px] font-mono text-[12.5px] text-accent">
            Maahita Technologies · Remote
          </div>
          <ul>
            {EXPERIENCE.map((item) => (
              <Bullet key={item}>
                <Rich text={item} />
              </Bullet>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="activity">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="02" className="mb-[22px]">
            Activity
          </SectionLabel>
          <GitHubActivity />
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="architect">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="03" className="mb-[22px]">
            How I build
          </SectionLabel>
          <div className="mb-[26px] border-l-2 border-accent pl-5">
            <p className="mb-[4px] font-mono text-[12px] uppercase tracking-[1.2px] text-muted">
              Multi-tenant architecture
            </p>
            <p className="text-[17.5px] leading-[1.55] text-body">
              Each school has its own PostgreSQL schema behind a shared Express
              API and React frontend. The API checks that the signed-in user
              belongs to the requested school, then runs that request&apos;s
              queries against that school&apos;s schema only.
            </p>
          </div>
          <SchemaHall />
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="projects">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="04" className="mb-[8px]">
            Projects
          </SectionLabel>
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className={`py-[22px] ${i === 0 ? "" : "border-t border-line"}`}
            >
              <div className="mb-[4px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-[22px] font-medium tracking-[-0.4px]">
                  {p.title}
                </h3>
                <span className="font-mono text-[12px] text-muted">{p.when}</span>
              </div>
              <div className="mb-[14px] font-mono text-[12.5px] text-accent">
                {p.stack}
              </div>
              <ul className="mb-[10px]">
                {p.points.map((pt) => (
                  <Bullet key={pt.text}>
                    <b className="font-semibold text-ink">{pt.tag}:</b>{" "}
                    <Rich text={pt.text} />
                  </Bullet>
                ))}
              </ul>
              <div className="flex flex-wrap gap-x-5 font-mono text-[13px]">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link}
                  >
                    {l.label} →
                  </a>
                ))}
              </div>
            </article>
          ))}
          <p className="mt-2 font-mono text-[13px]">
            <Link href="/work" className={link}>
              client and side projects →
            </Link>
          </p>
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="skills">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="05" className="mb-[22px]">
            Skills
          </SectionLabel>
          <dl className="grid gap-y-[12px] sm:grid-cols-[170px_1fr] sm:gap-x-5">
            {SKILLS.map((s) => (
              <div key={s.group} className="contents">
                <dt className="font-mono text-[12.5px] uppercase tracking-[0.8px] text-muted sm:pt-[3px]">
                  {s.group}
                </dt>
                <dd className="mb-[6px] text-[16.5px] text-body sm:mb-0">
                  {s.items}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="education">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="06" className="mb-[22px]">
            Education
          </SectionLabel>
          <div className="mb-[4px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-display text-[22px] font-medium tracking-[-0.4px]">
              B.Tech, Artificial Intelligence &amp; Machine Learning
            </h2>
            <span className="font-mono text-[12px] text-muted">2021 – 2025</span>
          </div>
          <p className="mb-[14px] text-[16.5px] text-muted">
            Sri Venkateswara College of Engineering and Technology, Srikakulam
            (JNTUGV) · CGPA 8.17/10 · First Class
          </p>
          <ul>
            <Bullet>
              <b className="font-semibold text-ink">JNTUGV Gold Medalist, AIML:</b>{" "}
              highest academic performance in the AIML branch across all
              JNTUGV-affiliated colleges (2021 to 2025 batch), awarded at the
              university&apos;s first convocation, July 2026.
            </Bullet>
          </ul>
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="writing">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="07" className="mb-[14px]">
            Selected writing
          </SectionLabel>
          {writing.map((w, i) => (
            <Link
              key={w.slug}
              href={`/journal/${w.slug}`}
              className={`group flex flex-col gap-1 py-[14px] no-underline sm:flex-row sm:items-baseline sm:gap-5 ${
                i === 0 ? "" : "border-t border-line"
              }`}
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.8px] text-muted sm:min-w-[190px]">
                {w.kind}
              </span>
              <span className="font-display text-[18.5px] leading-[1.35] text-ink transition-colors group-hover:text-accent">
                {w.title}
              </span>
            </Link>
          ))}
          <p className="mt-4 font-mono text-[13px]">
            <Link href="/journal" className={link}>
              the whole journal →
            </Link>
          </p>
        </Reveal>
      </section>

      <section className="py-[40px]">
        <Reveal className="mx-auto max-w-[760px] px-7 text-center">
          <a
            href={RESUME_PDF}
            download={RESUME_FILENAME}
            className="inline-flex items-center gap-2 glass-btn rounded-full px-[22px] py-[11px] font-mono text-[13px] no-underline"
          >
            ↓ Download resume
          </a>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
