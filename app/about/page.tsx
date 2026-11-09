import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "I learned engineering by building, not by grinding. The path, the startup, the mentors, the AI-era learning.",
};

const VALUES = [
  "learning by building",
  "honesty about mistakes",
  "respecting experienced people",
  "continuous improvement",
  "ownership",
  "curiosity",
  "practical engineering",
  "product thinking",
  "long-term thinking",
];

export default function AboutPage() {
  return (
    <>
      <header className="border-b border-line pb-11 pt-[72px]">
        <div className="mx-auto max-w-[700px] px-7">
          <p className="kicker rise mb-5">About</p>
          <h1 className="rise rise-1 font-display text-display font-medium leading-[1.03] tracking-[-1.2px]">
            I learned engineering by{" "}
            <em className="italic text-accent">building</em>, not by grinding.
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[700px] px-7 text-[20px] leading-[1.7]">
        <div className="py-11">
          <p className="mb-5 text-body">
            I&apos;m Govind. I joined an early-stage startup as a 4th-year
            BTech intern and started shipping production code almost
            immediately. I came from a normal tier-3 college. I graduated with
            a gold medal, but I&apos;ve never thought of that as my real
            achievement.
          </p>
          <p className="mb-5 text-body">My actual growth started after I joined.</p>

          <h2 className="mb-4 mt-[38px] font-display text-[27px] font-medium tracking-[-0.5px]">
            The path I didn&apos;t take
          </h2>
          <p className="mb-5 text-body">
            I&apos;m not the developer who spent years grinding interview
            questions. When I joined, I had basic programming knowledge and
            some full-stack fundamentals, but almost no production experience.
          </p>
          <p className="mb-5 text-body">
            The product wasn&apos;t mature. The company wasn&apos;t mature.
            The processes weren&apos;t mature. We were figuring things out
            while building - no perfect roadmap, no certainty about where the
            product would end up. We learned from users and evolved.
          </p>

          <h2 className="mb-4 mt-[38px] font-display text-[27px] font-medium tracking-[-0.5px]">
            Learning during the AI era
          </h2>
          <p className="mb-5 text-body">
            I entered software during the rise of AI-assisted development. A
            lot of the early work involved tools like Gemini and Claude. But I
            never blindly accepted what they produced.
          </p>
          <p className="mb-5 text-body">
            I worked under engineers with more than a decade of experience who
            reviewed everything carefully. They rejected my PRs. They asked me
            why. They made me defend my choices.
          </p>
          <p className="pull text-[26px]">
            Many of my most valuable lessons came from things I first
            disagreed with - until months later a real need proved they
            mattered.
          </p>
          <p className="mb-5 text-body">
            Ex: extracting strings into constants. Design consistency. Writing
            tests. Naming conventions. Feature gating. I learned the value of
            each one long after I&apos;d argued against it.
          </p>

          <h2 className="mb-4 mt-[38px] font-display text-[27px] font-medium tracking-[-0.5px]">
            What I actually learned
          </h2>
          <p className="mb-5 text-body">
            I learned software engineering by shipping, debugging,
            maintaining, and improving a real SaaS system. I learned from
            mentors. From mistakes. From customers. From testers. From
            production incidents. From building.
          </p>
          <p className="text-body">
            Good engineering optimises for the change you can&apos;t see
            coming, not just the task in front of you. That&apos;s the lesson
            under almost everything I write here.
          </p>
        </div>

        <div className="border-t border-line pb-[50px] pt-9">
          <p className="mb-6 font-mono text-[12px] uppercase tracking-[1.5px] text-muted">
            What I care about
          </p>
          <div className="flex flex-wrap gap-[10px]">
            {VALUES.map((v) => (
              <span
                key={v}
                className="glass-chip rounded-full px-[15px] py-2 font-mono text-[13px] text-tag"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
