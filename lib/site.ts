/**
 * One spot to change the domain and identity.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (or .env) when the custom domain changes.
 */
// When the custom domain is live, change DEFAULT_URL to https://govind.dev
const DEFAULT_URL = "https://govind-dev-eta.vercel.app";

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_URL,
  name: "govind.dev",
  title: "Govind",
  /** the one-line role, used wherever the name needs a job title next to it */
  role: "Full-stack developer",
  description:
    "Bammidi Govinda Rao (Govind), Full Stack Developer (Founding Team) at Maahita Technologies: React, TypeScript, Node.js and PostgreSQL on a multi-tenant school ERP. Open to roles.",
  author: "Govind",
  email: "bammidigovindarao1729@gmail.com",
  linkedin: "https://www.linkedin.com/in/bammidi-govinda-rao-b8286a229/",
  github: "https://github.com/govindbammidi",
  githubWork: "https://github.com/govindaraob-maahita",
  medium: "https://medium.com/@bammidigovindarao1729",
  /** "Book a call" in the masthead. The contact page until there's a
   *  Cal.com / Calendly link - paste that here and the button opens it in a new tab */
  booking: "/contact",
  fine: "Govind - building the Maahita school ERP, and writing down what it teaches me.",
} as const;
