import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // a stray package-lock.json in the user folder made Turbopack pick that as
  // the workspace root, and then modules like @vercel/analytics didn't resolve
  turbopack: { root: __dirname },
  // React <ViewTransition> on route changes (globals.css: .page-swap)
  experimental: { viewTransition: true },
  async redirects() {
    return [
      {
        // the home page is the resume now; keep links sent out to /resume alive
        source: "/resume",
        destination: "/",
        permanent: false,
      },
      {
        // post renamed: framing changed from "i gave the AI the answer" to the
        // length-checked-a-dropdown angle. keep the old shared link alive.
        source: "/journal/i-gave-the-ai-the-answer-it-still-guarded-the-wrong-thing",
        destination: "/journal/the-ai-length-checked-a-dropdown",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
