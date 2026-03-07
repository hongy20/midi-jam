import type React from "react";

export function SettingItem({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--ui-card-bg)] backdrop-blur-md border border-[var(--ui-card-border)] p-6 sm:p-8 rounded-[var(--ui-card-radius)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-foreground/10 transition-colors">
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
          {title}
        </span>
        <span className="text-foreground/50 text-xs sm:text-sm font-medium">
          {description}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-background/50 p-2 rounded-full border border-foreground/10 self-stretch sm:self-auto justify-center">
        {children}
      </div>
    </div>
  );
}
