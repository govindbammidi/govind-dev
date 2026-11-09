import { ogCard, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${site.title} - ${site.role}`;

export default function Image() {
  return ogCard({
    title:
      "Shipping a school ERP SaaS end to end: frontend, backend, database, releases.",
    kicker: `${site.author} · ${site.role}`,
    foot: site.role.toLowerCase(),
  });
}
