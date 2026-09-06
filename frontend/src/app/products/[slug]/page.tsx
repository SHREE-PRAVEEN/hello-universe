"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Product, PayUPaymentParams, CryptoPaymentInfo, PaymentMethod, Order } from "@/lib/api";

const METHODS: { id: PaymentMethod; label: string; blurb: string }[] = [
  { id: "payu", label: "Card / UPI / Netbanking", blurb: "Pay with PayU — instant confirmation." },
  { id: "nowpayments", label: "Crypto — quick checkout", blurb: "Pay USDT via a hosted gateway, any chain it supports." },
  { id: "usdt_trc20", label: "Crypto — send directly", blurb: "Send USDT (TRC-20) straight from your own wallet." },
];

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("payu");
  const [payuParams, setPayuParams] = useState<PayUPaymentParams | null>(null);
  const [cryptoInfo, setCryptoInfo] = useState<CryptoPaymentInfo | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    api
      .getProduct(params.slug)
      .then(setProduct)
      .catch((e) => setError(e instanceof Error ? e.message : "Product not found"));
  }, [params.slug]);

  useEffect(() => {
    if (payuParams && formRef.current) {
      formRef.current.submit();
    }
  }, [payuParams]);

  // Poll order status while a crypto payment is awaiting confirmation.
  useEffect(() => {
    if (!orderId || !cryptoInfo) return;
    const poll = setInterval(async () => {
      try {
        const order: Order = await api.getOrder(orderId);
        if (order.status === "success") {
          clearInterval(poll);
          router.push("/checkout/success");
        } else if (order.status === "failed") {
          clearInterval(poll);
          router.push("/checkout/failed");
        }
      } catch {
        // transient network errors are fine — next tick retries
      }
    }, 8000);
    return () => clearInterval(poll);
  }, [orderId, cryptoInfo, router]);

  async function handleBuy() {
    if (!product) return;
    setError(null);
    setBuying(true);
    try {
      const result = await api.createOrder(product.id, method);
      setOrderId(result.order_id);
      if (result.payu) setPayuParams(result.payu);
      if (result.crypto) setCryptoInfo(result.crypto);
    } catch (e) {
      if (e instanceof Error && e.message.toLowerCase().includes("unauthorized")) {
        router.push("/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Could not start checkout");
    } finally {
      setBuying(false);
    }
  }

  async function handleIveSentIt() {
    if (!orderId) return;
    setError(null);
    try {
      const order = await api.checkCryptoPayment(orderId);
      if (order.status === "success") router.push("/checkout/success");
      else setError("No matching payment found yet — it can take a few minutes to confirm on-chain.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check payment status");
    }
  }

  if (error && !product) {
    return <p className="mx-auto max-w-2xl px-6 py-24 text-sm text-red-400">{error}</p>;
  }

  if (!product) {
    return <p className="mx-auto max-w-2xl px-6 py-24 text-sm text-dim">Loading…</p>;
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <span className="font-mono text-[11px] uppercase tracking-wide text-dim">{product.category}</span>
      <h1 className="mt-2 font-display text-3xl font-medium">{product.name}</h1>
      <p className="mt-4 text-dim">{product.description}</p>

      <div className="mt-10 border-t border-line pt-8">
        <span className="font-mono text-2xl text-signal">
          ₹{Number(product.price_inr).toLocaleString("en-IN")}
        </span>

        {!cryptoInfo && !payuParams && (
          <>
            <fieldset className="mt-8">
              <legend className="mb-3 text-sm text-dim">How would you like to pay?</legend>
              <div className="space-y-2">
                {METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition ${
                      method === m.id ? "border-signal bg-signal/5" : "border-line hover:border-dim"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      className="mt-1"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                    />
                    <span>
                      <span className="block text-sm font-medium text-paper">{m.label}</span>
                      <span className="block text-xs text-dim">{m.blurb}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              onClick={handleBuy}
              disabled={buying}
              className="mt-8 w-full rounded-sm bg-signal py-3 text-sm font-medium text-ink transition hover:bg-signal/90 disabled:opacity-50"
            >
              {buying ? "Preparing checkout…" : "Buy now"}
            </button>
          </>
        )}

        {cryptoInfo && (
          <CryptoCheckoutPanel
            info={cryptoInfo}
            method={method}
            onIveSentIt={method === "usdt_trc20" ? handleIveSentIt : undefined}
          />
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {!cryptoInfo && !payuParams && (
          <p className="mt-6 text-xs text-dim">
            Your software link is emailed to you as soon as the payment is confirmed.
          </p>
        )}
      </div>

      {/* Hidden auto-submitting form to PayU's hosted checkout */}
      {payuParams && (
        <form ref={formRef} method="post" action={payuParams.action_url} className="hidden">
          <input type="hidden" name="key" value={payuParams.key} />
          <input type="hidden" name="txnid" value={payuParams.txnid} />
          <input type="hidden" name="amount" value={payuParams.amount} />
          <input type="hidden" name="productinfo" value={payuParams.productinfo} />
          <input type="hidden" name="firstname" value={payuParams.firstname} />
          <input type="hidden" name="email" value={payuParams.email} />
          <input type="hidden" name="phone" value={payuParams.phone} />
          <input type="hidden" name="surl" value={payuParams.surl} />
          <input type="hidden" name="furl" value={payuParams.furl} />
          <input type="hidden" name="hash" value={payuParams.hash} />
        </form>
      )}
    </section>
  );
}

function CryptoCheckoutPanel({
  info,
  method,
  onIveSentIt,
}: {
  info: CryptoPaymentInfo;
  method: PaymentMethod;
  onIveSentIt?: () => void;
}) {
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);

  function copy(text: string, which: "address" | "amount") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="mt-8 rounded-sm border border-line bg-panel p-6">
      <p className="text-sm text-dim">
        {method === "usdt_trc20"
          ? "Send exactly this amount of USDT on the Tron (TRC-20) network to:"
          : `Send exactly this amount of ${info.pay_currency.toUpperCase()} to:`}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-line bg-panel2 p-3">
        <code className="break-all text-xs text-paper">{info.pay_address}</code>
        <button
          onClick={() => copy(info.pay_address, "address")}
          className="shrink-0 text-xs text-signal hover:underline"
        >
          {copied === "address" ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-sm border border-line bg-panel2 p-3">
        <span className="font-mono text-sm text-paper">
          {info.pay_amount} {method === "usdt_trc20" ? "USDT" : info.pay_currency.toUpperCase()}
        </span>
        <button
          onClick={() => copy(info.pay_amount, "amount")}
          className="shrink-0 text-xs text-signal hover:underline"
        >
          {copied === "amount" ? "Copied" : "Copy"}
        </button>
      </div>

      {method === "usdt_trc20" && (
        <>
          <p className="mt-4 text-xs text-dim">
            Sending a different amount will prevent the payment from matching your
            order automatically — the extra decimal digits are how we tell orders
            apart on a shared wallet address. Confirmation can take a few minutes.
          </p>
          <button
            onClick={onIveSentIt}
            className="mt-5 w-full rounded-sm border border-line py-3 text-sm font-medium text-paper transition hover:border-dim"
          >
            I&rsquo;ve sent it — check now
          </button>
        </>
      )}

      {method === "nowpayments" && (
        <p className="mt-4 text-xs text-dim">
          We&rsquo;ll confirm automatically once the network confirms your transfer —
          this page updates on its own.
        </p>
      )}
    </div>
  );
}
