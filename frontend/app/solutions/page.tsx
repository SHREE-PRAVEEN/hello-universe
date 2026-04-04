import { PageShell } from "@/components/page-shell";
import { SolutionCard } from "@/components/cards";
import { SearchForm } from "@/components/search-form";
import { apiClient } from "@/lib/api";
import type { Solution } from "@/types";

export const dynamic = "force-dynamic";

type SolutionsPageProps = {
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>;
};

export default async function SolutionsPage({ searchParams }: SolutionsPageProps) {
  const params = await searchParams;
  const solutions: Solution[] = await apiClient.getSolutions(params);

  return (
    <PageShell title="Solutions Hub" description="Real-world robotics implementations by category.">
      <SearchForm placeholder="Search solutions" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
    </PageShell>
  );
}
