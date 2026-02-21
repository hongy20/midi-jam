"use client";

interface PauseOverlayProps {
  isVisible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

export function PauseOverlay({
  isVisible,
  onResume,
  onRestart,
  onSettings,
  onQuit,
}: PauseOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="text-center flex flex-col gap-4 sm:gap-6 w-full max-w-[320px] sm:max-w-sm animate-in zoom-in-95 duration-300">
        <h1 className="text-5xl sm:text-6xl font-black text-foreground italic uppercase tracking-tighter mb-2 sm:mb-4 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
          Paused
        </h1>

        <button
          type="button"
          onClick={onResume}
          className="w-full py-3.5 sm:py-4 bg-foreground text-background rounded-full font-black text-lg sm:text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          RESUME
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl hover:bg-foreground/20 flex items-center justify-center transition-colors"
        >
          RESTART
        </button>
        <button
          type="button"
          onClick={onSettings}
          className="w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl hover:bg-foreground/20 transition-colors"
        >
          SETTINGS ⚙️
        </button>
        <button
          type="button"
          onClick={onQuit}
          className="w-full py-3.5 sm:py-4 text-red-500 rounded-full font-bold text-lg sm:text-xl hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all mt-4"
        >
          QUIT GAME
        </button>
      </div>
    </div>
  );
}
