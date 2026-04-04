import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProductActions } from "@/components/product-actions";
import { apiClient } from "@/lib/api";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  try {
    const product = await apiClient.getProduct(slug);

    return (
      <PageShell title={product.name} description={product.description}>
        <ul className="space-y-2 text-sm">
          <li>Category: {product.category}</li>
          <li>Price: ${product.price}</li>
          <li>Stock: {product.stock}</li>
          <li>Tags: {product.tags.join(", ") || "N/A"}</li>
        </ul>
        <ProductActions productId={product.id} />
      </PageShell>
    );
  } catch {
    notFound();
  }
}
