import Link from "next/link";
import { siGithub } from "simple-icons";
import { site } from "@/lib/site";

/*
 * Round icon buttons for the places to find me. Each has its name as a
 * tooltip and for screen readers; the email one shows the address, since
 * recruiters copy it more often than they click it.
 */

const ring =
  "glass-chip grid h-10 w-10 place-items-center rounded-full text-ink no-underline transition-transform hover:-translate-y-[1px]";

function Brand({ path }: { path: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} fill="currentColor" />
    </svg>
  );
}

const pill =
  "glass-chip inline-flex items-center gap-[7px] rounded-full px-[12px] py-[5px] text-[13px] font-medium text-ink no-underline transition-transform hover:-translate-y-[1px]";

/** Two small asks under the name: book a call, or write to me. */
export function HeroAsks({ className = "" }: { className?: string }) {
  const external = site.booking.startsWith("http");
  const call = (
    <>
      {/* video camera (Lucide, ISC) */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </svg>
      Book a call
    </>
  );
  return (
    <div className={`flex-wrap gap-2 ${className}`}>
      {external ? (
        <a href={site.booking} target="_blank" rel="noopener noreferrer" className={pill}>
          {call}
        </a>
      ) : (
        <Link href={site.booking} className={pill}>
          {call}
        </Link>
      )}
      <a href={`mailto:${site.email}`} title={site.email} className={pill}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Send an email
      </a>
    </div>
  );
}

export default function HeroLinks() {
  return (
    <div className="flex items-center gap-2">
      <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className={ring}>
        <Brand path={siGithub.path} />
      </a>
      <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className={ring}>
        {/* LinkedIn's mark isn't in Simple Icons; this is the outline "in" (Lucide, ISC) */}
        <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
      <a href={site.medium} target="_blank" rel="noopener noreferrer" aria-label="Medium" title="Medium" className={ring}>
        {/* Medium's classic mark - three ellipses - stays legible at icon size,
            where the current wordmark-style logo turns to mush */}
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <ellipse cx="6.8" cy="12" rx="6.8" ry="6.8" />
          <ellipse cx="17.6" cy="12" rx="3.4" ry="6.4" />
          <ellipse cx="22.6" cy="12" rx="1.2" ry="5.7" />
        </svg>
      </a>
      <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} title={site.email} className={ring}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
    </div>
  );
}
