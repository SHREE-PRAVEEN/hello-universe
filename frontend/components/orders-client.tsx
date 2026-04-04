"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

type Order = { id: string; status: string; totalAmount: number | string; createdAt: string };

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getOrders();
        setOrders(data as Order[]);
      } catch {
        setOrders([]);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>No orders found.</p>
      ) : (
        orders.map((order) => (
          <article
            key={order.id}
            className="rounded-xl border p-4 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <p>Order: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </article>
        ))
      )}
    </div>
  );
}
