import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import Footer from "@/components/Footer";
import GitHubActivity from "@/components/GitHubActivity";
import SkillVenn from "@/components/SkillVenn";
import Me from "@/components/Me";
import Typewriter from "@/components/Typewriter";
import HeroLinks from "@/components/HeroLinks";
import SkillChips from "@/components/SkillChips";
import ProjectsGrid from "@/components/ProjectsGrid";
import { getArchive } from "@/lib/archive";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { experienceShort } from "@/lib/experience";
import { getAllPosts } from "@/lib/posts";

// the experience chip is derived from the start date, so re-render daily and
// let it move on its own instead of freezing at whatever the last deploy computed.
export const revalidate = 86400;

/*
 * The home page is the resume. A recruiter gives it under a minute, so it reads
 * top to bottom like the PDF: who, experience, GitHub activity, projects,
 * skills, education. The journal and the background story sit behind one quiet link at
 * the end. Keep this text in step with /Govind_Resume.pdf
 * (source: bammidigovindarao_.pdf, November 2026).
 *
 * `**word**` inside a bullet renders bold, the same words the PDF bolds.
 */

const RESUME_PDF = "/Govind_Resume.pdf";
const RESUME_FILENAME = "Bammidi_Govinda_Rao_Resume.pdf";

const EXPERIENCE = [
  "One of the founding engineers; owned a large part of the core implementation of the company's **multi-tenant school ERP**, from requirements to React/TypeScript UI, Node.js/Express APIs and PostgreSQL.",
  "Implemented core business logic across **15+ ERP modules** (admissions, timetable, marks, fees, subscriptions) in a REST API that grew to **570 endpoints**, taking each module from requirement to release.",
  "Built authentication and **role-based access control** for four roles, and a **Razorpay** webhook-driven subscription lifecycle (trial, grace period, upgrade) that updates each school's plan from payment events.",
  "Fixed a fee-waiver bug that split waivers by ratio across a term group (an INR 99.84 mismatch) with **charges-first allocation**, and added immutable **JSONB receipt snapshots** so issued receipts never change.",
  "**Demoed the product** at schools, gathered requirements and joined negotiations and follow-ups, helping onboard **two pilot schools**; shipped their feedback as product changes.",
  "Tested in QA and production with a senior QA engineer, wrote **Vitest** unit and **Playwright** E2E tests (680+ test files across two repos) and fixed production issues during the pilots.",
  "Owned production releases on **Docker and Nginx (DigitalOcean)** via GitHub Actions, gated by tests and a schema-drift check.",
];

/** Three entries, one of each kind, for interviewers who want the depth. */
const WRITING = [
  { kind: "Interview retrospective", slug: "the-interview-wasnt-about-my-code" },
  { kind: "Debugging lesson", slug: "the-discount-was-zero-because-two-clocks-disagreed" },
  { kind: "Architecture note", slug: "every-school-thinks-its-the-only-one" },
];

/** The line under my name, typed out one after another. */
const ROLE_LINES = [
  "Full Stack Developer",
  "Founding team at Maahita",
  "React · TypeScript · Node.js · PostgreSQL",
];

/** The projects shown on the home page, in order. */
const FEATURED = ["school-erp", "vinodam", "geoguard", "metro-operations-shift-handover"];

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
  // four highlights; the rest are on /projects. a card only points at a
  // screenshot that is actually in /public
  const featured = FEATURED.map((key) => getArchive().find((p) => p.key === key))
    .filter((p) => p !== undefined)
    .map((p) => ({
      ...p,
      image: p.image && existsSync(join(process.cwd(), "public", p.image)) ? p.image : undefined,
    }));
  const facts = [`${experienceShort()} experience`, "JNTUGV Gold Medalist"];

  const posts = getAllPosts();
  const writing = WRITING.flatMap((w) => {
    const post = posts.find((p) => p.slug === w.slug);
    return post ? [{ ...w, title: post.title }] : [];
  });

  return (
    <>
      {/* a small, quiet masthead: face, name, a typed role line, and the links */}
      <header className="border-b border-line pb-10 pt-[56px]">
        <div className="mx-auto max-w-[760px] px-7">
          <div className="rise flex items-center gap-5">
            <Me
              size={88}
              className="h-[76px] w-[76px] shrink-0 rounded-[20px] border border-line sm:h-[88px] sm:w-[88px]"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,1.95rem)] leading-[1.15]">
                  Bammidi Govinda Rao
                </h1>
                <span className="flex items-center gap-[6px] rounded-full border border-line px-[9px] py-[2px] text-[12px] font-medium text-muted">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#22c55e]" aria-hidden="true" />
                  Open to roles
                </span>
              </div>
              <p className="mt-1 min-h-[1.6em] text-[16px] text-muted sm:text-[17px]">
                <Typewriter lines={ROLE_LINES} />
              </p>
            </div>
          </div>

          <p className="rise rise-1 mt-7 max-w-[640px] text-[17px] leading-[1.7] text-lede">
            At Maahita Technologies, I built core parts of a multi-tenant school
            ERP, working across product requirements, architecture, testing,
            deployment and production support.
          </p>

          <div className="rise rise-2 mt-5 flex flex-wrap gap-2 text-[13px]">
            {facts.map((f) => (
              <span key={f} className="glass-chip rounded-full px-[12px] py-[5px] text-tag">
                {f}
              </span>
            ))}
          </div>

          <div className="rise rise-3 mt-7 flex flex-wrap items-center gap-3">
            <a
              href={RESUME_PDF}
              download={RESUME_FILENAME}
              className="glass-btn inline-flex items-center gap-2 rounded-full px-[18px] py-[9px] text-[14px] font-semibold no-underline"
            >
              ↓ Download resume
            </a>
            <HeroLinks />
          </div>
        </div>
      </header>

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

      <section className="border-b border-line py-[46px]" id="projects">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="03" className="mb-[8px]">
            Projects
          </SectionLabel>
          <div className="mt-[18px]">
            <ProjectsGrid items={featured} filters={false} />
          </div>
          <div className="mt-7 text-center">
            <Link
              href="/projects"
              className="glass-chip inline-flex items-center gap-2 rounded-full px-[18px] py-[8px] text-[15px] font-semibold text-ink no-underline"
            >
              See all projects →
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="skills">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="04" className="mb-[22px]">
            Skills
          </SectionLabel>
          <SkillChips />
          <p className="mt-5 text-[15px] leading-[1.6] text-muted">
            Also: design patterns (Adapter, Factory, Repository), spec-first design,
            Agile with Jira, and client demos.
          </p>
        </Reveal>
      </section>

      <section className="border-b border-line py-[46px]" id="education">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SectionLabel number="05" className="mb-[22px]">
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
          <SectionLabel number="06" className="mb-[14px]">
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

      {/* the four kinds of work I do, with me where they meet */}
      <section className="border-b border-line py-[56px]" id="hi">
        <Reveal className="mx-auto max-w-[760px] px-7">
          <SkillVenn />
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
