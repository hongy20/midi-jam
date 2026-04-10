"use client";

export function GearEmptyState() {
  return (
    <div className="text-center px-8">
      <h2 className="retro mb-6 font-bold text-2xl tracking-tight md:text-3xl text-foreground/60">
        No gear found.
      </h2>
      <p className="retro text-muted-foreground text-[10px] uppercase tracking-[0.3em] mb-12">
        Please connect a keyboard and refresh.
      </p>
    </div>
  );
}
