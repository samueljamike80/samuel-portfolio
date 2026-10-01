// Central content model. Every section of the site (hero, about, and every
// dropdown page) reads from this shape. The data itself lives in Supabase
// (see lib/content-context.tsx and lib/supabase-client.ts) — the JSON file
// at data/site-content.json is only the seed used to populate the database
// the first time (see supabase/schema.sql).

export type SocialLinks = {
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  mail: string;
  linktree: string;
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
};

export type InfoChip = {
  id: string;
  label: string;
  value: string;
  icon: "map-pin" | "graduation-cap" | "target" | "mail";
};

export type HeroContent = {
  name: string;
  role: string;
  greeting: string;
  description: string;
  profileImage: string;
  cvUrl: string;
};

export type AboutContent = {
  shortText: string;
  longText: string;
  secondaryImage: string;
  infoChips: InfoChip[];
};

// One generic shape covers every listable content page (experience,
// projects, certifications, blog, research, community, talks, honors).
// Not every field is used by every section — e.g. "organization" reads as
// "company" for experience and "publisher" for research in the UI labels,
// and empty fields are simply not rendered.
export type ContentItem = {
  id: string;
  title: string;
  subtitle?: string; // company / issuer / venue / publication
  description: string;
  date?: string; // free text: "2024 – Present", "Mar 2025", etc.
  image?: string;
  link?: string;
  linkLabel?: string;
  tags?: string[];
  featured?: boolean;
};

export type ContactContent = {
  email: string;
  phone?: string;
  location: string;
  availability: string;
};

export type SiteContent = {
  hero: HeroContent;
  stats: Stat[];
  about: AboutContent;
  social: SocialLinks;
  contact: ContactContent;
  experience: ContentItem[];
  projects: ContentItem[];
  certifications: ContentItem[];
  blog: ContentItem[];
  research: ContentItem[];
  community: ContentItem[];
  talks: ContentItem[];
  honors: ContentItem[];
};

export type SectionKey =
  | "experience"
  | "projects"
  | "certifications"
  | "blog"
  | "research"
  | "community"
  | "talks"
  | "honors";
