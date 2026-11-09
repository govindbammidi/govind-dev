"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

// recruiter-first: the resume sections, the journal for anyone who wants the
// longer read, contact, and the PDF itself. /work is linked from Projects.
const LINKS = [
  { href: "/#experience", label: "experience" },
  { href: "/#projects", label: "projects" },
  { href: "/journal", label: "journal" },
  { href: "/contact", label: "contact" },
];

const RESUME = { href: "/Govind_Resume.pdf", file: "Bammidi_Govinda_Rao_Resume.pdf" };

/**
 * The nav as a floating island: a black capsule over the page, after the
 * Dynamic Island. On a phone it grows into a card to hold the menu and
 * shrinks back when a row is tapped. The material lives in globals.css
 * (`.island`), which also gives it its own light-on-black palette.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Escape closes the island, the way a sheet dismisses
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav
      aria-label="Site"
      // anchored through route transitions: the content moves, the island doesn't
      style={{ viewTransitionName: "site-nav" }}
      className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4"
    >
      {/* the island re-centres as it grows, so `close` moves from under the
          thumb: a tap anywhere outside puts it away instead */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="pointer-events-auto fixed inset-0 -z-10 cursor-default sm:hidden"
        />
      )}
      <div className="island pointer-events-auto" data-open={open || undefined}>
        <div className="flex h-[44px] items-center gap-[18px] pl-[18px] pr-[14px]">
          <Link
            href="/"
            className="group font-mono text-[13.5px] font-medium tracking-[-0.3px] text-ink no-underline"
          >
            govind
            <b className="inline-block text-accent transition-transform duration-300 ease-settle group-hover:-translate-y-[3px]">
              .
            </b>
            dev
          </Link>

          <div className="hidden items-center gap-[20px] font-mono text-[13px] sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`nav-link no-underline transition-colors hover:text-accent ${
                  isActive(l.href) ? "text-accent" : "text-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={RESUME.href}
              download={RESUME.file}
              className="nav-link text-accent no-underline transition-opacity hover:opacity-80"
            >
              resume ↓
            </a>
          </div>

          <span aria-hidden="true" className="h-[14px] w-px bg-line" />

          <ThemeToggle />

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="font-mono text-[13px] text-muted transition-colors hover:text-accent sm:hidden"
          >
            {open ? "close" : "menu"}
          </button>
        </div>

        {/* phone menu: the island makes room first, then the rows settle in */}
        <div className="island-panel sm:hidden" aria-hidden={!open}>
          <div>
            <div className="island-rows border-t border-line px-[18px] pb-2 pt-1">
              {LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? undefined : -1}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between border-b border-line/60 py-[13px] font-mono text-[14px] no-underline last:border-0 ${
                      active ? "text-accent" : "text-tag"
                    }`}
                  >
                    <span className="flex items-center gap-[11px]">
                      <span
                        aria-hidden="true"
                        className={`h-[5px] w-[5px] rounded-full ${
                          active ? "bg-accent" : "bg-line"
                        }`}
                      />
                      {l.label}
                    </span>
                    <span aria-hidden="true" className="text-muted">
                      →
                    </span>
                  </Link>
                );
              })}
              <a
                href={RESUME.href}
                download={RESUME.file}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-center justify-between py-[13px] font-mono text-[14px] text-accent no-underline"
              >
                <span className="flex items-center gap-[11px]">
                  <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-accent" />
                  resume
                </span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
