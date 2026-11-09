"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { markMoving, useLiquidLens } from "@/lib/liquidLens";

// about, the project archive, the journal and contact. Experience lives on the
// home page itself, so it needs no link of its own; the PDF is the hero's
// "Download resume" button.
const LINKS = [
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/journal", label: "journal" },
  { href: "/contact", label: "contact" },
];

const sectionOf = (href: string) => (href.startsWith("/#") ? href.slice(2) : null);

/**
 * The nav as a floating island of liquid glass: a capsule over the page, after
 * the Dynamic Island. On a phone it grows into a card to hold the menu and
 * folds back when a row is tapped, the page is tapped, or the page scrolls.
 * The material lives in globals.css (`.island`, `.nav-thumb`).
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
  const activeHref = LINKS.find((l) => isActive(l.href))?.href ?? null;

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

  // the thumb: a white pill that slides under the current desktop link. it is
  // placed by measuring the link, not by state, so a font swap or a resize
  // just re-measures without a render
  // the Roots tab bar's bending rim (Chromium; elsewhere the CSS frost)
  const islandRef = useRef<HTMLDivElement>(null);
  // a full 10px frost under the bend: the island holds words, and words
  // behind it must never compete with the links
  useLiquidLens(islandRef, { bezel: 14, shift: 12 });

  const rowRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  // while it slides the thumb is a clear lens over the links (see GlassTabs)
  useLiquidLens(thumbRef, { bezel: 12, shift: 9, cssVar: "--thumb-lens" });
  useEffect(() => {
    const row = rowRef.current;
    const thumb = thumbRef.current;
    if (!row || !thumb) return;
    const place = () => {
      const el = activeHref
        ? row.querySelector<HTMLElement>(`a[href="${activeHref}"]`)
        : null;
      if (!el) {
        thumb.removeAttribute("data-on");
        return;
      }
      const left = `${el.offsetLeft}px`;
      if (thumb.hasAttribute("data-on") && thumb.style.left !== left) markMoving(thumb);
      thumb.style.left = left;
      thumb.style.width = `${el.offsetWidth}px`;
      thumb.setAttribute("data-on", "");
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(row);
    return () => ro.disconnect();
  }, [activeHref]);

  return (
    <nav
      aria-label="Site"
      className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4"
    >
      {/* frosted scrim over the page while the menu is open. it's also the
          tap-outside target, since `close` moves as the island re-centres */}
      <button
        type="button"
        aria-hidden={!open}
        aria-label="Close menu"
        tabIndex={-1}
        data-open={open || undefined}
        onClick={() => setOpen(false)}
        className="island-scrim fixed inset-0 -z-10 cursor-default sm:hidden"
      />
      <div
        ref={islandRef}
        // anchored through route transitions: the content moves, the island
        // doesn't. The name sits on the island, not on <nav>: an element with
        // a view-transition-name is a backdrop root, so on <nav> it cut the
        // page off from the island's blur and the text behind read through
        style={{ viewTransitionName: "site-nav" }}
        className="island pointer-events-auto"
        data-open={open || undefined}
      >
        <div className="flex h-[44px] items-center gap-[14px] pl-[18px] pr-[14px]">
          <Link
            href="/"
            // already home: a link to the same page would only run the page
            // transition (and flash the island see-through) without moving,
            // so go back up to the top instead
            onClick={(e) => {
              setOpen(false);
              if (pathname !== "/") return;
              e.preventDefault();
              const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
              if (window.location.hash) history.replaceState(null, "", "/");
            }}
            className="group font-mono text-[13.5px] font-medium tracking-[-0.3px] text-ink no-underline"
          >
            govind
            <b className="inline-block text-mark transition-transform duration-300 ease-settle group-hover:-translate-y-[3px]">
              .
            </b>
            dev
          </Link>

          <div
            ref={rowRef}
            className="relative hidden items-center gap-[2px] font-mono text-[13px] sm:flex"
          >
            <span ref={thumbRef} aria-hidden="true" className="nav-thumb" />
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? (sectionOf(l.href) ? "location" : "page") : undefined}
                className={`nav-link rounded-full px-[10px] py-[5px] no-underline transition-colors hover:text-accent ${
                  isActive(l.href) ? "text-accent" : "text-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
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
