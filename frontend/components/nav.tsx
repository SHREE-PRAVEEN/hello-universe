import Link from "next/link";
import styles from "./nav.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/solutions", label: "Solutions" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/guides", label: "DIY Guides" },
  { href: "/configurator", label: "Configurator" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cart", label: "Cart" },
];

export function Nav() {
  return (
    <header className={styles.header}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className={`text-lg ${styles.brand}`}>
          Hello Universe!
        </Link>
        <div className={`${styles.links} text-sm`}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
