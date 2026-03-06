import type { ReactNode } from "react";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageLayout({
  header,
  footer,
  children,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {header && <header className={styles.header}>{header}</header>}
      <main className={styles.main}>{children}</main>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
}
