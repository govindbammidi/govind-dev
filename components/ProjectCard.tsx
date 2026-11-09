import Link from "next/link";
import type { Project } from "@/lib/projects";

/** Project teaser used on the work listing and the homepage. Links into the
 *  full breakdown at /work/[slug]. Mirrors the bordered card motif used for
 *  the products and side projects on the work page. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block glass glass-hover rounded-[18px] px-[30px] py-7 no-underline"
    >
      <div className="mb-[14px] flex flex-wrap items-center gap-x-[14px] gap-y-1 font-mono text-[12px] uppercase tracking-[1px]">
        <span className="text-accent">{project.kicker}</span>
        <span aria-hidden="true" className="text-muted">
          ·
        </span>
        <span className="text-muted">{project.year}</span>
      </div>
      <h3 className="mb-3 font-display text-[24px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-accent">
        {project.cardTitle}
      </h3>
      <p className="mb-5 text-[18px] text-lede">{project.tagline}</p>
      <div className="mb-5 flex flex-wrap gap-2 font-mono text-[12px]">
        {project.stack.map((s) => (
          <span
            key={s}
            className="glass-chip rounded-full px-[11px] py-[5px] text-tag"
          >
            {s}
          </span>
        ))}
      </div>
      <span className="inline-block font-mono text-[13px] text-accent transition-transform duration-300 ease-settle group-hover:translate-x-[4px]">
        view the full breakdown →
      </span>
    </Link>
  );
}
