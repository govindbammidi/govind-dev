import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import JournalCards from "@/components/JournalCards";
import { mediumUrlsBySlug } from "@/lib/medium";
import { getAllPosts, toMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from shipping a real product: the practices I fought, the incidents I survived, and the lessons that only made sense later.",
};

export default async function JournalPage() {
  const posts = getAllPosts().map(toMeta);
  const medium = await mediumUrlsBySlug(posts);

  return (
    <>
      <header className="pb-8 pt-[64px]">
        <div className="mx-auto max-w-[760px] px-7">
          <Link
            href="/"
            className="rise glass-chip mb-6 inline-block rounded-full px-[14px] py-[6px] text-[13px] text-ink no-underline"
          >
            ← home
          </Link>
          <h1 className="rise rise-1 font-display text-[clamp(1.9rem,1.5rem+1.6vw,2.6rem)] leading-[1.1]">
            Journal
          </h1>
          <p className="rise rise-2 mt-3 text-[17px] text-muted">
            Notes from shipping a real product, written down as I learn.
          </p>
        </div>
      </header>

      <section className="pb-16">
        <div className="mx-auto max-w-[760px] px-7">
          <JournalCards posts={posts} medium={medium} />
        </div>
      </section>

      <Footer />
    </>
  );
}
