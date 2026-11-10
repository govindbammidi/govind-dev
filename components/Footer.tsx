import Link from "next/link";
import FooterQuote from "@/components/FooterQuote";
import { site } from "@/lib/site";

export default function Footer({ who }: { who?: string }) {
  return (
    <footer className="border-t border-line py-[50px] pb-[70px] text-center">
      <div className="mx-auto max-w-[760px] px-7">
        <FooterQuote />
        {who && (
          <p
            id="contact"
            className="mb-[18px] font-display text-[24px] italic"
          >
            {who}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-[22px] gap-y-2 font-mono text-[13px]">
          <a
            href={site.linkedin}
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            GitHub
          </a>
          <a
            href={site.githubWork}
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            GitHub · Maahita
          </a>
          <a
            href={site.x}
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            X
          </a>
          <a
            href={site.medium}
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            Medium
          </a>
          <a
            href={`mailto:${site.email}`}
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            Email
          </a>
          <Link
            href="/journal"
            className="border-b border-transparent text-accent no-underline transition-colors hover:border-accent"
          >
            Journal
          </Link>
        </div>
        <p className="mt-6 font-mono text-[11px] text-muted">{site.fine}</p>
      </div>
    </footer>
  );
}
