import Link from "next/link";
import { AuthPanel } from "@/components/auth-panel";
import { PageShell } from "@/components/page-shell";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <PageShell
      title="Build. Learn. Deploy Robotics."
      description="Hello Universe combines structured robotics learning, real-world solutions, a components marketplace, and DIY build workflows."
    >
      <AuthPanel />
      <section className={`grid gap-4 md:grid-cols-2 ${styles.quickGrid}`}>
        <Link href="/courses" className={styles.quickLink}>
          <h2 className="text-xl font-semibold">Learning Program</h2>
          <p className={`text-sm ${styles.quickText}`}>Beginner to advanced robotics courses with lessons and progress tracking.</p>
        </Link>
        <Link href="/solutions" className={styles.quickLink}>
          <h2 className="text-xl font-semibold">Solutions Hub</h2>
          <p className={`text-sm ${styles.quickText}`}>Discover robotics solutions for agriculture, security, home, and industry.</p>
        </Link>
        <Link href="/marketplace" className={styles.quickLink}>
          <h2 className="text-xl font-semibold">Marketplace</h2>
          <p className={`text-sm ${styles.quickText}`}>Browse parts, kits, sensors, motors, and controllers with cart and ordering.</p>
        </Link>
        <Link href="/configurator" className={styles.quickLink}>
          <h2 className="text-xl font-semibold">Robot Configurator</h2>
          <p className={`text-sm ${styles.quickText}`}>Get a recommended robot design from your budget and use-case.</p>
        </Link>
      </section>
    </PageShell>
  );
}
