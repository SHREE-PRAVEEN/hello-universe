"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, setStoredUser, getStoredUser } from "@/lib/api";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      await api.verifyOtp(email, otp);
      
      // Update stored user if available
      const user = getStoredUser();
      if (user) {
        user.verified = true;
        setStoredUser(user);
        window.dispatchEvent(new Event("storage"));
      }
      
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please check your code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setError(null);
    setResendSuccess(false);
    try {
      await api.resendOtp(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-signal to-[#ff6b00] flex items-center justify-center text-ink font-black text-xl shadow-lg shadow-signal/20 mb-4">
            HU
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-paper">
            Verify your email
          </h1>
          <p className="mt-1 text-sm text-dim text-center">
            We sent a 6-digit code to <br />
            <span className="text-paper font-medium">{email}</span>
          </p>
        </div>

        {/* Card */}
        <div className="hu-card p-8">
          <form onSubmit={handleVerify} className="space-y-5" id="verify-form">
            <div>
              <label
                htmlFor="verify-otp"
                className="block mb-1.5 text-xs font-medium text-dim uppercase tracking-wider"
              >
                Verification Code
              </label>
              <input
                id="verify-otp"
                required
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.toUpperCase())}
                className="hu-input text-center text-xl tracking-[0.5em] font-mono"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {resendSuccess && (
              <div className="flex items-start gap-2.5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <p className="text-sm text-green-400">A new code has been sent!</p>
              </div>
            )}

            <button
              id="verify-submit"
              type="submit"
              disabled={loading || !otp || otp.length < 6}
              className="hu-btn-primary flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-dim hover:text-paper transition-colors disabled:opacity-50"
            >
              {resending ? "Sending..." : "Didn't receive a code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
