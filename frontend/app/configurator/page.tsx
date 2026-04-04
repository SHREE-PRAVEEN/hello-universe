"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { apiClient } from "@/lib/api";

type ConfigResult = {
  recommendedDesign: string;
  estimatedCost: number;
  partsList: Array<{ id: string; name: string; price: string }>;
  relatedGuides: Array<{ id: string; title: string }>;
  relatedSolutions: Array<{ id: string; title: string }>;
};

export default function ConfiguratorPage() {
  const [budget, setBudget] = useState<number>(500);
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConfigResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = (await apiClient.recommendRobot({ budget, useCase })) as ConfigResult;
      setResult(data);
    } catch {
      setError("Unable to generate recommendation right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Robot Configurator" description="Input your budget and use-case to get a recommended robot build.">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-black/10 p-4">
        <label className="block text-sm">
          Budget ($)
          <input
            type="number"
            min={50}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-black/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          Use-case
          <input
            type="text"
            required
            value={useCase}
            onChange={(event) => setUseCase(event.target.value)}
            placeholder="e.g. Smart farm monitoring"
            className="mt-1 w-full rounded-md border border-black/20 bg-transparent px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Recommendation"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {result ? (
        <section className="mt-6 space-y-3 rounded-xl border border-black/10 p-4 text-sm">
          <p>
            <span className="font-semibold">Recommended Design:</span> {result.recommendedDesign}
          </p>
          <p>
            <span className="font-semibold">Estimated Cost:</span> ${result.estimatedCost}
          </p>
          <p>
            <span className="font-semibold">Parts:</span> {result.partsList.map((part) => part.name).join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Related Guides:</span> {result.relatedGuides.map((guide) => guide.title).join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Related Solutions:</span> {result.relatedSolutions.map((solution) => solution.title).join(", ") || "N/A"}
          </p>
        </section>
      ) : null}
    </PageShell>
  );
}
