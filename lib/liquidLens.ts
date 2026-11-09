"use client";

import { useEffect, type RefObject } from "react";

/*
 * Liquid Glass lens, from the Roots app's tab bar: the rim of a floating
 * control bends whatever passes underneath it, the way the edge of a glass
 * bead does.
 *
 * An SVG displacement map, drawn at the element's own size and corner
 * radius (so a wide capsule's ends stay round, not stretched), used as a
 * backdrop-filter. Only Chromium applies SVG filters to the backdrop, so
 * everywhere else — and for anyone who has asked for less transparency or
 * more contrast — the element keeps the plain frost from globals.css.
 *
 * Note: a backdrop-filter only sees up to the nearest "backdrop root"
 * ancestor. An ancestor with a view-transition-name, filter, opacity < 1 or
 * mask is one, and cuts the page off from the blur entirely — keep those off
 * the element's ancestors.
 */

const NS = "http://www.w3.org/2000/svg";
let defs: SVGDefsElement | null = null;
let seq = 0;

function lensSupported() {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  // iOS browsers say CriOS/EdgiOS, not Chrome/, and are WebKit underneath
  if (!/\bChrome\/\d+/.test(navigator.userAgent)) return false;
  if (!CSS.supports("backdrop-filter", "url(#a) blur(1px)")) return false;
  const mq = (q: string) => window.matchMedia?.(q).matches;
  return !mq("(prefers-reduced-transparency: reduce)") && !mq("(prefers-contrast: more)");
}

function defsEl() {
  if (defs?.isConnected) return defs;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  defs = document.createElementNS(NS, "defs");
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

/**
 * Displacement map for a w×h rounded rectangle with corner radius r. Within
 * `bezel` px of the edge each pixel samples from further in, along the edge
 * normal, most strongly at the rim — a convex lens. The middle is left
 * alone (128 = no shift), so the links stay sharp.
 */
function lensField(w: number, h: number, r: number, bezel: number) {
  const out = new Uint8ClampedArray(w * h * 4);
  const hw = w / 2;
  const hh = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r);
      const qy = Math.abs(py) - (hh - r);
      const depth = qx > 0 && qy > 0 ? r - Math.hypot(qx, qy) : -Math.max(qx, qy) + r;
      let dx = 0;
      let dy = 0;
      if (depth < bezel) {
        let nx: number;
        let ny: number;
        if (qx > 0 && qy > 0) {
          const len = Math.hypot(qx, qy) || 1;
          nx = qx / len;
          ny = qy / len;
        } else if (qx > qy) {
          nx = 1;
          ny = 0;
        } else {
          nx = 0;
          ny = 1;
        }
        nx *= Math.sign(px) || 1;
        ny *= Math.sign(py) || 1;
        const t = 1 - Math.max(depth, 0) / bezel;
        const m = t * t;
        dx = -nx * m;
        dy = -ny * m;
      }
      const i = (y * w + x) * 4;
      out[i] = 128 + dx * 127;
      out[i + 1] = 128 + dy * 127;
      out[i + 2] = 128;
      out[i + 3] = 255;
    }
  }
  return out;
}

function mapUrl(w: number, h: number, r: number, bezel: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.putImageData(new ImageData(lensField(w, h, r, bezel), w, h), 0, 0);
  return canvas.toDataURL();
}

function attrs<T extends Element>(el: T, values: Record<string, string | number>) {
  for (const [k, v] of Object.entries(values)) el.setAttribute(k, String(v));
  return el;
}

/**
 * Give the element behind `ref` a refracting rim.
 *   bezel — how far in from the edge the bending reaches, px
 *   shift — the most a pixel at the rim is pulled, px
 *   frost — the blur (and tint) applied before the bend
 *
 * The frost goes FIRST in the chain: in Chrome, a blur placed after the
 * url() lens is dropped, and the page shows through bent but sharp — the
 * "I can read the text behind it" bug. Blurred first, then bent, it reads as
 * frosted glass with a curved rim.
 */
export function useLiquidLens(
  ref: RefObject<HTMLElement | null>,
  { bezel = 14, shift = 12, frost = "blur(10px) saturate(185%) brightness(1.05)" } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !lensSupported()) return;

    const id = `liquid-lens-${++seq}`;
    const filter = attrs(document.createElementNS(NS, "filter"), {
      id,
      x: 0,
      y: 0,
      filterUnits: "userSpaceOnUse",
      primitiveUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });
    const image = attrs(document.createElementNS(NS, "feImage"), {
      x: 0,
      y: 0,
      preserveAspectRatio: "none",
      result: "map",
    });
    const displace = attrs(document.createElementNS(NS, "feDisplacementMap"), {
      in: "SourceGraphic",
      in2: "map",
      scale: shift * 2,
      xChannelSelector: "R",
      yChannelSelector: "G",
    });
    filter.append(image, displace);
    defsEl().appendChild(filter);

    let size = "";
    const build = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h || `${w}x${h}` === size) return;
      size = `${w}x${h}`;
      const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      const url = mapUrl(w, h, radius, Math.min(bezel, radius || bezel));
      if (!url) return;
      attrs(filter, { width: w, height: h });
      attrs(image, { width: w, height: h, href: url });
      el.style.backdropFilter = `${frost} url(#${id})`;
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);

    return () => {
      ro.disconnect();
      filter.remove();
      el.style.backdropFilter = "";
    };
  }, [ref, bezel, shift, frost]);
}
