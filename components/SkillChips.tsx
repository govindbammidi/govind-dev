import {
  siCss,
  siDigitalocean,
  siDocker,
  siExpress,
  siFirebase,
  siGit,
  siGithubactions,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPython,
  siRazorpay,
  siReact,
  siReactrouter,
  siTailwindcss,
  siTypescript,
  siVite,
  siVitest,
  type SimpleIcon,
} from "simple-icons";

/*
 * Skills as a cloud of chips, each with the tool's own mark. The marks are
 * Simple Icons paths, inlined at build time - no requests, no client JS.
 * Tools without a mark (SQL, REST, Playwright) get a plain glyph.
 */

type Skill = { name: string; icon?: SimpleIcon; glyph?: "db" | "api" | "test" };

const SKILLS: Skill[] = [
  { name: "TypeScript", icon: siTypescript },
  { name: "JavaScript", icon: siJavascript },
  { name: "Python", icon: siPython },
  { name: "SQL", glyph: "db" },
  { name: "HTML", icon: siHtml5 },
  { name: "CSS", icon: siCss },
  { name: "React", icon: siReact },
  { name: "React Router", icon: siReactrouter },
  { name: "Vite", icon: siVite },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Express.js", icon: siExpress },
  { name: "REST APIs", glyph: "api" },
  { name: "JWT", icon: siJsonwebtokens },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "Firebase", icon: siFirebase },
  { name: "Razorpay", icon: siRazorpay },
  { name: "Docker", icon: siDocker },
  { name: "Nginx", icon: siNginx },
  { name: "GitHub Actions", icon: siGithubactions },
  { name: "DigitalOcean", icon: siDigitalocean },
  { name: "Git", icon: siGit },
  { name: "Vitest", icon: siVitest },
  { name: "Playwright", glyph: "test" },
];

/** A near-black mark would vanish on the dark theme: those take the text colour. */
function markColor(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.2 ? "currentColor" : `#${hex}`;
}

// outline glyphs (Lucide, ISC) for tools that have no brand mark
const GLYPHS = {
  db: ["M3 5a9 3 0 1 0 18 0a9 3 0 1 0 -18 0", "M3 5V19A9 3 0 0 0 21 19V5", "M3 12A9 3 0 0 0 21 12"],
  api: ["m16 18 6-6-6-6", "m8 6-6 6 6 6"],
  test: [
    "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",
    "M8.5 2h7",
    "M7 16h10",
  ],
};

export default function SkillChips() {
  return (
    <ul className="flex flex-wrap gap-2">
      {SKILLS.map((s) => (
        <li
          key={s.name}
          className="glass-chip flex items-center gap-[7px] rounded-lg px-[10px] py-[6px] text-[14px] text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
            {s.icon ? (
              <path d={s.icon.path} fill={markColor(s.icon.hex)} />
            ) : (
              <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                {GLYPHS[s.glyph ?? "api"].map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            )}
          </svg>
          {s.name}
        </li>
      ))}
    </ul>
  );
}
