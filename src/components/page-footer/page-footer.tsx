import type { ReactNode } from "react";
import styles from "./page-footer.module.css";

interface PageFooterProps {
  children: ReactNode;
}

export function PageFooter({ children }: PageFooterProps) {
  const isString = typeof children === "string";

  return (
    <footer
      className={`${styles.footer} ${isString ? styles.centered : styles.actions}`}
    >
      {isString ? <p className={styles.brandingText}>{children}</p> : children}
    </footer>
  );
}
