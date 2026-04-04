import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/cards";
import { SearchForm } from "@/components/search-form";
import { apiClient } from "@/lib/api";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

type MarketplacePageProps = {
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const products: Product[] = await apiClient.getProducts(params);

  return (
    <PageShell title="Marketplace" description="Robotics parts, components, and kits.">
      <SearchForm placeholder="Search products" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PageShell>
  );
}
