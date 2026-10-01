"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function ExperiencePage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Career"
      title="Experience"
      description="Roles I've held and what I owned in each."
      items={content.experience}
      emptyLabel="No experience entries yet — add one from /admin."
    />
  );
}
