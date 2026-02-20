"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

export default function GamePage() {
  const { navigate } = useGameNavigation();
  const {
    selectedInstrument,
    selectedTrack,
    gameSession,
    setGameSession,
    setSessionResults,
  } = useSelection();

  const [timeLeft, setTimeLeft] = useState(gameSession?.timeLeft ?? 15);
  const [isPaused, setIsPaused] = useState(gameSession?.isPaused ?? false);
  const [showOverlay, setShowOverlay] = useState(
    gameSession?.isPaused ?? false,
  );
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
      // Generate randomized results for the demo
      const randomAccuracy = Math.floor(Math.random() * (100 - 30 + 1) + 30); // 30-100%
      const randomScore = Math.floor(Math.random() * 9000) + 1000;
      const randomCombo = Math.floor(Math.random() * 200) + 10;

      setSessionResults({
        score: randomScore,
        accuracy: randomAccuracy,
        combo: randomCombo,
      });

      setGameSession(null); // Clear session on finish
      navigate("/results");
    }
  }, [timeLeft, navigate, setGameSession, setSessionResults]);

  // Handle Pause
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => {
      const nextPaused = !prev;
      setShowOverlay(nextPaused);
      return nextPaused;
    });
  }, []);

  // Handle Restart
  const handleRestart = () => {
    setTimeLeft(15);
    setIsPaused(false);
    setShowOverlay(false);
  };

  const handleQuit = () => {
    setGameSession(null);
    navigate("/results");
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
  }, [isPaused, handleTogglePause]);

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_60%)] animate-[spin_40s_linear_infinite]" />
      </div>

      {/* Game Stage Area (Placeholder) */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] sm:pb-[20vh] z-10">
        <div className="w-full h-1 bg-foreground/10 absolute top-1/2 -translate-y-1/2 backdrop-blur-sm" />
        <div className="text-foreground/5 font-black text-[15vw] select-none pointer-events-none tracking-tighter uppercase italic z-0 animate-pulse">
          JAMMING
        </div>
      </div>

      {/* Top UI */}
      <header className="absolute top-0 w-full p-4 sm:p-8 flex justify-between items-start z-20 layout-padding">
        <div className="flex flex-col max-w-[50%]">
          <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] sm:tracking-widest text-[10px] sm:text-xs mb-1 truncate">
            {selectedInstrument?.name || "Instrument"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tighter truncate">
            {selectedTrack?.name || "Track"}
          </h2>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px]">
              Time Remaining
            </span>
            <span
              className={`text-3xl sm:text-4xl font-black tabular-nums transition-colors duration-300 ${
                timeLeft < 5 ? "text-red-500 animate-pulse" : "text-foreground"
              }`}
            >
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <div className="sm:hidden flex items-center pr-2">
            <span
              className={`text-2xl font-black tabular-nums transition-colors duration-300 ${
                timeLeft < 5 ? "text-red-500 animate-pulse" : "text-foreground"
              }`}
            >
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePause}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-foreground/10 hover:bg-foreground/20 rounded-full flex items-center justify-center transition-colors group backdrop-blur-md border border-foreground/10 shadow-lg"
          >
            <div
              className={`flex gap-1 sm:gap-1.5 transition-transform duration-300 ${
                isPaused ? "scale-90" : "group-hover:scale-110"
              }`}
            >
              <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-foreground rounded-full" />
              <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-foreground rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* Pause Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-300 p-4"
          ref={overlayRef}
        >
          <div className="text-center flex flex-col gap-4 sm:gap-6 w-full max-w-[320px] sm:max-w-sm animate-in zoom-in-95 duration-300">
            <h1 className="text-5xl sm:text-6xl font-black text-foreground italic uppercase tracking-tighter mb-2 sm:mb-4 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
              Paused
            </h1>

            <button
              type="button"
              onClick={handleTogglePause}
              className="w-full py-3.5 sm:py-4 bg-foreground text-background rounded-full font-black text-lg sm:text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              RESUME
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl hover:bg-foreground/20 flexitems-center justify-center transition-colors"
            >
              RESTART
            </button>
            <button
              type="button"
              onClick={() => navigate("/settings?from=/game")}
              className="w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl hover:bg-foreground/20 transition-colors"
            >
              SETTINGS ⚙️
            </button>
            <button
              type="button"
              onClick={handleQuit}
              className="w-full py-3.5 sm:py-4 text-red-500 rounded-full font-bold text-lg sm:text-xl hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all mt-4"
            >
              QUIT GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
