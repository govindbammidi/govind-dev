import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk shop, hire, or compare notes on building in public - I'm easy to reach.",
};

const CHANNELS = [
  { label: "LinkedIn", value: "/in/bammidi-govinda-rao", href: site.linkedin },
  { label: "GitHub", value: "@govindbammidi", href: site.github },
  { label: "GitHub · Maahita", value: "@govindaraob-maahita", href: site.githubWork },
  { label: "X (Twitter)", value: site.xHandle, href: site.x },
  { label: "Medium", value: "@bammidigovindarao1729", href: site.medium },
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
];

export default function ContactPage() {
  return (
    <>
      <main className="flex flex-1 items-center py-[60px]">
        <div className="mx-auto w-full max-w-[700px] px-7">
          <p className="kicker rise mb-5">Contact</p>
          <h1 className="rise rise-1 mb-5 font-display text-display font-medium leading-[1.03] tracking-[-1.2px]">
            Want to see how I <em className="italic text-accent">think</em>?
          </h1>
          <p className="rise rise-2 mb-10 max-w-[520px] text-[20px] text-lede">
            The journal is the real answer. But if you want to talk shop,
            hire, or just compare notes on building in public - I&apos;m easy
            to reach.
          </p>

          <div className="glass rise rise-3 grid max-w-[520px] overflow-hidden rounded-[18px]">
            {CHANNELS.map((ch) => {
              // mailto opens the mail client, not a page - a new tab would be blank
              const external = !ch.href.startsWith("mailto:");
              return (
              <a
                key={ch.label}
                href={ch.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between border-b border-[var(--glass-edge)] px-6 py-5 no-underline transition-colors last:border-0 hover:bg-[var(--glass-bg)] active:bg-[var(--glass-bg-strong)]"
              >
                <span>
                  <span className="block font-mono text-[12px] uppercase tracking-[1px] text-accent">
                    {ch.label}
                  </span>
                  <span className="text-[18px] text-ink">{ch.value}</span>
                </span>
                <span
                  className="font-mono text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="py-[30px] pb-[50px] text-center">
        <p className="font-mono text-[11px] text-muted">{site.fine}</p>
      </footer>
    </>
  );
}
