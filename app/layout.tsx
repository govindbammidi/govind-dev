import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// body text: Inter, a screen face with open letters and even strokes, so a
// long journal entry reads without strain (the old high-contrast newspaper
// serif went faint at reading sizes). opsz keeps it crisp at body sizes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// the homepage tab and link-preview title — every other page fills the template
const homeTitle = `${site.title} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: homeTitle,
    template: "%s — Govind",
  },
  description: site.description,
  authors: [{ name: site.author, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: homeTitle,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: site.description,
  },
  alternates: {
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1e" },
  ],
};

// Runs synchronously during HTML parsing, before first paint — no theme flash.
// Stored preference wins; otherwise follow the OS setting.
//
// It also tracks input modality. Focus rings are for keyboard users, but
// Chromium keeps :focus-visible on the link you *clicked* once a client-side
// navigation lands, which paints a stray rust box around a nav item. Flagging
// pointer input lets the CSS hide the ring for the mouse and keep it for Tab.
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(!t)t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}
var d=document.documentElement;
document.addEventListener("pointerdown",function(){d.setAttribute("data-pointer","")},true);
document.addEventListener("keydown",function(e){if(e.key==="Tab")d.removeAttribute("data-pointer")},true);})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Nav />
        {/* the island floats, so the page starts below it; route changes
            crossfade through the .page-swap rules in globals.css */}
        <ViewTransition default="page-swap">
          <div className="flex-1 pt-[64px]">{children}</div>
        </ViewTransition>
        <Analytics />
      </body>
    </html>
  );
}
