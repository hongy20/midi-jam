import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./page-header.module.css";

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  title: string;
  icon?: LucideIcon;
  children?: ReactNode;
}

export function PageHeader({
  title,
  icon: Icon,
  children,
  className = "",
  ...props
}: PageHeaderProps) {
  return (
    <header className={`${styles.header} ${className}`} {...props}>
      {Icon && <Icon className={styles.icon} />}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.spacer} />
      {children}
    </header>
  );
}
