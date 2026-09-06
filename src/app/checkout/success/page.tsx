import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-circuit">Payment confirmed</p>
      <h1 className="mt-4 font-display text-2xl font-medium">You&rsquo;re all set.</h1>
      <p className="mt-3 text-dim">
        We&rsquo;ve emailed your software and download link. Check your order history
        any time from your dashboard.
      </p>
      <Link
        href="/dashboard"
        className="mt-10 inline-block rounded-sm bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal/90"
      >
        View my orders
      </Link>
    </section>
  );
}
