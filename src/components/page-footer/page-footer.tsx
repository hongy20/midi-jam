import type { ReactNode } from "react";
import styles from "./page-footer.module.css";

interface PageFooterProps {
  children: ReactNode;
  className?: string;
}

export function PageFooter({ children, className = "" }: PageFooterProps) {
  return (
    <footer className={`${styles.footer} ${className}`}>{children}</footer>
  );
}
