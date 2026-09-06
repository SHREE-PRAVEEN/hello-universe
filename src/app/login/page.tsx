"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Log in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-2xl font-medium">Log in</h1>
      <p className="mt-2 text-sm text-dim">Welcome back to Hello Universe.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm text-dim">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="hu-input"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-dim">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="hu-input"
            placeholder="Your password"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-signal py-3 text-sm font-medium text-ink transition hover:bg-signal/90 disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-dim">
        New here?{" "}
        <Link href="/signup" className="text-paper underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}
