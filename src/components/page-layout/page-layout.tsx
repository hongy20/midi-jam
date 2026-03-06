import type { ReactNode } from "react";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  header?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  style?: React.CSSProperties;
}

export function PageLayout({
  header = <header />,
  footer,
  children,
  style,
}: PageLayoutProps) {
  return (
    <div className={styles.container} style={style}>
      {header}
      {children}
      {footer}
    </div>
  );
}
