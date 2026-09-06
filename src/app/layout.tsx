import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Hello Universe — Robotics & Artificial Intelligence",
  description:
    "Hello Universe builds intelligent machines, autonomous systems, and AI technology for the real world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink text-paper font-body antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          Hello Universe
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-dim md:flex">
          <Link href="/#technology" className="hover:text-paper">Technology</Link>
          <Link href="/#applications" className="hover:text-paper">Applications</Link>
          <Link href="/products" className="hover:text-paper">Products</Link>
          <Link href="/dashboard" className="hover:text-paper">Orders</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-dim hover:text-paper">Log in</Link>
          <Link
            href="/signup"
            className="rounded-sm border border-signal/40 bg-signal/10 px-4 py-2 font-medium text-signal transition hover:bg-signal/20"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-line/80">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-base font-medium">Hello Universe</div>
            <p className="mt-2 max-w-[22ch] text-sm text-dim">
              Robotics &amp; Artificial Intelligence
            </p>
          </div>
          <FooterColumn
            title="Explore"
            links={[
              ["Robotics", "/#technology"],
              ["Artificial Intelligence", "/#technology"],
              ["Autonomous Systems", "/#how-it-works"],
              ["Research", "/#research"],
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              ["About", "/#vision"],
              ["Careers", "/#contact"],
              ["Contact", "/#contact"],
            ]}
          />
          <FooterColumn
            title="Developers"
            links={[
              ["Products", "/products"],
              ["Documentation", "/#"],
              ["GitHub", "/#"],
            ]}
          />
        </div>
        <div className="mt-12 border-t border-line/80 pt-6 text-xs text-dim">
          © 2026 Hello Universe
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-medium text-paper">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-dim">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-paper">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
