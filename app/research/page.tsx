"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function ResearchPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Publications"
      title="Research"
      description="Papers, workshop submissions, and research notes."
      items={content.research}
      emptyLabel="No research entries yet — add one from /admin."
    />
  );
}
