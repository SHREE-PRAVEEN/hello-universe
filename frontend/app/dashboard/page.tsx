import { OrdersClient } from "@/components/orders-client";
import { PageShell } from "@/components/page-shell";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" description="Track your activity, progress, and order history.">
      <section>
        <h2 className="mb-3 text-xl font-semibold">Order History</h2>
        <OrdersClient />
      </section>
    </PageShell>
  );
}
