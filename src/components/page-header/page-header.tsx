import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./page-header.module.css";

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  children?: ReactNode;
}

export function PageHeader({ title, icon: Icon, children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {Icon && <Icon className={styles.icon} />}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.spacer} />
      {children}
    </header>
  );
}
