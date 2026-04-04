"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";

type CartItem = { id: string; quantity: number; product: { id: string; name: string; price: number | string } };

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    try {
      const cart = await apiClient.getCart();
      setItems((cart?.items || []) as CartItem[]);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items],
  );

  const placeOrder = async () => {
    try {
      await apiClient.createOrder({
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      });
      setMessage("Order placed successfully.");
    } catch {
      setMessage("Order failed. Login first and ensure cart has items.");
    }
  };

  return (
    <>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Your cart is currently empty.</p>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm">Qty: {item.quantity}</p>
              <p className="text-sm">Price: ${item.product.price}</p>
            </article>
          ))
        )}
      </div>
      <p className="mt-6 text-lg font-semibold">Estimated Total: ${total.toFixed(2)}</p>
      <button
        type="button"
        onClick={placeOrder}
        className="mt-3 rounded border px-4 py-2"
        style={{
          borderColor: "color-mix(in srgb, var(--accent) 56%, var(--border))",
          background: "linear-gradient(140deg, var(--accent), color-mix(in srgb, var(--accent-2) 35%, var(--accent)))",
          color: "white",
        }}
      >
        Place Order
      </button>
      {message ? <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{message}</p> : null}
    </>
  );
}
