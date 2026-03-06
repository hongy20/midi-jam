import type { ReactNode } from "react";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  header?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PageLayout({
  header = <header />,
  footer,
  children,
  className = "",
  style,
}: PageLayoutProps) {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {header}
      <main className={styles.main}>{children}</main>
      {footer}
    </div>
  );
}
