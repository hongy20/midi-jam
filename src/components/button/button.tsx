import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon: Icon,
  iconPosition = "right",
  children,
  ...props
}: ButtonProps) {
  // Use displayName or name to detect arrow types for special animations
  const iconName = Icon?.displayName || Icon?.name || "";
  const isArrowRight =
    iconName.includes("ChevronRight") || iconName.includes("ArrowRight");
  const isArrowLeft =
    iconName.includes("ArrowLeft") || iconName.includes("ChevronLeft");

  const iconClasses = `
    ${styles.icon} 
    ${isArrowRight ? styles.iconSlideRight : ""} 
    ${isArrowLeft ? styles.iconSlideLeft : ""}
  `;

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ""
      } group`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className={iconClasses} />}
      {children}
      {Icon && iconPosition === "right" && <Icon className={iconClasses} />}
    </button>
  );
}
