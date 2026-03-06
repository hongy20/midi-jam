import type { HTMLAttributes, ReactNode } from "react";
import styles from "./page-layout.module.css";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function PageLayout({
  header = <header />,
  footer,
  children,
  className = "",
  ...props
}: PageLayoutProps) {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      {header}
      {children}
      {footer}
    </div>
  );
}
