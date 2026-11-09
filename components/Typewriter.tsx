"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1700;

/**
 * Types each line out, holds it, deletes it, and moves to the next, with a
 * blinking caret. The first line is rendered in full on the server and held
 * first, so the page doesn't shift and search engines read a real title.
 * Screen readers get the first line as plain text; with reduced motion the
 * first line simply stays.
 */
export default function Typewriter({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(lines[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (lines.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const full = lines[index];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && text === full) delay = HOLD_MS;

    const t = setTimeout(() => {
      if (!deleting && text === full) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % lines.length);
      } else if (deleting) {
        setText(full.slice(0, text.length - 1));
      } else {
        setText(full.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [lines, index, text, deleting]);

  return (
    <>
      <span className="sr-only">{lines[0]}</span>
      <span aria-hidden="true">
        {text}
        <span className="tw-caret" />
      </span>
    </>
  );
}
