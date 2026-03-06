import type { ReactNode } from "react";

interface PageFooterProps {
  children: ReactNode;
  className?: string;
}

export function PageFooter({ children, className = "" }: PageFooterProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-end gap-4 py-[var(--footer-py)] px-6 sm:px-8 w-full max-w-5xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
