"use client";

let fadeTimer: ReturnType<typeof setTimeout> | undefined;

// how long the new theme takes to spread across the screen
const REVEAL_MS = 500;

export default function ThemeToggle() {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode - theme just won't persist */
      }
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || still) {
      // no view transitions (or asked for less motion): colors settle into
      // the new theme instead of snapping (see .theme-fade in globals.css)
      root.classList.add("theme-fade");
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => root.classList.remove("theme-fade"), 450);
      apply();
      return;
    }

    // The new theme grows out of this button in a circle, wide enough to
    // reach the farthest corner of the screen
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.dataset.themeSwitch = "";
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
          { duration: REVEAL_MS, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        /* transition skipped (e.g. tab hidden) - the theme still applied */
      });
    transition.finished.finally(() => {
      delete root.dataset.themeSwitch;
    });
  };

  // Both icons render always, stacked in one grid cell; CSS cross-fades and
  // counter-rotates them per theme. Identical DOM on server and client, so
  // no hydration mismatch.
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="grid place-items-center text-muted transition-colors hover:text-accent"
    >
      {/* moon - shown in light mode */}
      <svg
        className="col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-settle dark:-rotate-90 dark:scale-50 dark:opacity-0"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* sun - shown in dark mode */}
      <svg
        className="col-start-1 row-start-1 -rotate-90 scale-50 opacity-0 transition-[opacity,transform] duration-300 ease-settle dark:rotate-0 dark:scale-100 dark:opacity-100"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    </button>
  );
}
