"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState<"student" | "working" | "creator" | "other">("other");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.signup(name, email, password, phone, address, profession);
      setToken(token);
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-2xl font-medium">Create your account</h1>
      <p className="mt-2 text-sm text-dim">
        Sign up to buy and download Hello Universe software.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <Field label="Full name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="hu-input"
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="hu-input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone number">
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="hu-input"
            placeholder="+91 98765 43210"
          />
        </Field>
        <Field label="Address">
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="hu-input min-h-24 resize-y"
            placeholder="Your address"
          />
        </Field>
        <Field label="Profession">
          <select
            required
            value={profession}
            onChange={(e) => setProfession(e.target.value as typeof profession)}
            className="hu-input"
          >
            <option value="student">Student</option>
            <option value="working">Working</option>
            <option value="creator">Creator</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Password">
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="hu-input"
            placeholder="At least 8 characters"
          />
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-signal py-3 text-sm font-medium text-ink transition hover:bg-signal/90 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-dim">
        Already have an account?{" "}
        <Link href="/login" className="text-paper underline">
          Log in
        </Link>
      </p>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-dim">{label}</span>
      {children}
    </label>
  );
}
