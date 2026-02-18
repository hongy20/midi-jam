"use client";

import { useEffect, useRef, useState } from "react";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useSelection } from "@/context/selection-context";

export default function GamePage() {
  const { navigate } = useGameNavigation();
  const { selectedInstrument, selectedTrack, gameSession, setGameSession } = useSelection();

  const [timeLeft, setTimeLeft] = useState(gameSession?.timeLeft ?? 15);
  const [isPaused, setIsPaused] = useState(gameSession?.isPaused ?? false);
  const [showOverlay, setShowOverlay] = useState(gameSession?.isPaused ?? false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync state to context for persistence during navigation
  useEffect(() => {
    setGameSession({ timeLeft, isPaused });
  }, [timeLeft, isPaused, setGameSession]);

  // Timer logic
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  // Auto-navigate on completion
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameSession(null); // Clear session on finish
      navigate("/results");
    }
  }, [timeLeft, navigate, setGameSession]);

  // Handle Pause
  const handleTogglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    setShowOverlay(nextPaused);
  };

  // Handle Restart
  const handleRestart = () => {
    setTimeLeft(15);
    setIsPaused(false);
    setShowOverlay(false);
  };

  // Keyboard support (Esc to pause) and Browser-back trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleTogglePause();
      }
    };

    const handleBrowserBack = () => {
      console.log("Game pausing due to browser back");
      if (!isPaused) handleTogglePause();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("app:browser-back", handleBrowserBack);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("app:browser-back", handleBrowserBack);
    };
  }, [isPaused]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Game Stage Area (Placeholder) */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32">
        <div className="w-full h-1 bg-slate-800 absolute top-1/2 -translate-y-1/2 opacity-20" />
        <div className="text-white/5 font-black text-[20vw] select-none pointer-events-none tracking-tighter uppercase italic">
          JAMMING
        </div>
      </div>

      {/* Top UI */}
      <header className="absolute top-0 w-full p-8 flex justify-between items-start z-10">
        <div className="flex flex-col">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">
            Playing {selectedInstrument?.name || "Instrument"}
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {selectedTrack?.name || "Moonlight Sonata"}
          </h2>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Time Remaining
            </span>
            <span
              className={`text-4xl font-black tabular-nums transition-colors duration-300 ${timeLeft < 5 ? "text-red-500 animate-pulse" : "text-white"
                }`}
            >
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePause}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
          >
            <div
              className={`flex gap-1.5 transition-transform duration-300 ${isPaused ? "scale-90" : "group-hover:scale-110"
                }`}
            >
              <div className="w-2 h-6 bg-white rounded-full" />
              <div className="w-2 h-6 bg-white rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* Pause Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300"
          ref={overlayRef}
          onKeyDown={(e) => {
            // Modal focus trap logic placeholder
            if (e.key === "Escape") handleTogglePause();
          }}
        >
          <div className="text-center flex flex-col gap-6 max-w-sm w-full p-8 animate-in zoom-in-95 duration-300">
            <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
              Paused
            </h1>

            <button
              type="button"
              onClick={handleTogglePause}
              className="w-full py-4 bg-white text-slate-950 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              RESUME
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-xl hover:bg-slate-800 transition-colors"
            >
              RESTART
            </button>
            <button
              type="button"
              onClick={() => navigate("/settings?from=/game")}
              className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-xl hover:bg-slate-800 transition-colors"
            >
              SETTINGS
            </button>
            <button
              type="button"
              onClick={() => navigate("/results")}
              className="w-full py-4 text-red-500 rounded-full font-bold text-xl hover:bg-red-500/10 transition-colors"
            >
              QUIT GAME
            </button>
          </div>
        </div>
      )}

      {/* Visualizer Placeholder */}
      <div className="relative w-full h-full pointer-events-none opacity-50 flex items-center justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>
    </div>
  );
}
