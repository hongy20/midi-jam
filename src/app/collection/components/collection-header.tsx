"use client";

import "@/shared/components/ui/8bit/styles/retro.css";

interface CollectionHeaderProps {
  title: string;
  description: string;
}

export function CollectionHeader({
  title,
  description,
}: CollectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="retro font-bold text-lg sm:text-2xl md:text-3xl break-words uppercase">
        {title}
      </h2>
      <span className="mx-auto block max-w-xl retro text-muted-foreground text-[9px] uppercase tracking-wider">
        {description}
      </span>
    </div>
  );
}
