"use client";

import { useEffect, useRef, useState } from "react";

/*
 * My face at the centre of the Venn, which notices you. Five frames of one
 * drawing (me-faces.webp, side by side: neutral, eyes left, eyes right, a
 * slight smile, a happy one) - the head and hair never move, only the eyes
 * and mouth. The eyes follow a mouse to the left or right, pointing at me
 * gets the smile, a click or tap gets the happy face for a moment, and when
 * nobody is moving the mouse I glance around now and then.
 *
 * Without JavaScript it's the neutral frame. With reduced motion there are no
 * idle glances; it still reacts to you.
 */

const NEUTRAL = 0;
const LEFT = 1;
const RIGHT = 2;
const SMILE = 3;
const HAPPY = 4;
const FRAMES = 5;

const LOOK = 70; // px the pointer must be off-centre before the eyes follow
const HAPPY_MS = 1400;
const IDLE_MS = 4000; // no mouse movement for this long counts as idle
const GLANCE_EVERY = 7000;

export default function VennFace({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [gaze, setGaze] = useState(NEUTRAL);
  const [hover, setHover] = useState(false);
  const [happy, setHappy] = useState(false);
  const happyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    let inView = false;
    let lastMove = 0;
    let frame = 0;
    let x = 0;

    // the eyes follow the mouse, read once per animation frame
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !inView) return;
      lastMove = performance.now();
      x = e.clientX;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const dx = x - (r.left + r.width / 2);
        setGaze(dx < -LOOK ? LEFT : dx > LOOK ? RIGHT : NEUTRAL);
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });

    // left alone, I look around: left, right, back
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glance = still
      ? undefined
      : window.setInterval(() => {
          if (!inView || performance.now() - lastMove < IDLE_MS) return;
          setGaze(LEFT);
          timers.push(window.setTimeout(() => setGaze(RIGHT), 650));
          timers.push(window.setTimeout(() => setGaze(NEUTRAL), 1300));
        }, GLANCE_EVERY);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      window.clearInterval(glance);
      timers.forEach(window.clearTimeout);
      window.clearTimeout(happyTimer.current);
    };
  }, []);

  const cheer = () => {
    setHappy(true);
    window.clearTimeout(happyTimer.current);
    happyTimer.current = window.setTimeout(() => setHappy(false), HAPPY_MS);
  };

  const face = happy ? HAPPY : hover ? SMILE : gaze;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Bammidi Govinda Rao, cartoon portrait"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerDown={cheer}
      className={`bg-white bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url(/me-faces.webp)",
        backgroundSize: `${FRAMES * 100}% 100%`,
        backgroundPosition: `${(face / (FRAMES - 1)) * 100}% 0`,
      }}
    />
  );
}
