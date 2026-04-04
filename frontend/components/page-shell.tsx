import { ReactNode } from "react";
import styles from "./page-shell.module.css";

type PageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className={`mx-auto w-full max-w-6xl px-4 py-8 ${styles.main}`}>
      <section className={`mb-8 ${styles.hero}`}>
        <h1 className={`text-3xl font-semibold tracking-tight ${styles.title}`}>{title}</h1>
        {description ? <p className={`mt-2 text-sm text-zinc-600 dark:text-zinc-400 ${styles.description}`}>{description}</p> : null}
      </section>
      {children}
    </main>
  );
}
