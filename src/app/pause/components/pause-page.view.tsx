"use client";

import PauseMenu from "@/shared/components/ui/8bit/blocks/pause-menu";

interface PausePageViewProps {
  onContinue: () => void;
  onRestart: () => void;
  onOptions: () => void;
  onQuit: () => void;
}

export function PausePageView({ onContinue, onRestart, onOptions, onQuit }: PausePageViewProps) {
  return (
    <main className="bg-background flex h-dvh w-screen items-center justify-center overflow-hidden p-4 select-none">
      <PauseMenu
        onContinue={onContinue}
        onRestart={onRestart}
        onOptions={onOptions}
        onQuit={onQuit}
      />
    </main>
  );
}
