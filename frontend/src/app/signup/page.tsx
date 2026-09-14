"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken, setStoredUser } from "@/lib/api";

const PROFESSIONS = [
  { value: "student", label: "🎓 Student" },
  { value: "working", label: "💼 Working Professional" },
  { value: "creator", label: "🎨 Creator / Maker" },
  { value: "other", label: "✨ Other" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 2-step form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState<"student" | "working" | "creator" | "other">("other");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setError(null);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await api.signup(name, email, password, phone, address, profession);
      setToken(token);
      setStoredUser(user);
      window.dispatchEvent(new Event("storage"));
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-signal to-[#ff6b00] flex items-center justify-center text-ink font-black text-xl shadow-lg shadow-signal/20 mb-4">
            HU
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-paper">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-dim">
            Join Hello Universe and access cutting-edge software
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                step >= s
                  ? "bg-signal text-ink"
                  : "bg-line/40 text-dim"
              }`}>
                {step > s ? "✓" : s}
              </div>
              <span className={`text-xs transition-colors ${step >= s ? "text-paper" : "text-dim"}`}>
                {s === 1 ? "Your details" : "Set password"}
              </span>
              {s < 2 && <div className={`flex-1 h-px transition-colors ${step > s ? "bg-signal/40" : "bg-line/40"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="hu-card p-8">
          {step === 1 ? (
            <form onSubmit={goStep2} className="space-y-4" id="signup-step1">
              <Field label="Full name" htmlFor="signup-name">
                <input
                  id="signup-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="hu-input"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              </Field>

              <Field label="Email address" htmlFor="signup-email">
                <input
                  id="signup-email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="hu-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="Phone number" htmlFor="signup-phone">
                <input
                  id="signup-phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="hu-input"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </Field>

              <Field label="Address" htmlFor="signup-address">
                <textarea
                  id="signup-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="hu-input min-h-20 resize-none"
                  placeholder="Your address"
                  rows={3}
                />
              </Field>

              <Field label="What best describes you?" htmlFor="signup-profession">
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {PROFESSIONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setProfession(p.value as typeof profession)}
                      className={`rounded-lg border px-3 py-2.5 text-left text-xs transition-all duration-150 ${
                        profession === p.value
                          ? "border-signal bg-signal/10 text-signal"
                          : "border-line/60 text-dim hover:border-line hover:text-paper"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </Field>

              <button
                id="signup-next-btn"
                type="submit"
                className="hu-btn-primary mt-2"
              >
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" id="signup-step2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-dim hover:text-paper transition-colors mb-2"
              >
                ← Back
              </button>

              {/* Recap */}
              <div className="rounded-lg bg-ink/60 border border-line/60 px-4 py-3 mb-2">
                <div className="text-xs text-dim">Signing up as</div>
                <div className="font-medium text-paper text-sm mt-0.5">{name}</div>
                <div className="text-xs text-dim">{email}</div>
              </div>

              <Field label="Password" htmlFor="signup-password">
                <div className="relative">
                  <input
                    id="signup-password"
                    required
                    minLength={8}
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="hu-input pr-11"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-paper transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength hint */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 12 ? "bg-green-400" : password.length >= 8 ? "bg-signal" : "bg-red-400"}`} />
                    <span className={`text-[10px] ${password.length >= 12 ? "text-green-400" : password.length >= 8 ? "text-signal" : "text-red-400"}`}>
                      {password.length >= 12 ? "Strong" : password.length >= 8 ? "Good" : "Too short"}
                    </span>
                  </div>
                )}
              </Field>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="hu-btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-line/60" />
            <span className="text-xs text-dim">or</span>
            <div className="flex-1 h-px bg-line/60" />
          </div>

          <p className="text-center text-sm text-dim">
            Already have an account?{" "}
            <Link href="/login" className="text-signal font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-dim">
          By signing up, you agree to our{" "}
          <span className="text-paper/50">Terms of Service</span>.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block mb-1.5 text-xs font-medium text-dim uppercase tracking-wider"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
