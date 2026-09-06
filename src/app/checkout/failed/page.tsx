import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-red-400">Payment failed</p>
      <h1 className="mt-4 font-display text-2xl font-medium">That didn&rsquo;t go through.</h1>
      <p className="mt-3 text-dim">
        No amount was captured for a failed transaction. You can try again from the
        product page.
      </p>
      <Link
        href="/products"
        className="mt-10 inline-block rounded-sm border border-line px-6 py-3 text-sm font-medium text-paper transition hover:border-dim"
      >
        Back to products
      </Link>
    </section>
  );
}
