import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getArchive, getArchiveItem } from "@/lib/archive";

interface Props {
  params: Promise<{ key: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getArchive().map((p) => ({ key: p.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const p = getArchiveItem(key);
  if (!p) return {};
  return { title: p.name, description: p.blurb };
}

const TONE = {
  live: "text-[#16a34a] dark:text-[#4ade80]",
  pilot: "text-[#d97706] dark:text-[#fbbf24]",
  proto: "text-[#2563eb] dark:text-[#60a5fa]",
} as const;

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 text-[12.5px] font-semibold uppercase tracking-[1.4px] text-muted">
      {children}
    </h2>
  );
}

/**
 * One project, laid out like a product page: the list of all projects down
 * the side, then the name, a screenshot, a button to try it, and what it is,
 * what it's built with, what it does and how it's built.
 */
export default async function ProjectPage({ params }: Props) {
  const { key } = await params;
  const p = getArchiveItem(key);
  if (!p) notFound();

  const all = getArchive();
  const image = p.image && existsSync(join(process.cwd(), "public", p.image)) ? p.image : undefined;

  return (
    <>
      <div className="mx-auto grid max-w-[1080px] gap-10 px-7 pb-16 pt-[64px] lg:grid-cols-[200px_1fr]">
        {/* every project, one tap away - desktop only */}
        <nav aria-label="All projects" className="hidden lg:block">
          <div className="sticky top-[96px]">
            <Link href="/projects" className="mb-4 inline-block text-[13px] text-muted no-underline hover:text-ink">
              ← All projects
            </Link>
            <ul className="space-y-1">
              {all.map((q) => {
                const on = q.key === p.key;
                return (
                  <li key={q.key}>
                    <Link
                      href={`/projects/${q.key}`}
                      aria-current={on ? "page" : undefined}
                      className={`block rounded-lg px-3 py-[7px] text-[14px] no-underline ${
                        on ? "glass-chip font-semibold text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {q.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <article className="mx-auto w-full max-w-[720px]">
          <Link href="/projects" className="mb-6 inline-block text-[13px] text-muted no-underline hover:text-ink lg:hidden">
            ← All projects
          </Link>

          <header className="text-center">
            <p className="flex items-center justify-center gap-3 text-[12.5px] uppercase tracking-[1.2px] text-muted">
              {p.area}
              <span className={`flex items-center gap-[6px] normal-case tracking-normal font-semibold ${TONE[p.status.tone]}`}>
                <span className="h-[6px] w-[6px] rounded-full bg-current" aria-hidden="true" />
                {p.status.label}
              </span>
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,1.5rem+2vw,2.75rem)] leading-[1.08]">{p.name}</h1>
            <p className="mx-auto mt-3 max-w-[600px] text-[17px] leading-[1.6] text-muted">{p.blurb}</p>
          </header>

          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`${p.name} screenshot`}
              className="mt-8 aspect-[16/10] w-full rounded-[18px] border border-line object-cover object-top"
            />
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-[20px] py-[9px] text-[14.5px] font-semibold text-paper no-underline transition-opacity hover:opacity-85"
              >
                Try it ↗
              </a>
            )}
            {p.more && (
              <Link
                href={p.more.href}
                className="glass-chip rounded-full px-[20px] py-[9px] text-[14.5px] font-semibold text-ink no-underline"
              >
                {p.more.label === "case study" ? "Read the case study" : "Read the story"} →
              </Link>
            )}
          </div>

          <Heading>Overview</Heading>
          {p.overview.map((para) => (
            <p key={para} className="mb-4 text-[17px] leading-[1.75] text-body">
              {para}
            </p>
          ))}

          <Heading>Technologies used</Heading>
          <div className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span key={t} className="rounded-md border border-line px-[9px] py-[3px] text-[13.5px] text-tag">
                {t}
              </span>
            ))}
          </div>

          <Heading>Key features</Heading>
          <ul className="space-y-3">
            {p.features.map((f) => (
              <li key={f.body} className="flex gap-3 text-[16.5px] leading-[1.65] text-body">
                <span className="text-muted" aria-hidden="true">
                  ›
                </span>
                <span>
                  {f.title && <b className="font-semibold text-ink">{f.title}. </b>}
                  {f.body}
                </span>
              </li>
            ))}
          </ul>

          {p.highlights && p.highlights.length > 0 && (
            <>
              <Heading>How it&apos;s built</Heading>
              <ul className="space-y-3">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[16.5px] leading-[1.65] text-body">
                    <span className="text-muted" aria-hidden="true">
                      ›
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </div>

      <Footer />
    </>
  );
}
