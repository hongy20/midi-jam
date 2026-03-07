import type { HTMLAttributes, ReactNode } from "react";
import styles from "./page-footer.module.css";

interface PageFooterProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function PageFooter({
  children,
  className = "",
  ...props
}: PageFooterProps) {
  const isString = typeof children === "string";

  return (
    <footer
      className={`${styles.footer} ${isString ? styles.centered : styles.actions} ${className}`}
      {...props}
    >
      {isString ? <p className={styles.brandingText}>{children}</p> : children}
    </footer>
  );
}
