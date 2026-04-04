import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { apiClient } from "@/lib/api";

export const dynamic = "force-dynamic";

type SolutionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { slug } = await params;

  try {
    const solution = await apiClient.getSolution(slug);
    return (
      <PageShell title={solution.title} description={solution.problemDescription}>
        <ul className="space-y-2 text-sm">
          <li>Category: {solution.category}</li>
          <li>Estimated Cost: ${solution.estimatedCost}</li>
          <li>Tools: {solution.softwareTools.join(", ") || "N/A"}</li>
          <li>Tags: {solution.tags.join(", ") || "N/A"}</li>
        </ul>
      </PageShell>
    );
  } catch {
    notFound();
  }
}
