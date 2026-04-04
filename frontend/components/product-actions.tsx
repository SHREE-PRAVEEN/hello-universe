"use client";

import { FormEvent, useState } from "react";
import { apiClient } from "@/lib/api";

type ProductActionsProps = {
  productId: string;
};

export function ProductActions({ productId }: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const addToCart = async () => {
    try {
      await apiClient.addToCart({ productId, quantity: qty });
      setMessage("Added to cart successfully.");
    } catch {
      setMessage("Add to cart failed. Login first.");
    }
  };

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await apiClient.addReview(productId, { rating, comment });
      setMessage("Review submitted.");
    } catch {
      setMessage("Review failed. Login first.");
    }
  };

  return (
    <section
      className="mt-6 space-y-3 rounded-xl border p-4 text-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-24 rounded border px-2 py-1"
          style={{ borderColor: "var(--border)", background: "var(--surface-strong)", color: "var(--foreground)" }}
        />
        <button
          onClick={addToCart}
          className="rounded border px-4 py-2"
          style={{
            borderColor: "color-mix(in srgb, var(--accent) 56%, var(--border))",
            background: "linear-gradient(140deg, var(--accent), color-mix(in srgb, var(--accent-2) 35%, var(--accent)))",
            color: "white",
          }}
          type="button"
        >
          Add to Cart
        </button>
      </div>

      <form onSubmit={submitReview} className="space-y-2">
        <div className="flex items-center gap-2">
          <label>Rating</label>
          <input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-20 rounded border px-2 py-1"
            style={{ borderColor: "var(--border)", background: "var(--surface-strong)", color: "var(--foreground)" }}
          />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a short review"
          className="w-full rounded border px-3 py-2"
          style={{ borderColor: "var(--border)", background: "var(--surface-strong)", color: "var(--foreground)" }}
          rows={3}
        />
        <button
          type="submit"
          className="rounded border px-3 py-2"
          style={{ borderColor: "var(--border)", background: "var(--surface-strong)", color: "var(--foreground)" }}
        >
          Submit Review
        </button>
      </form>

      {message ? <p style={{ color: "var(--muted)" }}>{message}</p> : null}
    </section>
  );
}
