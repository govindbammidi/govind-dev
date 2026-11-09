"use client";

import { useEffect, useRef } from "react";

/**
 * The refraction behind the island: an SVG displacement map that bends the
 * backdrop inward at the rim, the way thick glass does. The map is drawn once
 * on a canvas — neutral grey in the middle, vectors pointing at the centre
 * along a rounded-rectangle edge — and handed to feDisplacementMap. The
 * filter region follows the element's box, so one map serves the capsule
 * closed and open.
 *
 * Chromium reads url() filters in backdrop-filter; other engines keep the
 * plain blur. The html[data-lens] flag turns the CSS on only after the map
 * exists, so nothing ever points at an empty filter.
 */
export default function LiquidLens() {
  const imgRef = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const fe = imgRef.current;
    if (!fe || !CSS.supports("backdrop-filter", 'url("#liquid-lens")')) return;

    const w = 256;
    const h = 96;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = ((x + 0.5) / w) * 2 - 1;
        const ny = ((y + 0.5) / h) * 2 - 1;
        // superellipse distance, so the rim follows the capsule's rounded ends
        const d = Math.pow(Math.abs(nx) ** 4 + Math.abs(ny) ** 4, 0.25);
        const t = Math.min(1, Math.max(0, (d - 0.55) / 0.45));
        const edge = t * t * (3 - 2 * t);
        const i = (y * w + x) * 4;
        // 128 is "no displacement"; below it samples toward the centre
        img.data[i] = Math.round(128 - nx * edge * 127);
        img.data[i + 1] = Math.round(128 - ny * edge * 127);
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    fe.setAttribute("href", canvas.toDataURL("image/png"));
    document.documentElement.setAttribute("data-lens", "");
    return () => document.documentElement.removeAttribute("data-lens");
  }, []);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <filter
        id="liquid-lens"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1"
        height="1"
        colorInterpolationFilters="sRGB"
      >
        {/* no size: a primitive defaults to the whole filter region, so the
            map stretches to whatever box the island currently has */}
        <feImage ref={imgRef} preserveAspectRatio="none" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="18"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
