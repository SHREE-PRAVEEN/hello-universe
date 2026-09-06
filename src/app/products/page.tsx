"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Product } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listProducts()
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load products"));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="font-display text-2xl font-medium md:text-3xl">Products</h1>
      <p className="mt-3 max-w-lg text-dim">
        Software for building intelligent machines — delivered to your email the
        moment your payment clears.
      </p>

      {error && (
        <p className="mt-10 text-sm text-red-400">
          Couldn&rsquo;t reach the store backend: {error}
        </p>
      )}

      {!products && !error && (
        <p className="mt-10 text-sm text-dim">Loading catalogue…</p>
      )}

      <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
        {products?.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="group bg-panel p-6 transition hover:bg-panel2"
          >
            <span className="font-mono text-[11px] uppercase tracking-wide text-dim">
              {p.category}
            </span>
            <h2 className="mt-2 font-display text-lg font-medium text-paper">{p.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-dim">{p.description}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-sm text-signal">
                ₹{Number(p.price_inr).toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-dim group-hover:text-paper">View</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
