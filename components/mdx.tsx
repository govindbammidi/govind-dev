import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import * as React from "react";
import { diagrams } from "@/components/diagrams";

/**
 * Components available inside every post without imports.
 * <Pull> - Fraunces italic pull quote (same as blockquote).
 * <Ex> - the mono "Ex:" callout block.
 * <...Diagram> - the inline-SVG figures in diagrams.tsx, one per post.
 */
export const mdxComponents: MDXRemoteProps["components"] = {
  Pull: ({ children }: { children?: React.ReactNode }) => (
    <div className="pull">{children}</div>
  ),
  Ex: ({ children }: { children?: React.ReactNode }) => (
    <div className="ex">{children}</div>
  ),
  ...diagrams,
  // a row of small logo marks: <LogoRow items={[{src, alt, width?}]} />
  LogoRow: ({
    items,
  }: {
    items?: { src: string; alt: string; width?: number }[];
  }) => (
    <div className="logo-row">
      {(items ?? []).map((item, i) => (
        <span key={item.src} className="logo-row-item">
          {i > 0 && <span className="logo-row-arrow">→</span>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            style={{ width: item.width ?? 90 }}
          />
        </span>
      ))}
    </div>
  ),
  ProductFamily: ({ children }: { children?: React.ReactNode }) => {
    const logos = React.Children.toArray(children).filter(
      (child) => child !== "\n",
    );

    return (
      <figure className="product-family" aria-label="Product family logos">
        <div className="product-family-row">
          {logos.map((child, i) => (
            <div key={i} className="product-family-unit">
              {i > 0 && (
                <div className="product-family-branch" aria-hidden="true">
                  <span>same tree</span>
                  <span>{"->"}</span>
                  <span>new product</span>
                </div>
              )}
              {child}
            </div>
          ))}
        </div>
      </figure>
    );
  },
  ProductLogo: ({
    src,
    alt,
    label,
    note,
    width,
  }: {
    src: string;
    alt: string;
    label: string;
    note: string;
    width?: number | string;
  }) => (
    <>
      <div className="product-family-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: width ?? 150 }} />
      </div>
      <figcaption>
        <strong>{label}</strong>
        <span>{note}</span>
      </figcaption>
    </>
  ),
  // external links open in a new tab; internal links stay in-tab
  a: ({
    href = "",
    children,
  }: {
    href?: string;
    children?: React.ReactNode;
  }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  },
  // hashtag sign-off lines render in mono accent, like the reference design
  p: ({ children }: { children?: React.ReactNode }) => {
    if (typeof children === "string" && children.startsWith("#")) {
      return (
        <p className="!mb-0 mt-[14px] font-mono text-[14px] text-accent">
          {children}
        </p>
      );
    }
    return <p>{children}</p>;
  },
};
