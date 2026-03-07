"use client";

import type { HTMLAttributes } from "react";
import styles from "./stat-card.module.css";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  variant?: "small" | "large";
}

export function StatCard({
  label,
  value,
  variant = "small",
  className = "",
  ...props
}: StatCardProps) {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${className}`}
      {...props}
    >
      {variant === "large" && <div className={styles.glossyOverlay} />}

      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>

      {variant === "large" && <div className={styles.glow} />}
    </div>
  );
}
