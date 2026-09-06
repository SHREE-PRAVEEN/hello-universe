"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Order } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .myOrders()
      .then(setOrders)
      .catch((e) => {
        if (e instanceof Error && e.message.toLowerCase().includes("unauthorized")) {
          router.push("/login");
          return;
        }
        setError(e instanceof Error ? e.message : "Failed to load orders");
      });
  }, [router]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-2xl font-medium">Your orders</h1>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {!orders && !error && <p className="mt-6 text-sm text-dim">Loading…</p>}
      {orders?.length === 0 && (
        <p className="mt-6 text-sm text-dim">No orders yet — browse the catalogue to get started.</p>
      )}

      <div className="mt-8 divide-y divide-line border-y border-line">
        {orders?.map((o) => (
          <div key={o.id} className="flex items-center justify-between py-4">
            <div>
              <div className="font-mono text-xs text-dim">{orderReference(o)}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-dim">
                {methodLabel(o.payment_method)}
              </div>
              <div className="mt-1 text-sm text-dim">
                {new Date(o.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm text-signal">
                ₹{Number(o.amount_inr).toLocaleString("en-IN")}
              </div>
              <StatusBadge status={o.status} delivered={o.delivered} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function orderReference(o: Order): string {
  if (o.payment_method === "payu") return o.payu_txnid ?? "—";
  if (o.payment_method === "nowpayments") return o.gateway_payment_id ?? "—";
  return o.crypto_tx_hash ?? "awaiting on-chain payment";
}

function methodLabel(method: Order["payment_method"]): string {
  switch (method) {
    case "payu":
      return "Card / UPI (PayU)";
    case "nowpayments":
      return "Crypto (gateway)";
    case "usdt_trc20":
      return "USDT · direct (TRC-20)";
  }
}

function StatusBadge({ status, delivered }: { status: string; delivered: boolean }) {
  const color =
    status === "success" ? "text-circuit" : status === "failed" ? "text-red-400" : "text-dim";
  return (
    <div className={`mt-1 text-xs ${color}`}>
      {status}
      {status === "success" && (delivered ? " · emailed" : " · sending…")}
    </div>
  );
}
