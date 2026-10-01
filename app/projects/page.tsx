"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function ProjectsPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Selected Work"
      title="Projects"
      description="Things I've built, from open-source tools to client work."
      items={content.projects}
      emptyLabel="No projects yet — add one from /admin."
    />
  );
}
