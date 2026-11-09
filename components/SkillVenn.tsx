import Link from "next/link";
import Me from "@/components/Me";

/*
 * Four overlapping circles - the four kinds of work I do - with me where they
 * meet, then an invitation to talk. Plain SVG for the circles and labels, so
 * it scales with the column; the photo and the "hi" bubble sit on top.
 */

const W = 680;
const H = 700;
const CX = W / 2;
const CY = H / 2;
const R = 190; // each circle
const OFF = 145; // how far each circle's centre sits from the middle
const LABEL = 100; // how far a label sits out from its circle's centre

const AREAS = [
  // two short lines each, so a label still fits when the orbit carries it to the side
  { label: ["Backend &", "Databases"], dx: 0, dy: -1 },
  { label: ["Frontend", "Engineering"], dx: -1, dy: 0 },
  { label: ["Product", "Thinking"], dx: 1, dy: 0 },
  { label: ["Shipping &", "DevOps"], dx: 0, dy: 1 },
];

export default function SkillVenn() {
  return (
    <div className="text-center">
      <div className="relative mx-auto aspect-[680/700] w-full max-w-[560px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Where my work overlaps: backend and databases, frontend engineering, product thinking, and shipping and DevOps"
        >
          {/* a soft light where the four meet, behind me */}
          <circle cx={CX} cy={CY} r={120} className="venn-glow" />
          {/* each area is its ring and its label, so hovering one lights both;
              --i staggers the drawing-in (see .venn-* in globals.css).
              The four slowly orbit me; the labels turn back so they stay upright. */}
          <g className="venn-orbit">
          {AREAS.map((a, i) => {
            const x = CX + a.dx * (OFF + LABEL);
            const y = CY + a.dy * (OFF + LABEL);
            return (
              <g key={a.label.join(" ")} className="venn-area" style={{ "--i": i } as React.CSSProperties}>
                <circle cx={CX + a.dx * OFF} cy={CY + a.dy * OFF} r={R} pathLength={1} className="venn-ring" />
                <text x={x} y={y} textAnchor="middle" className="venn-label">
                  {a.label.map((line, j) => (
                    <tspan key={line} x={x} dy={j === 0 ? `${-(a.label.length - 1) * 0.6 + 0.35}em` : "1.2em"}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
          </g>
        </svg>

        {/* me, where the four meet */}
        <div className="venn-me absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Me size={112} className="h-[clamp(72px,16vw,112px)] w-[clamp(72px,16vw,112px)] rounded-full ring-1 ring-line" />
          <span className="venn-hi absolute -bottom-2 -right-6 rounded-full bg-accent px-[11px] py-[3px] text-[14px] font-semibold text-paper shadow-md">
            hi
          </span>
        </div>
      </div>

      <p className="mt-6 text-[clamp(1.1rem,0.95rem+0.8vw,1.4rem)] text-ink">
        Read this far? Then something here fits. Let&apos;s talk.
      </p>
      <Link
        href="/contact"
        className="glass-chip mt-5 inline-flex items-center gap-2 rounded-full py-[6px] pl-[6px] pr-[16px] text-[15px] font-semibold text-ink no-underline"
      >
        <Me size={28} small alt="" className="h-7 w-7 rounded-full" />
        Get in touch
      </Link>
    </div>
  );
}
