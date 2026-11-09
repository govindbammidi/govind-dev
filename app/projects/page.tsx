import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";
import { CATEGORIES, getArchive } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Everything I've built: products in production, prototypes for clients, and tools for the people around me.",
};

export default function ProjectsPage() {
  // a card only points at a screenshot that is actually in /public
  const items = getArchive().map((p) => ({
    ...p,
    image: p.image && existsSync(join(process.cwd(), "public", p.image)) ? p.image : undefined,
  }));

  return (
    <>
      <header className="pb-8 pt-[72px]">
        <div className="mx-auto max-w-[920px] px-7">
          <p className="kicker rise mb-5">Projects</p>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div>
              <h1 className="rise rise-1 font-display text-display leading-[1.05]">Projects</h1>
              <p className="rise rise-2 mt-4 max-w-[560px] text-[17.5px] text-muted">
                Everything I&apos;ve built: products in production, prototypes for
                clients, and tools for the people around me.
              </p>
            </div>
            <p className="rise rise-2 text-[12.5px] uppercase tracking-[1.2px] text-muted">
              {items.length} projects total
            </p>
          </div>
        </div>
      </header>

      <section className="pb-[64px]">
        <div className="mx-auto max-w-[920px] px-7">
          <ProjectsGrid items={items} categories={CATEGORIES} />
        </div>
      </section>

      <Footer />
    </>
  );
}
