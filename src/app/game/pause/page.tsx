"use client";

import { ArrowLeft, LogOut, Play, RotateCcw, Settings } from "lucide-react";
import { useAppContext } from "@/context/selection-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function PausePage() {
  const { toGame, toResults, toSettings, toHome } = useNavigation();
  const { tracks, instruments, game, results } = useAppContext();
  const { selected: selectedTrack } = tracks;
  const { input: selectedMIDIInput } = instruments;
  const { session: gameSession, setSession: setGameSession } = game;
  const { set: setSessionResults } = results;

  // Note: Redirects are handled by NavigationGuard

  if (!gameSession || !selectedTrack || !selectedMIDIInput) return null;

  const handleResume = () => {
    setGameSession({
      ...gameSession,
      isPaused: false,
    });
    toGame();
  };

  const handleRestart = () => {
    setGameSession({
      ...gameSession,
      isPaused: false,
      score: 0,
      combo: 0,
      currentTimeMs: 0,
    });
    toGame();
  };

  const handleQuit = () => {
    setSessionResults({
      score: gameSession.score,
      accuracy: 0,
      combo: gameSession.combo,
    });
    setGameSession(null);
    toResults();
  };

  const handleSettings = () => {
    toSettings();
  };

  const buttonClass =
    "flex items-center justify-center gap-3 w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl transition-all hover:bg-foreground/20 hover:scale-[1.02] active:scale-[0.98]";

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-hidden grid grid-rows-[auto_1fr_auto] p-6 landscape:p-4 bg-background/80 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex items-center justify-between py-[var(--header-py)] flex-shrink-0">
        <div className="flex flex-col">
          <h1 className="text-[var(--h1-size)] font-black text-foreground uppercase tracking-tighter">
            Paused
          </h1>
          <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] text-[10px]">
            {selectedMIDIInput.name} • {selectedTrack.name}
          </span>
        </div>
      </header>

      {/* Main Menu - Responsive container */}
      <main className="flex items-center justify-center overflow-y-auto no-scrollbar py-8">
        <div className="text-center w-full max-w-[320px] sm:max-w-2xl animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <button
              type="button"
              onClick={handleResume}
              className={buttonClass}
            >
              <Play className="w-5 h-5 fill-current" />
              RESUME
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className={buttonClass}
            >
              <RotateCcw className="w-5 h-5" />
              RESTART
            </button>

            <button
              type="button"
              onClick={handleSettings}
              className={buttonClass}
            >
              <Settings className="w-5 h-5" />
              SETTINGS
            </button>

            <button
              type="button"
              onClick={handleQuit}
              className={`${buttonClass} text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]`}
            >
              <LogOut className="w-5 h-5" />
              QUIT GAME
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between py-[var(--footer-py)] flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
            Current Score
          </span>
          <span className="text-xl font-black tabular-nums leading-none">
            {gameSession.score.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={toHome}
          className="group flex items-center gap-2 px-6 py-3 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/50 font-bold text-xs uppercase hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quit to Menu
        </button>
      </footer>
    </div>
  );
}
