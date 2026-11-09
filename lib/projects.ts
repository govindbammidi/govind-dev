/**
 * Structured project records - the source of truth for the work listing,
 * the per-project detail pages (/work/[slug]), their OG cards, and the
 * homepage featured section. Prose lives here as plain strings so the
 * pages stay free of JSX-escaping noise.
 */

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  body: string;
}

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface CaseStudySection {
  heading: string;
  body: string[];
}

export interface Project {
  slug: string;
  /** full title - detail page heading + metadata */
  title: string;
  /** compact title for cards */
  cardTitle: string;
  /** mono uppercase label, e.g. "Client pilot · Operations platform" */
  kicker: string;
  /** one-line positioning - card body + hero subhead */
  tagline: string;
  /** one sentence for compact listings - the homepage work rows */
  short: string;
  /** SEO / meta description */
  summary: string;
  year: string;
  /** short lifecycle note, e.g. "Pilot prototype - under evaluation" */
  status: string;
  /** hero/intro paragraphs */
  overview: string[];
  /** professional case-study narrative - opportunity through outcomes */
  caseStudy?: CaseStudySection[];
  objectives?: string[];
  features: Feature[];
  /** technical implementation notes - rendered as its own section when present */
  highlights?: string[];
  stack: string[];
  challenges?: ChallengeSolution[];
  impact: string[];
  role: string[];
  /** external links; empty for private/pilot work */
  links: ProjectLink[];
  /** when no public link exists, the line shown in its place */
  access?: string;
  /** surfaced on the homepage and pinned to the top of the work list */
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "metro-operations-shift-handover",
    title: "Metro Manufacturing Operations & Shift Handover System",
    cardTitle: "Metro Operations & Shift Handover",
    kicker: "Client pilot · Operations platform",
    tagline:
      "A centralized operations platform that turns shift handovers, testing, and production updates into one structured, auditable system.",
    short:
      "Replaces paper shift handovers and scattered chat threads with one auditable operations system for a metro manufacturer. In pilot.",
    summary:
      "A web platform that digitizes shift handovers, testing workflows, production updates, and team communication for metro manufacturing teams - replacing paper logs and scattered chat threads with a single source of truth. Built with React, TypeScript, and Firebase.",
    year: "2026",
    status: "Pilot prototype - under evaluation by a metro manufacturing company",
    overview: [
      "Manufacturing a metro train runs on continuous, multi-shift work - and for a long time the most important information moved on paper and across scattered chat threads. When one shift ended, the next began with a verbal recap and a hunt through messages: what had been tested, what failed, what was still pending. Any detail that didn't get written down was simply lost.",
      "This platform replaces that with a single operations system. Technicians, supervisors, and managers record shift handovers, track testing progress train by train, log pending activities, and post production updates in a consistent, structured format - so nothing falls through the gap between shifts, and management can read the state of the floor without asking anyone for a report.",
    ],
    caseStudy: [
      {
        heading: "The opportunity",
        body: [
          "The opportunity surfaced from inside a metro manufacturing operation, where someone close to the floor saw that critical work - shift handovers, testing updates, pending tasks, and team communication - still moved through manual notes and fragmented channels. Each gap carried risk: information lost between shifts, status that was hard to reconcile, and managers without a clear operational picture.",
          "The brief was direct: turn those workflows into a single digital system that the people doing the work would actually use.",
        ],
      },
      {
        heading: "Discovery & research",
        body: [
          "Over a series of discussions, I gathered operational requirements directly from the people involved in manufacturing and testing. The early focus was on how shift handovers pass between teams, how testing activities are tracked, how pending tasks get communicated, how train-specific work is monitored, and how managers receive updates.",
          "As the picture sharpened, additional workflows and reporting needs emerged - so discovery continued in parallel with the build rather than ending before it.",
        ],
      },
      {
        heading: "Solution design",
        body: [
          "Rather than building a generic dashboard, I designed the system around the actual shape of day-to-day operations. The core model followed the real hierarchy of the work - trains, test chapters and sub-chapters, statuses, and pending activities - so the software mirrored how teams already thought about the job instead of imposing a new mental model.",
          "The handover flow became the spine of the system, with every entry, test, and update tied to the unit of work it belonged to.",
        ],
      },
      {
        heading: "Technical implementation",
        body: [
          "I built the platform as a workflow-driven web application: structured shift-handover capture, hierarchical train → test chapter → sub-chapter selection, live test-status tracking, automatic pending-activity carry-forward, and aggregated reporting for supervisors and management.",
          "Role-based access scoped each view to the user, and a mobile-friendly interface let technicians record updates from the floor rather than only from a desk.",
        ],
      },
      {
        heading: "Iteration process",
        body: [
          "I worked prototype-first, putting a working build in front of users early and iterating on real operational scenarios instead of assumptions. Successive rounds refined the handover workflow, the test chapter and sub-chapter tracking, train selection, pending-activity management, and the status-reporting structures - each change driven by feedback from the people who would actually use it.",
        ],
      },
      {
        heading: "Outcomes & learnings",
        body: [
          "The prototype is currently under stakeholder review, with feedback being collected to guide its next direction.",
          "The project was an exercise in translating real-world industrial operations into a structured digital workflow - and it sharpened how I convert business processes into software, gather requirements from non-technical stakeholders, design enterprise operational systems, and build around real-world constraints instead of assumptions.",
        ],
      },
    ],
    objectives: [
      "Digitize the shift handover process end to end.",
      "Improve communication between technicians, supervisors, and managers.",
      "Track testing activities and the work still pending.",
      "Capture production updates in a consistent, structured format.",
      "Reduce information loss during shift transitions.",
      "Give management real-time visibility into daily operations.",
    ],
    features: [
      {
        title: "Shift handover management",
        body: "Outgoing shifts record what was done and what's outstanding; the incoming shift starts from a complete, structured handover instead of a verbal recap.",
      },
      {
        title: "Train selection & tracking",
        body: "Work is organized per train, so every entry, test, and update is tied to the unit it belongs to and stays easy to trace.",
      },
      {
        title: "Test chapter & sub-chapter selection",
        body: "A hierarchical test structure lets teams drill from chapter to sub-chapter, capturing exactly which procedure an entry refers to.",
      },
      {
        title: "Test status monitoring",
        body: "Each test carries a live status, making it clear at a glance what has passed, what's pending, and what needs attention.",
      },
      {
        title: "Pending activities tracking",
        body: "Unfinished work is carried forward automatically, so open items follow the train across shifts instead of being forgotten.",
      },
      {
        title: "Production updates",
        body: "Daily production progress is logged in a consistent format, building a reliable timeline of how each unit advanced.",
      },
      {
        title: "Team communication logs",
        body: "Coordination happens inside the system and stays attached to the relevant work, replacing fragmented messaging threads.",
      },
      {
        title: "Dashboard & reporting",
        body: "Aggregated views summarize testing status, pending activities, and production progress for supervisors and management.",
      },
      {
        title: "Mobile-friendly interface",
        body: "A responsive layout lets technicians capture updates from the shop floor on a phone, not only from a desk.",
      },
      {
        title: "Role-based access",
        body: "Technicians, supervisors, and managers each see and act on what is relevant to their role.",
      },
    ],
    stack: ["React", "TypeScript", "Firebase", "Material UI", "Node.js", "REST APIs"],
    challenges: [
      {
        challenge:
          "Replacing an entrenched mix of paper logs and chat threads - without slowing the floor down or asking people to learn a foreign process.",
        solution:
          "I modeled the system on the team's real handover flow rather than imposing a new one, and kept data entry fast enough to complete mid-shift. Adoption didn't cost time on the floor; it gave time back.",
      },
      {
        challenge:
          "Capturing testing work that spans many trains and a deep procedure hierarchy, without rigid forms that break the moment reality differs from the template.",
        solution:
          "A train → test chapter → sub-chapter model with per-item status keeps every entry precise and consistent, while staying flexible across units and stages of work.",
      },
      {
        challenge:
          "Information was being lost at the single hardest point to cover - the boundary between two shifts.",
        solution:
          "Pending activities carry forward into the next shift's handover automatically, so open work is never re-typed or dropped, and every change leaves an auditable trail.",
      },
      {
        challenge:
          "Management needed visibility into daily operations without adding yet another manual reporting burden on the floor.",
        solution:
          "Dashboards aggregate testing status, pending work, and production updates straight from the records the floor already maintains - visibility becomes a by-product of normal work, not a separate task.",
      },
      {
        challenge:
          "The same data had to serve technicians on phones at the line and managers reviewing at a desk.",
        solution:
          "A mobile-first responsive interface built on Material UI, with role-based access scoping each view, so one system fits both contexts without compromise.",
      },
    ],
    impact: [
      "Replaces paper handovers and scattered chat threads with one source of truth for shift-to-shift operations.",
      "Reduces information loss at shift transitions by carrying pending work forward automatically.",
      "Gives supervisors and management a real-time view of testing and production without manual reporting.",
      "Builds an auditable record of testing progress and production updates, organized per train.",
      "Currently in pilot evaluation with a metro manufacturing company as a production-oriented prototype.",
    ],
    role: [
      "Product planning",
      "Requirements analysis",
      "UI/UX design",
      "Full-stack development",
      "Database design",
      "Workflow automation",
      "Deployment planning",
    ],
    links: [{ label: "live demo", href: "https://metro-qms.vercel.app/login" }],
    access: "Private pilot - login-gated demo.",
    featured: true,
  },
  {
    slug: "child-care-parent-communication",
    title: "Child Care & Parent Communication Platform",
    cardTitle: "Child Care & Parent Communication",
    kicker: "Product prototype · Communication platform",
    tagline:
      "Helping child care centers stay connected with parents through real-time updates and automated communication.",
    short:
      "Keeps parents in the loop with activity updates, announcements, and automated email through Brevo. Early prototype.",
    summary:
      "A web platform that centralizes parent communication for child care centers - activity updates, announcements, and automated email notifications - replacing scattered calls and messaging apps. Built with React, TypeScript, Firebase, and Brevo.",
    year: "2026",
    status: "Prototype - early validation stage",
    overview: [
      "A modern child care management platform built to improve communication between care providers and parents. Centers share daily updates, announcements, activities, and important information through one centralized platform - instead of relying on phone calls and consumer messaging apps, where updates get missed and communication drifts out of sync.",
      "The platform is built around simplicity, accessibility, and trust. Parents get a clear, consistent view of their child's day; caregivers get a single place to communicate, with automated notifications taking over the manual follow-ups that used to eat into time better spent on care.",
    ],
    caseStudy: [
      {
        heading: "The opportunity",
        body: [
          "The opportunity originated from a collaborator on the QA team during work on the school ERP product. Drawing on challenges observed in child care centers, the proposal was a platform to help providers communicate with parents more effectively and reduce their dependence on scattered, informal channels.",
          "The problem was concrete and human - parents left out of the loop, caregivers buried in manual follow-ups - and stood out immediately as worth exploring.",
        ],
      },
      {
        heading: "Discovery & research",
        body: [
          "To understand the space, I reviewed existing child care applications and analyzed their workflows, supported by recordings and demonstrations of tools currently used in the market.",
          "That research surfaced recurring gaps: weak or missing notification mechanisms, communication that fell through informal channels, low parent engagement, and user experiences with clear room to improve.",
        ],
      },
      {
        heading: "Solution design",
        body: [
          "I framed the platform around the communication workflows that mattered most: a parent communication dashboard, child activity updates, announcement management, administrative screens, and a clean, accessible interface for both caregivers and parents.",
          "The aim was simplicity and trust - making consistent, centralized communication the path of least resistance rather than one more task.",
        ],
      },
      {
        heading: "Technical implementation",
        body: [
          "I built the prototype with a React and TypeScript frontend on a Firebase backend, with authentication and role-based access protecting sensitive child information.",
          "During evaluation, automated parent communication emerged as the highest-leverage improvement, so I researched and integrated email notifications using Brevo - letting the platform send updates and announcements automatically, and demonstrating how communication could move beyond traditional messaging.",
        ],
      },
      {
        heading: "Iteration process",
        body: [
          "The goal was deliberately not a finished product, but a tangible prototype that could be evaluated and discussed. I built quickly to validate the concept, then refined it as evaluation revealed new opportunities - the Brevo-powered notification system being the clearest example of an improvement identified and implemented mid-iteration.",
        ],
      },
      {
        heading: "Outcomes & learnings",
        body: [
          "The prototype is currently being reviewed and discussed for future direction and feature prioritization.",
          "The project strengthened my ability to turn an idea into working software quickly, validate concepts through prototypes, study existing products to find improvement opportunities, implement communication and notification systems, and collaborate closely with stakeholders throughout product discovery.",
        ],
      },
    ],
    objectives: [
      "Centralize parent communication in one accessible platform.",
      "Replace ad-hoc phone calls and messaging apps with consistent updates.",
      "Keep parents informed about their child's daily activities in real time.",
      "Automate routine notifications to cut manual follow-up.",
      "Build trust between caregivers and parents through reliable communication.",
    ],
    features: [
      {
        title: "Parent communication dashboard",
        body: "A single place where parents see updates, announcements, and their child's activity in one consistent view.",
      },
      {
        title: "Child activity updates",
        body: "Caregivers log activities as the day unfolds, giving parents a real-time window into their child's care.",
      },
      {
        title: "Announcement management",
        body: "Centers compose and publish announcements once, reaching every relevant parent through the platform.",
      },
      {
        title: "Email notification system",
        body: "Automated emails push important updates the moment they're posted, so nothing depends on a manual reminder.",
      },
      {
        title: "Parent contact management",
        body: "Parent and guardian details are organized centrally, keeping the right people connected to the right child.",
      },
      {
        title: "Secure role-based access",
        body: "Caregivers, administrators, and parents each see and act on only what their role allows.",
      },
      {
        title: "Mobile responsive design",
        body: "A clean, responsive interface works on the phones parents check through the day, not only on a desktop.",
      },
      {
        title: "Activity timeline tracking",
        body: "Every update builds a chronological timeline, so a child's day reads as one continuous record.",
      },
    ],
    highlights: [
      "React + TypeScript frontend with reusable, responsive UI components",
      "Firebase backend for authentication and real-time data management",
      "Brevo integration powering the automated email notification system",
      "Authentication and authorization with role-based access control",
      "Real-time data sync so updates reach parents as they happen",
      "Mobile-first responsive layout across the full experience",
    ],
    stack: ["React", "TypeScript", "Firebase", "Brevo", "REST APIs"],
    challenges: [
      {
        challenge:
          "Centers were juggling phone calls and consumer messaging apps to keep parents informed - so updates were missed, communication was inconsistent, and every gap turned into another manual follow-up.",
        solution:
          "A centralized parent-communication dashboard makes updates, announcements, and activity logs the default channel, so the same information reaches every parent the same way - without anyone chasing it.",
      },
      {
        challenge:
          "Keeping parents informed in real time without piling more work onto caregivers.",
        solution:
          "An automated email notification system, built on Brevo, sends updates the moment they're posted - replacing manual reminders with a reliable, hands-off channel.",
      },
      {
        challenge:
          "Children's information is sensitive; not every user should be able to see or do everything.",
        solution:
          "Authentication with secure role-based access scopes exactly what caregivers, administrators, and parents can view and manage.",
      },
      {
        challenge:
          "Parents check in from their phones across the day, while staff work from the center.",
        solution:
          "A mobile-responsive interface keeps the experience clean and accessible on any device, so updates are easy to post and easy to read.",
      },
    ],
    impact: [
      "Reduces communication overhead for child care providers.",
      "Improves parent engagement and visibility into daily child activities.",
      "Replaces scattered calls and messaging apps with one consistent, trusted channel.",
      "Automates routine notifications, freeing caregiver time for actual care.",
      "Currently in early validation as a working prototype.",
    ],
    role: [
      "Product discovery",
      "UI/UX design",
      "Full-stack development",
      "Notification system implementation",
      "Email integration",
      "Prototype development",
      "Feature planning",
    ],
    links: [{ label: "live demo", href: "https://safepickup-zeta.vercel.app/" }],
    access: "Prototype - early validation stage.",
    featured: true,
  },
];

/**
 * The Maahita products I work on day to day. Listed on the homepage and the
 * work page; no detail page of their own - the journal tells those stories.
 */
export interface Product {
  /** compact name for the homepage rows */
  name: string;
  /** descriptive heading for the work-page card */
  title: string;
  /** mono uppercase label, e.g. "Maahita Technologies · School ERP" */
  kicker: string;
  /** one sentence for compact listings - the homepage work rows */
  short: string;
  /** the work-page card paragraph */
  body: string;
  stack: string[];
  /** site paths (/journal/…) open in place; http(s) links open in a new tab */
  links: ProjectLink[];
}

export const PRODUCTS: Product[] = [
  {
    name: "Maahita School ERP",
    title: "A school ERP built for Indian local schools",
    kicker: "Maahita Technologies · School ERP",
    short:
      "Multi-tenant SaaS for Indian schools: 15+ modules from admissions to fees, schema-per-tenant PostgreSQL, 570 REST endpoints. I ship every layer, from schema to release.",
    body:
      "An early-stage SaaS product run by three founders investing in the idea directly. No big roadmap handed down, no perfect process. We learn from real schools (two piloted it, and I demoed it to schools in person), evolve the product, and ship. I've been on it since my 4th year of BTech, across every layer above.",
    stack: ["React", "TypeScript", "Node.js / Express", "PostgreSQL", "Docker"],
    links: [{ label: "live product", href: "https://school.maahita.com/" }],
  },
  {
    name: "Vinodam",
    title: "A live quiz platform for school events",
    kicker: "Maahita Technologies · Vinodam",
    short:
      "Live quiz platform for school events: three synced screens, real-time scoring. Built as a secret prototype, adopted as a product, first event ran with 300 students.",
    body:
      "Born from a principal's challenge: TV-show-style quizzes for school events. I built the prototype in secret - three synchronized screens (admin control, projector display, participant phones) with real-time scoring, timers, and leaderboards. The team adopted it as an official product, and it ran its first live event with 300 students without breaking. The principal rewarded the team with ₹5,000.",
    stack: ["React", "Firebase", "real-time sync"],
    links: [
      { label: "live app", href: "https://vinodam-maahita.web.app/" },
      {
        label: "the full story",
        href: "/journal/building-vinodam-what-shipping-really-means",
      },
    ],
  },
];

/** One row of the homepage work list - products and featured projects, same shape. */
export interface WorkRow {
  title: string;
  kicker: string;
  short: string;
  stack: string[];
  links: ProjectLink[];
  /** detail page, when one exists; the title links there */
  href?: string;
}

/** Homepage work list: the day job first, then the featured client and product work. */
export function getHomeWork(): WorkRow[] {
  return [
    ...PRODUCTS.map((p) => ({
      title: p.name,
      kicker: p.kicker,
      short: p.short,
      stack: p.stack,
      links: p.links,
    })),
    ...getFeaturedProjects().map((p) => ({
      title: p.cardTitle,
      kicker: p.kicker,
      short: p.short,
      stack: p.stack,
      links: [...p.links, { label: "the breakdown", href: `/work/${p.slug}` }],
      href: `/work/${p.slug}`,
    })),
  ];
}

/** Featured first, then most recent year first. */
export function getAllProjects(): Project[] {
  return [...PROJECTS].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.year.localeCompare(a.year);
  });
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}
