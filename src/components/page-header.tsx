import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between py-[var(--header-py)] px-6 sm:px-8 w-full max-w-5xl mx-auto ${className}`}
    >
      {typeof title === "string" ? (
        <h1 className="text-[var(--h1-size)] font-black text-foreground uppercase tracking-tighter">
          {title}
        </h1>
      ) : (
        title
      )}
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
}
