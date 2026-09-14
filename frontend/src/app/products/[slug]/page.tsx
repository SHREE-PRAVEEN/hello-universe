"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Product } from "@/lib/api";

// ─── Payment methods ──────────────────────────────────────────────────────────
const NOWPAYMENTS_LINK = "https://nowpayments.io/payment/?iid=6340102955";
const UPI_ID = "hello.universe.robotics@oksbi";
const ADMIN_EMAIL = "hello.universe.robotics@gmail.com";

type Method = "nowpayments" | "upi";

const METHODS: { id: Method; label: string; icon: string; blurb: string }[] = [
  {
    id: "nowpayments",
    label: "International Payment",
    icon: "🌐",
    blurb: "Pay securely via NOWPayments — crypto & more. Instant redirect.",
  },
  {
    id: "upi",
    label: "UPI Payment",
    icon: "🇮🇳",
    blurb: "Pay via UPI, then email your screenshot. We'll deliver your software.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [method, setMethod] = useState<Method>("nowpayments");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [upiStage, setUpiStage] = useState<"idle" | "creating" | "done">("idle");
  const [upiOrderId, setUpiOrderId] = useState<string | null>(null);
  const [upiError, setUpiError] = useState<string | null>(null);

  // Check auth
  useEffect(() => {
    const check = () =>
      setIsLoggedIn(!!window.localStorage.getItem("hu_token"));
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  // Load product
  useEffect(() => {
    api
      .getProduct(params.slug)
      .then(setProduct)
      .catch((e) =>
        setPageError(e instanceof Error ? e.message : "Product not found")
      );
  }, [params.slug]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleNowPayments() {
    if (!isLoggedIn) { router.push("/login"); return; }
    // Direct redirect — no backend call needed
    window.open(NOWPAYMENTS_LINK, "_blank", "noopener,noreferrer");
  }

  async function handleUpiConfirm() {
    if (!isLoggedIn) { router.push("/login"); return; }
    if (!product) return;
    setUpiStage("creating");
    setUpiError(null);
    try {
      const { order_id } = await api.createUpiOrder(product.id);
      setUpiOrderId(order_id);
      setUpiStage("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        router.push("/login");
        return;
      }
      setUpiError(msg || "Could not create order. Please try again.");
      setUpiStage("idle");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (pageError && !product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center animate-fade-in">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg text-paper font-semibold mb-2">Product not found</p>
        <p className="text-sm text-dim mb-6">{pageError}</p>
        <button
          onClick={() => router.push("/products")}
          className="hu-btn-primary inline-flex items-center gap-2"
          style={{ width: "auto" }}
        >
          ← Browse products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex gap-2 items-center text-dim text-sm">
          <span className="inline-block w-4 h-4 border-2 border-signal/40 border-t-signal rounded-full animate-spin" />
          Loading product…
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 animate-fade-in">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-1.5 text-xs text-dim hover:text-paper transition-colors mb-8 group"
      >
        <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to products
      </button>

      {/* ─── Product Header Card ─────────────────────────────────────── */}
      <div className="relative rounded-2xl border border-line/60 overflow-hidden mb-6">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-signal via-[#ff6b00] to-signal/40" />

        <div className="p-8 bg-panel/60">
          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-signal/80 bg-signal/8 border border-signal/15 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            {product.category}
          </span>

          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-paper leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 text-dim leading-relaxed text-sm max-w-xl">
            {product.description}
          </p>

          {/* Price row */}
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-lg text-dim font-mono">₹</span>
              <span className="font-mono text-4xl font-bold text-signal tracking-tight">
                {Number(product.price_inr).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-dim px-3 py-1.5 rounded-full border border-line/60 bg-ink/40 flex items-center gap-1.5">
                <svg className="w-3 h-3 text-circuit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                One-time purchase
              </span>
              <span className="text-[11px] text-dim px-3 py-1.5 rounded-full border border-line/60 bg-ink/40 flex items-center gap-1.5">
                <svg className="w-3 h-3 text-circuit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Digital delivery via email
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Not logged in ───────────────────────────────────────────── */}
      {!isLoggedIn && (
        <div className="hu-card p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-signal/20 to-[#ff6b00]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="font-semibold text-paper text-lg mb-1">Sign in to purchase</h3>
          <p className="text-sm text-dim mb-6 max-w-xs mx-auto">
            Log in or create an account to buy this product and access your downloads.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="hu-btn-primary"
          >
            Log in to continue
          </button>
          <p className="mt-3 text-xs text-dim">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-signal hover:underline"
            >
              Sign up free
            </button>
          </p>
        </div>
      )}

      {/* ─── Payment methods (only when logged in, no UPI stage done) ── */}
      {isLoggedIn && upiStage !== "done" && (
        <div className="space-y-3">
          <p className="text-xs text-dim uppercase tracking-widest font-medium mb-4 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            Choose payment method
          </p>

          {METHODS.map((m) => (
            <label
              key={m.id}
              className={`method-card${method === m.id ? " selected" : ""}`}
            >
              <input
                type="radio"
                name="payment_method"
                className="mt-1 accent-[#ffb020]"
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-sm font-semibold text-paper">{m.label}</span>
                </div>
                <span className="block text-xs text-dim mt-0.5">{m.blurb}</span>
              </div>
            </label>
          ))}

          {/* CTA */}
          {method === "nowpayments" && (
            <button
              onClick={handleNowPayments}
              className="hu-btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <span>Pay with NOWPayments</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </button>
          )}

          {method === "upi" && upiStage === "idle" && (
            <button
              onClick={handleUpiConfirm}
              disabled={upiStage !== "idle"}
              className="hu-btn-primary mt-4"
            >
              Proceed with UPI
            </button>
          )}

          {method === "upi" && upiStage === "creating" && (
            <button disabled className="hu-btn-primary mt-4 flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
              Recording your order…
            </button>
          )}

          {upiError && (
            <div className="mt-2 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-400">{upiError}</p>
            </div>
          )}

          {/* Security note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-dim">
            <svg className="w-3.5 h-3.5 text-circuit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Your software link will be emailed as soon as your payment is confirmed.
          </div>
        </div>
      )}

      {/* ─── UPI Instructions Panel ──────────────────────────────────── */}
      {isLoggedIn && upiStage === "done" && (
        <UpiInstructionsPanel
          amount={Number(product.price_inr).toLocaleString("en-IN")}
          productName={product.name}
          orderId={upiOrderId!}
        />
      )}
    </section>
  );
}

// ─── UPI Instructions ─────────────────────────────────────────────────────────
function UpiInstructionsPanel({
  amount,
  productName,
  orderId,
}: {
  amount: string;
  productName: string;
  orderId: string;
}) {
  const [copied, setCopied] = useState<"id" | "amount" | null>(null);

  function copy(text: string, which: "id" | "amount") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Success banner */}
      <div className="rounded-xl bg-circuit/10 border border-circuit/20 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-circuit/20 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-circuit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-circuit">Order recorded successfully</p>
          <p className="text-xs text-dim mt-0.5">Complete payment to receive your software.</p>
        </div>
      </div>

      {/* Step 1 */}
      <div className="hu-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-signal/20 flex items-center justify-center text-signal font-bold text-sm">
            1
          </div>
          <h2 className="font-semibold text-paper">Pay via UPI</h2>
        </div>
        <p className="text-sm text-dim mb-4">
          Open any UPI app (GPay, PhonePe, Paytm, etc.) and send the exact
          amount to:
        </p>

        {/* UPI ID */}
        <div className="flex items-center justify-between gap-3 bg-ink/60 border border-line rounded-lg px-4 py-3 mb-3">
          <div>
            <div className="text-[10px] text-dim uppercase tracking-widest mb-0.5">
              UPI ID
            </div>
            <code className="text-sm font-mono text-paper">{UPI_ID}</code>
          </div>
          <button
            onClick={() => copy(UPI_ID, "id")}
            className={`text-xs shrink-0 px-3 py-1 rounded-md transition-all ${
              copied === "id"
                ? "bg-circuit/15 text-circuit"
                : "text-signal hover:bg-signal/10"
            }`}
          >
            {copied === "id" ? "✓ Copied" : "Copy"}
          </button>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between gap-3 bg-ink/60 border border-signal/30 rounded-lg px-4 py-3">
          <div>
            <div className="text-[10px] text-dim uppercase tracking-widest mb-0.5">
              Amount
            </div>
            <span className="text-xl font-mono font-semibold text-signal">
              ₹{amount}
            </span>
          </div>
          <button
            onClick={() => copy(amount.replace(/,/g, ""), "amount")}
            className={`text-xs shrink-0 px-3 py-1 rounded-md transition-all ${
              copied === "amount"
                ? "bg-circuit/15 text-circuit"
                : "text-signal hover:bg-signal/10"
            }`}
          >
            {copied === "amount" ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Step 2 */}
      <div className="hu-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-signal/20 flex items-center justify-center text-signal font-bold text-sm">
            2
          </div>
          <h2 className="font-semibold text-paper">Email your screenshot</h2>
        </div>
        <p className="text-sm text-dim mb-3">
          After payment, take a screenshot of the confirmation and email it to:
        </p>
        <a
          href={`mailto:${ADMIN_EMAIL}?subject=UPI Payment - ${encodeURIComponent(productName)}&body=Hi, I've completed the UPI payment for "${productName}". Order ID: ${orderId}. Please find the screenshot attached.`}
          className="flex items-center gap-2.5 bg-signal/10 border border-signal/20 rounded-lg px-4 py-3 text-sm text-signal hover:bg-signal/15 transition-colors font-mono"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          {ADMIN_EMAIL}
        </a>
        <p className="mt-3 text-xs text-dim">
          Include your <strong className="text-paper">Order ID: {orderId.slice(0, 8)}…</strong> in the email subject.
        </p>
      </div>

      {/* Step 3 */}
      <div className="hu-card p-6 border-circuit/15">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-circuit/20 flex items-center justify-center text-circuit font-bold text-sm">
            3
          </div>
          <h2 className="font-semibold text-paper">Receive your software</h2>
        </div>
        <p className="text-sm text-dim">
          We'll verify your payment and email your download link to your
          registered email address — usually within a few hours.
        </p>
      </div>

      <div className="text-center mt-2">
        <span className="text-xs text-dim">
          Questions? Email us at{" "}
          <a href={`mailto:${ADMIN_EMAIL}`} className="text-signal hover:underline">
            {ADMIN_EMAIL}
          </a>
        </span>
      </div>
    </div>
  );
}
