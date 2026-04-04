import { PageShell } from "@/components/page-shell";
import { GuideCard } from "@/components/cards";
import { SearchForm } from "@/components/search-form";
import { apiClient } from "@/lib/api";
import type { Guide } from "@/types";

export const dynamic = "force-dynamic";

type GuidesPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;
  const guides: Guide[] = await apiClient.getGuides(params.search);

  return (
    <PageShell title="DIY Guides" description="Step-by-step robot building guides with materials, wiring, and code.">
      <SearchForm placeholder="Search guides" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </PageShell>
  );
}
