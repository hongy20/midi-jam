import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./page-header.module.css";

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  icon: Icon,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      {Icon && <Icon className={styles.icon} />}
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.spacer} />
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}
