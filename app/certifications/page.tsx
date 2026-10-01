"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function CertificationsPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Credentials"
      title="Certifications"
      description="Certifications I've earned and kept current."
      items={content.certifications}
      emptyLabel="No certifications yet — add one from /admin."
    />
  );
}
