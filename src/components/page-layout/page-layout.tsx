import type { HTMLAttributes, ReactNode } from "react";
import styles from "./page-layout.module.css";

interface PageLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  header?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function PageLayout({
  header = <header />,
  footer,
  children,
  ...props
}: PageLayoutProps) {
  return (
    <div className={styles.container} {...props}>
      {header}
      {children}
      {footer}
    </div>
  );
}
