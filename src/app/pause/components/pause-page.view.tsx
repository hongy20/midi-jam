"use client";

import PauseMenu from "@/components/ui/8bit/blocks/pause-menu";

interface PausePageViewProps {
  onContinue: () => void;
  onRestart: () => void;
  onOptions: () => void;
  onQuit: () => void;
}

export function PausePageView({
  onContinue,
  onRestart,
  onOptions,
  onQuit,
}: PausePageViewProps) {
  return (
    <main className="w-screen h-[100dvh] flex items-center justify-center p-4 bg-background overflow-hidden select-none">
      <PauseMenu
        onContinue={onContinue}
        onRestart={onRestart}
        onOptions={onOptions}
        onQuit={onQuit}
      />
    </main>
  );
}
