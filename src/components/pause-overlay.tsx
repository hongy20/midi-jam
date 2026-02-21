"use client";

import { LogOut, Play, RotateCcw, Settings } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

export function PauseOverlay({
  onResume,
  onRestart,
  onSettings,
  onQuit,
}: PauseOverlayProps) {
  const buttonClass =
    "flex items-center justify-center gap-3 w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl transition-all hover:bg-foreground/20 hover:scale-[1.02] active:scale-[0.98]";

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="text-center flex flex-col gap-4 sm:gap-6 w-full max-w-[320px] sm:max-w-sm animate-in zoom-in-95 duration-300">
        <h1 className="text-5xl sm:text-6xl font-black text-foreground italic uppercase tracking-tighter mb-2 sm:mb-4 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
          Paused
        </h1>

        <button type="button" onClick={onResume} className={buttonClass}>
          <Play className="w-5 h-5 fill-current" />
          RESUME
        </button>

        <button type="button" onClick={onRestart} className={buttonClass}>
          <RotateCcw className="w-5 h-5" />
          RESTART
        </button>

        <button type="button" onClick={onSettings} className={buttonClass}>
          <Settings className="w-5 h-5" />
          SETTINGS
        </button>

        <button
          type="button"
          onClick={onQuit}
          className={`${buttonClass} text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]`}
        >
          <LogOut className="w-5 h-5" />
          QUIT GAME
        </button>
      </div>
    </div>
  );
}
