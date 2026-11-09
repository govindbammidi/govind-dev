import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Footer from "@/components/Footer";
import Me from "@/components/Me";
import ShareRow from "@/components/ShareRow";
import { mdxComponents } from "@/components/mdx";
import { formatDate, getAdjacentPosts, getAllPosts, getPost } from "@/lib/posts";
import { mediumUrlFor } from "@/lib/medium";
import { site } from "@/lib/site";

const AUTHOR = "Bammidi Govinda Rao";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${site.url}/journal/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${site.url}/rss.xml` },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url,
      publishedTime: post.date,
      authors: [site.author],
      tags: [post.tag],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const seriesParts = post.series
    ? getAllPosts()
        .filter((p) => p.series === post.series)
        .sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
    : [];
  const url = `${site.url}/journal/${post.slug}`;
  const mediumUrl = await mediumUrlFor(post.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    url,
    author: {
      "@type": "Person",
      name: site.author,
      url: site.url,
    },
    keywords: post.tag,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* how far into the entry you've read */}
      <div className="read-progress" aria-hidden="true" />

      <div className="mx-auto max-w-[680px] px-7">
        {/* back to the list, and the Medium copy when there is one */}
        <div className="rise mt-[34px] flex items-center justify-between gap-3">
          <Link
            href="/journal"
            className="glass-chip rounded-full px-[14px] py-[6px] text-[13px] text-ink no-underline"
          >
            ← all entries
          </Link>
          {mediumUrl && (
            <a
              href={mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-chip rounded-full px-[14px] py-[6px] text-[13px] text-muted no-underline hover:text-ink"
            >
              Original on Medium ↗
            </a>
          )}
        </div>

        <article className="pb-[10px] pt-[30px]">
          <div className="rise mb-4 flex flex-wrap items-center gap-x-[12px] gap-y-1 text-[12.5px] uppercase tracking-[0.8px] text-muted">
            <span className="text-accent">{post.tag}</span>
          </div>

          <h1 className="rise rise-1 mb-4 font-display text-title leading-[1.08]">
            {post.title}
          </h1>
          <p className="rise rise-1 mb-7 text-[19px] italic leading-[1.55] text-muted">
            {post.summary}
          </p>

          {/* who wrote it, when, and where to follow */}
          <div className="rise rise-2 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-7">
            <div className="flex items-center gap-3">
              <Me size={40} small alt="" className="h-10 w-10 rounded-full border border-line" />
              <div className="leading-[1.35]">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  {AUTHOR}
                  <span className="rounded-md border border-line px-[6px] py-[1px] text-[11px] font-medium text-muted">
                    Author
                  </span>
                </p>
                <p className="text-[13px] text-muted">
                  {formatDate(post.date)} · {post.readTime} min read
                </p>
              </div>
            </div>
            <a
              href={site.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-[16px] py-[8px] text-[13.5px] font-semibold text-paper no-underline transition-opacity hover:opacity-85"
            >
              Follow on Medium
            </a>
          </div>

          {/* the other parts of this story, in reading order */}
          {seriesParts.length > 1 && (
            <nav aria-label={`${post.series}, all parts`} className="glass mb-8 rounded-[20px] p-5 sm:p-6">
              <p className="text-[12.5px] text-muted">
                <span className="font-semibold text-ink">
                  {post.series!.charAt(0).toUpperCase() + post.series!.slice(1)}
                </span>
                <span aria-hidden="true"> · </span>
                part {post.part} of {seriesParts.length}
              </p>
              <ol className="mt-3 space-y-1">
                {seriesParts.map((p) => {
                  const here = p.slug === post.slug;
                  return (
                    <li key={p.slug} className="flex items-baseline gap-3 text-[15px] leading-[1.45]">
                      <span className="tnum w-4 shrink-0 text-[13px] text-muted">{p.part}</span>
                      {here ? (
                        <span aria-current="page" className="font-semibold text-ink">
                          {p.title} <span className="text-[12.5px] font-normal text-muted">- you&apos;re here</span>
                        </span>
                      ) : (
                        <Link
                          href={`/journal/${p.slug}`}
                          className="text-muted no-underline hover:text-ink hover:underline hover:underline-offset-[4px]"
                        >
                          {p.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {post.arc && (
            <div className="mb-[34px] text-[15px] leading-relaxed text-accent-soft">
              arc: {post.arc}
            </div>
          )}

          <div className="post-body">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        {/* written by: the same author, and the Medium copy to clap on */}
        <aside className="glass my-10 flex flex-wrap items-center justify-between gap-5 rounded-[22px] p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <Me size={48} small alt="" className="h-12 w-12 shrink-0 rounded-full border border-line" />
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-ink">Written by {AUTHOR}</p>
              <p className="text-[14px] leading-[1.5] text-muted">
                Full-stack developer building the Maahita school ERP, and writing down what it teaches me.
              </p>
            </div>
          </div>
          <a
            href={mediumUrl ?? site.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-accent px-[16px] py-[9px] text-[13.5px] font-semibold text-paper no-underline transition-opacity hover:opacity-85"
          >
            {mediumUrl ? "Read & clap on Medium" : "Follow on Medium"}
          </a>
        </aside>

        <ShareRow url={url} />

        <nav
          className="flex justify-between gap-5 pb-[60px] pt-6"
          aria-label="Adjacent posts"
        >
          {prev ? (
            <Link
              href={`/journal/${prev.slug}`}
              className="group max-w-[46%] font-mono text-[12.5px] text-muted no-underline"
            >
              <span className="mb-[6px] block text-accent">← previous</span>
              <span className="font-display text-[17px] leading-[1.25] text-ink group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/journal/${next.slug}`}
              className="group max-w-[46%] text-right font-mono text-[12.5px] text-muted no-underline"
            >
              <span className="mb-[6px] block text-accent">next →</span>
              <span className="font-display text-[17px] leading-[1.25] text-ink group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <Footer />
    </>
  );
}
