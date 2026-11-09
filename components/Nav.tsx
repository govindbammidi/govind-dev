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

const sectionOf = (href: string) => (href.startsWith("/#") ? href.slice(2) : null);

/**
 * The nav as a floating island: a black capsule over the page, after the
 * Dynamic Island. On a phone it grows into a card to hold the menu and
 * shrinks back when a row is tapped. The material lives in globals.css
 * (`.island`), which also gives it its own light-on-black palette.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // the home section under the reading line, so /#experience and /#projects
  // light up as you scroll past them (a pathname never matches a hash)
  const [section, setSection] = useState<string | null>(null);
  // off the home page the observer is gone, so whatever it last saw is stale
  const here = pathname === "/" ? section : null;

  const isActive = (href: string) => {
    const id = sectionOf(href);
    if (id) return here === id;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries.find((e) => e.isIntersecting);
        if (entering) {
          setSection(entering.target.id);
          return;
        }
        // left a section without entering another: back up in the hero
        setSection((cur) => (entries.some((e) => e.target.id === cur) ? null : cur));
      },
      // a thin band a third of the way down the viewport: whichever section
      // crosses it is where the reader is
      { rootMargin: "-30% 0px -65% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // the island dismisses the way a sheet does: Escape, or scrolling away.
  // the menu is for choosing, not for reading past, so once the page moves
  // more than a nudge it folds back into the pill
  useEffect(() => {
    if (!open) return;
    const startY = window.scrollY;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 24) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
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
                aria-current={isActive(l.href) ? (sectionOf(l.href) ? "location" : "page") : undefined}
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

          {/* ml-auto: when the island widens for the menu, the controls stay
              in the right corner, under the thumb */}
          <span aria-hidden="true" className="ml-auto h-[14px] w-px bg-line" />

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

        {/* phone menu: the island makes room first, then the rows settle in.
            the dot marks where you are; the chevron just says "goes somewhere" */}
        <div className="island-panel sm:hidden" aria-hidden={!open}>
          <div>
            <div className="island-rows border-t border-line px-[18px] pb-[5px] pt-[3px]">
              {LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? undefined : -1}
                    aria-current={active ? (sectionOf(l.href) ? "location" : "page") : undefined}
                    className={`flex items-center justify-between border-b border-line/60 py-[10px] font-mono text-[13px] no-underline last:border-0 ${
                      active ? "text-accent" : "text-tag"
                    }`}
                  >
                    <span className="flex items-center gap-[10px]">
                      <Dot lit={active} />
                      {l.label}
                    </span>
                    <Chevron />
                  </Link>
                );
              })}
              <a
                href={RESUME.href}
                download={RESUME.file}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-center justify-between py-[10px] font-mono text-[13px] text-accent no-underline"
              >
                <span className="flex items-center gap-[10px]">
                  <Dot lit={false} />
                  resume
                </span>
                <ArrowDown />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Dot({ lit }: { lit: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-[5px] w-[5px] rounded-full transition-colors duration-300 ${
        lit ? "bg-accent" : "bg-line"
      }`}
    />
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" width="6" height="10" viewBox="0 0 6 10" fill="none" className="text-muted">
      <path
        d="M1 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M5 1v8M1.5 5.5L5 9l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
