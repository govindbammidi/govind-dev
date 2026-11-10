import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import { getAllProjects, getProject } from "@/lib/projects";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = `${site.url}/work/${project.slug}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url,
      authors: [site.author],
      tags: project.stack,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      creator: site.xHandle,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const url = `${site.url}/work/${project.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url,
    creator: {
      "@type": "Person",
      name: site.author,
      url: site.url,
    },
    keywords: project.stack.join(", "),
    dateCreated: project.year,
  };

  // sections vary per project, so number them by their actual order
  const sectionKeys = [
    "overview",
    ...(project.caseStudy && project.caseStudy.length > 0 ? ["casestudy"] : []),
    "features",
    ...(project.challenges && project.challenges.length > 0 ? ["challenges"] : []),
    ...(project.highlights && project.highlights.length > 0 ? ["highlights"] : []),
    "impact",
    "stack",
  ];
  const num = (key: string) =>
    String(sectionKeys.indexOf(key) + 1).padStart(2, "0");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="border-b border-line pb-[50px] pt-[40px]">
        <div className="mx-auto max-w-[760px] px-7">
          <Link
            href="/work"
            className="rise mb-7 inline-block font-mono text-[12.5px] text-muted no-underline hover:text-accent"
          >
            ← what i build
          </Link>
          <p className="kicker rise rise-1 mb-5">{project.kicker}</p>
          <h1 className="rise rise-2 mb-[18px] font-display text-title font-medium leading-[1.05] tracking-[-1.2px]">
            {project.title}
          </h1>
          <p className="rise rise-3 mb-7 max-w-[620px] text-[20px] text-lede">
            {project.tagline}
          </p>
          <div className="rise rise-4 flex flex-wrap gap-[10px] font-mono text-[12.5px]">
            <span className="glass-chip rounded-full px-[13px] py-[6px] text-tag">
              <i className="not-italic text-accent" aria-hidden="true">
                ◆{" "}
              </i>
              {project.status}
            </span>
            <span className="glass-chip rounded-full px-[13px] py-[6px] text-tag">
              <i className="not-italic text-accent" aria-hidden="true">
                ◆{" "}
              </i>
              {project.year}
            </span>
          </div>
        </div>
      </header>

      <section className="border-b border-line py-[46px]">
        <div className="mx-auto max-w-[760px] px-7">
          <SectionLabel number={num("overview")} className="mb-[26px]">
            Overview
          </SectionLabel>
          {project.overview.map((para) => (
            <p key={para.slice(0, 40)} className="mb-5 text-[19px] text-body">
              {para}
            </p>
          ))}
          {project.objectives && project.objectives.length > 0 ? (
            <>
              <h3 className="mb-[14px] mt-9 font-mono text-[12px] uppercase tracking-[1px] text-accent">
                Objectives
              </h3>
              <ul>
                {project.objectives.map((item) => (
                  <li
                    key={item}
                    className="relative mb-[7px] pl-5 text-[17.5px] text-body"
                  >
                    <span
                      className="absolute left-0 text-accent"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      {project.caseStudy && project.caseStudy.length > 0 ? (
        <section className="border-b border-line py-[46px]">
          <div className="mx-auto max-w-[760px] px-7">
            <SectionLabel number={num("casestudy")} className="mb-7">
              Case study
            </SectionLabel>
            {project.caseStudy.map((block) => (
              <div key={block.heading} className="mb-9 last:mb-0">
                <h3 className="mb-3 font-display text-[22px] font-medium tracking-[-0.4px]">
                  {block.heading}
                </h3>
                {block.body.map((para) => (
                  <p
                    key={para.slice(0, 40)}
                    className="mb-4 text-[18px] text-body last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-b border-line py-[46px]">
        <div className="mx-auto max-w-[760px] px-7">
          <SectionLabel number={num("features")} className="mb-7">
            Key features
          </SectionLabel>
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
            {project.features.map((feature) => (
              <div key={feature.title} className="bg-paper px-6 py-[22px]">
                <h4 className="mb-2 font-display text-[19px] font-medium leading-[1.25]">
                  {feature.title}
                </h4>
                <p className="text-[15.5px] leading-[1.55] text-muted">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {project.challenges && project.challenges.length > 0 ? (
        <section className="border-b border-line py-[46px]">
          <div className="mx-auto max-w-[760px] px-7">
            <SectionLabel number={num("challenges")} className="mb-7">
              Challenges &amp; solutions
            </SectionLabel>
            <div className="flex flex-col gap-5">
              {project.challenges.map((item) => (
                <div
                  key={item.challenge.slice(0, 40)}
                  className="glass rounded-[18px] px-[26px] py-6"
                >
                  <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[1px] text-muted">
                    Challenge
                  </p>
                  <p className="mb-5 text-[17.5px] text-body">
                    {item.challenge}
                  </p>
                  <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[1px] text-accent">
                    Solution
                  </p>
                  <p className="text-[17.5px] text-body">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {project.highlights && project.highlights.length > 0 ? (
        <section className="border-b border-line py-[46px]">
          <div className="mx-auto max-w-[760px] px-7">
            <SectionLabel number={num("highlights")} className="mb-7">
              Technical highlights
            </SectionLabel>
            <ul>
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="relative mb-[10px] pl-5 text-[18px] text-body"
                >
                  <span
                    className="absolute left-0 text-accent"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-b border-line py-[46px]">
        <div className="mx-auto max-w-[760px] px-7">
          <SectionLabel number={num("impact")} className="mb-7">
            Business impact
          </SectionLabel>
          <ul>
            {project.impact.map((item) => (
              <li
                key={item}
                className="relative mb-[10px] pl-5 text-[18px] text-body"
              >
                <span className="absolute left-0 text-accent" aria-hidden="true">
                  ›
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-line py-[46px]">
        <div className="mx-auto max-w-[760px] px-7">
          <SectionLabel number={num("stack")} className="mb-7">
            Tech stack &amp; my role
          </SectionLabel>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h4 className="mb-[14px] font-mono text-[12px] uppercase tracking-[1px] text-accent">
                Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="glass-chip rounded-full px-[13px] py-[7px] font-mono text-[13px] text-tag"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-[14px] font-mono text-[12px] uppercase tracking-[1px] text-accent">
                My role
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.role.map((r) => (
                  <span
                    key={r}
                    className="glass-chip rounded-full px-[13px] py-[7px] font-mono text-[13px] text-tag"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {project.links.length > 0 ? (
            <div className="mt-9 flex flex-wrap gap-[22px] font-mono text-[13px]">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          ) : (
            project.access && (
              <p className="mt-9 font-mono text-[12.5px] text-muted">
                {project.access}
              </p>
            )
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
