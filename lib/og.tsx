import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Try to load Inter (the site's one typeface) for the OG card; fall back to
 * the default font if Google Fonts is unreachable at build time.
 */
async function loadInter(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Inter:wght@600",
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function ogCard({
  title,
  kicker,
  foot = "engineering journal",
}: {
  title: string;
  kicker: string;
  /** the line after the author's name, bottom right */
  foot?: string;
}) {
  const inter = await loadInter();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f4f1e8",
          backgroundImage: "radial-gradient(#d8d2c0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          color: "#1a1813",
          fontFamily: inter ? "Inter" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontSize: 24,
            color: "#111111",
          }}
        >
          <div style={{ width: 44, height: 2, background: "#111111" }} />
          {kicker}
        </div>

        <div
          style={{
            fontSize: title.length > 70 ? 56 : 66,
            fontWeight: 500,
            lineHeight: 1.12,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#6b6557",
          }}
        >
          <span>
            govind<span style={{ color: "#111111" }}>.</span>dev
          </span>
          <span>
            {site.author} · {foot}
          </span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: inter
        ? [{ name: "Inter", data: inter, style: "normal" as const, weight: 600 as const }]
        : undefined,
    },
  );
}
