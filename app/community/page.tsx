"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function CommunityPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Involvement"
      title="Community"
      description="Mentoring, organizing, and volunteering."
      items={content.community}
      emptyLabel="No community entries yet — add one from /admin."
    />
  );
}
