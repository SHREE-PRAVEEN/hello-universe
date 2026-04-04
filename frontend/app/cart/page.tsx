import { CartClient } from "@/components/cart-client";
import { PageShell } from "@/components/page-shell";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <PageShell title="Cart" description="Review selected robotics components before placing an order.">
      <CartClient />
    </PageShell>
  );
}
