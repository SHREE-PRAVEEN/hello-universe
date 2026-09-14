"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearToken, clearStoredUser, getStoredUser } from "@/lib/api";
import "./globals.css";

// Metadata must live in a server component — we export it separately
// (Next.js allows metadata export from layout even when children are client)
// Keep the metadata export here for the root HTML title/description.
const META_TITLE = "Hello Universe — Robotics & Artificial Intelligence";
const META_DESCRIPTION =
  "Hello Universe builds intelligent machines, autonomous systems, and AI technology for the real world.";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-ink text-paper antialiased" style={{ fontFamily: "var(--font-body)" }}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync auth state from localStorage
  useEffect(() => {
    const sync = () => {
      const stored = getStoredUser();
      const token = window.localStorage.getItem("hu_token");
      setUser(stored && token ? stored : null);
    };
    sync();
    window.addEventListener("storage", sync);
    // Also refresh on route change (user logs in/out)
    return () => window.removeEventListener("storage", sync);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function handleLogout() {
    clearToken();
    clearStoredUser();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  }

  const navLinks = [
    { label: "Technology", href: "/#technology" },
    { label: "Applications", href: "/#applications" },
    { label: "Products", href: "/products" },
    { label: "My Orders", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-signal to-[#ff6b00] flex items-center justify-center text-ink text-xs font-black">
            HU
          </span>
          <span>Hello Universe</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm text-dim md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-paper transition-colors duration-150"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            // Profile dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                id="profile-btn"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-line/60 bg-panel/80 px-3 py-1.5 hover:border-line transition-all duration-150"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {/* Avatar initial */}
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-signal to-[#ff6b00] flex items-center justify-center text-ink text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-paper font-medium max-w-[100px] truncate hidden sm:block">
                  {user.name.split(" ")[0]}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-dim transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-line/40">
                    <div className="text-xs text-dim truncate">{user.email}</div>
                  </div>
                  {/* Links */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dim hover:text-paper hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      My Orders
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dim hover:text-paper hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Browse Products
                    </Link>
                  </div>
                  {/* Logout */}
                  <div className="border-t border-line/40 py-1">
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Guest buttons
            <>
              <Link href="/login" id="login-link" className="text-dim hover:text-paper transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                id="signup-link"
                className="rounded-lg border border-signal/40 bg-signal/10 px-4 py-2 font-medium text-signal transition-all hover:bg-signal/20 hover:border-signal/60"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-1 p-1.5 text-dim hover:text-paper transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-line/60 bg-ink/98 px-6 py-4 space-y-1 animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm text-dim hover:text-paper transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-3 pt-3 border-t border-line/40 mt-2">
              <Link href="/login" className="flex-1 text-center rounded-lg border border-line py-2 text-sm text-dim hover:text-paper">
                Log in
              </Link>
              <Link href="/signup" className="flex-1 text-center rounded-lg border border-signal/40 bg-signal/10 py-2 text-sm font-medium text-signal">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="border-t border-line/60 mt-8">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-display text-base font-semibold">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-signal to-[#ff6b00] flex items-center justify-center text-ink text-[10px] font-black">
                HU
              </span>
              Hello Universe
            </div>
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
              ["My Orders", "/dashboard"],
              ["Documentation", "/#"],
            ]}
          />
        </div>
        <div className="mt-12 border-t border-line/60 pt-6 text-xs text-dim flex items-center justify-between flex-wrap gap-4">
          <span>© 2026 Hello Universe. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span>Payments: UPI · NOWPayments</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-paper">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-dim">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-paper transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
