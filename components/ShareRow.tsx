"use client";

import { useState } from "react";

export default function ShareRow({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing sensible to do
    }
  }

  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="my-10 flex items-center gap-3 border-y border-line py-5">
      <span className="font-mono text-[12px] text-muted">
        Send this as proof →
      </span>
      <button
        type="button"
        onClick={copy}
        className="glass-chip rounded-full px-[15px] py-2 font-mono text-[12.5px] text-tag hover:text-accent"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={linkedinShare}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-chip rounded-full px-[15px] py-2 font-mono text-[12.5px] text-tag no-underline hover:text-accent"
      >
        Share on LinkedIn
      </a>
    </div>
  );
}
