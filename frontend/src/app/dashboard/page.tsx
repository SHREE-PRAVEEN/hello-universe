"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, Order, getStoredUser } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = getStoredUser();

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
    <section className="mx-auto max-w-3xl px-6 py-14 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">
            {user ? `Hi, ${user.name.split(" ")[0]} 👋` : "My Orders"}
          </h1>
          <p className="mt-1 text-sm text-dim">
            {user?.email && <span className="font-mono">{user.email}</span>}
          </p>
        </div>
        <Link
          href="/products"
          className="rounded-lg border border-signal/40 bg-signal/10 px-4 py-2 text-sm font-medium text-signal transition-all hover:bg-signal/20 hover:border-signal/60"
        >
          + Buy more
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {!orders && !error && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-line/40 bg-panel/40 p-5 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-line/40" />
                  <div className="h-3 w-20 rounded bg-line/30" />
                </div>
                <div className="h-6 w-16 rounded bg-line/40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {orders?.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-line/40">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-semibold text-paper text-lg mb-2">No orders yet</h2>
          <p className="text-sm text-dim mb-6 max-w-xs mx-auto">
            Browse our catalogue and get your first piece of Hello Universe software delivered straight to your inbox.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-signal/10 border border-signal/30 px-5 py-2.5 text-sm font-medium text-signal hover:bg-signal/20 transition-all"
          >
            Browse products →
          </Link>
        </div>
      )}

      {/* Order list */}
      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </section>
  );
}

function OrderCard({ order: o }: { order: Order }) {
  return (
    <div className="group rounded-xl border border-line/50 bg-panel/50 hover:bg-panel/80 hover:border-line/80 transition-all duration-200 p-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs text-dim">
              #{o.id.slice(0, 8).toUpperCase()}
            </span>
            <StatusBadge status={o.status} delivered={o.delivered} />
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            <MethodBadge method={o.payment_method} />
            <span className="text-xs text-dim">
              {new Date(o.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" · "}
              {new Date(o.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {/* Reference ID */}
          {orderReference(o) !== "—" && (
            <div className="mt-2 font-mono text-[11px] text-dim/70 truncate">
              Ref: {orderReference(o)}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="text-right shrink-0">
          <div className="font-mono text-lg font-semibold text-signal">
            ₹{Number(o.amount_inr).toLocaleString("en-IN")}
          </div>
          {o.status === "success" && !o.delivered && (
            <div className="text-[10px] text-dim mt-0.5">Sending email…</div>
          )}
          {o.status === "success" && o.delivered && (
            <div className="text-[10px] text-green-400 mt-0.5 flex items-center justify-end gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Emailed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function orderReference(o: Order): string {
  if (o.payment_method === "nowpayments") return o.gateway_payment_id ?? "—";
  return "—"; // UPI: no auto reference
}

function StatusBadge({
  status,
  delivered,
}: {
  status: string;
  delivered: boolean;
}) {
  const cls =
    status === "success"
      ? "success"
      : status === "failed"
      ? "failed"
      : "pending";

  const label =
    status === "success"
      ? delivered
        ? "Delivered"
        : "Paid"
      : status === "failed"
      ? "Failed"
      : "Pending";

  const dot =
    status === "pending" ? (
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
    ) : null;

  return (
    <span className={`status-badge ${cls}`}>
      {dot}
      {label}
    </span>
  );
}

function MethodBadge({ method }: { method: Order["payment_method"] }) {
  const map: Record<string, { icon: string; label: string }> = {
    upi: { icon: "🇮🇳", label: "UPI Manual" },
    nowpayments: { icon: "🌐", label: "NOWPayments" },
  };
  const m = map[method] ?? { icon: "💳", label: method };
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-dim bg-line/20 border border-line/30 rounded-full px-2 py-0.5">
      <span>{m.icon}</span>
      {m.label}
    </span>
  );
}
