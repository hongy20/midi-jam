"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSelection } from "@/context/selection-context";
import { useTheme } from "@/context/theme-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

const BackButton = () => {
  const { goBack, navigate } = useGameNavigation();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => goBack(from)}
        className="px-6 py-3 bg-foreground/10 text-foreground rounded-full font-bold text-sm tracking-widest uppercase hover:bg-foreground/20 transition-colors"
      >
        BACK
      </button>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-foreground text-background rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform"
      >
        EXIT 🚪
      </button>
    </div>
  );
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { speed, setSpeed, demoMode, setDemoMode } = useSelection();

  const themeOptions = ["neon", "dark", "light"] as const;
  const speedOptions = [
    { label: "Slow", value: 0.5 },
    { label: "Normal", value: 1.0 },
    { label: "Fast", value: 2.0 },
  ] as const;

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-500">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/5" />
      </div>

      <header className="relative z-10 w-full max-w-4xl flex flex-row items-center justify-between mb-4 landscape:mb-2 gap-4">
        <h1 className="text-4xl sm:text-5xl landscape:text-3xl font-black italic uppercase tracking-tighter drop-shadow-md">
          Settings ⚙️
        </h1>
        <Suspense>
          <BackButton />
        </Suspense>
      </header>

      <main className="relative z-10 w-full max-w-5xl grid grid-cols-1 landscape:grid-cols-2 gap-3 sm:gap-6 animate-slide-up">
        {/* Setting Item: Theme */}
        <div className="bg-foreground/5 backdrop-blur-md border border-foreground/10 p-6 sm:p-8 landscape:p-4 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row landscape:flex-col items-start sm:items-center landscape:items-start justify-between gap-6 landscape:gap-3 hover:bg-foreground/10 transition-colors">
          <div className="flex flex-col flex-1">
            <span className="text-xl sm:text-2xl landscape:text-lg font-bold uppercase tracking-tight">
              Visual Theme
            </span>
            <span className="text-foreground/50 text-xs sm:text-sm font-medium">
              Toggle global application style
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-background/50 p-2 rounded-full border border-foreground/10 self-stretch sm:self-auto justify-center">
            {themeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTheme(opt)}
                className={`px-4 sm:px-6 py-2 landscape:px-3 landscape:py-1 rounded-full font-black text-xs sm:text-sm landscape:text-[10px] uppercase tracking-widest transition-all ${
                  theme === opt
                    ? "bg-foreground text-background shadow-md scale-[1.05]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Item: Speed */}
        <div className="bg-foreground/5 backdrop-blur-md border border-foreground/10 p-6 sm:p-8 landscape:p-4 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row landscape:flex-col items-start sm:items-center landscape:items-start justify-between gap-6 landscape:gap-3 hover:bg-foreground/10 transition-colors">
          <div className="flex flex-col flex-1">
            <span className="text-xl sm:text-2xl landscape:text-lg font-bold uppercase tracking-tight">
              Playback Speed
            </span>
            <span className="text-foreground/50 text-xs sm:text-sm font-medium">
              Adjust note fall tempo in game
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-background/50 p-2 rounded-full border border-foreground/10 self-stretch sm:self-auto justify-center">
            {speedOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSpeed(opt.value)}
                className={`px-4 sm:px-6 py-2 landscape:px-3 landscape:py-1 rounded-full font-black text-xs sm:text-sm landscape:text-[10px] uppercase tracking-widest transition-all ${
                  speed === opt.value
                    ? "bg-foreground text-background shadow-md scale-[1.05]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Item: Demo Mode */}
        <div className="bg-foreground/5 backdrop-blur-md border border-foreground/10 p-6 sm:p-8 landscape:p-4 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row landscape:flex-col items-start sm:items-center landscape:items-start justify-between gap-6 landscape:gap-3 hover:bg-foreground/10 transition-colors">
          <div className="flex flex-col flex-1">
            <span className="text-xl sm:text-2xl landscape:text-lg font-bold uppercase tracking-tight">
              Demo Mode
            </span>
            <span className="text-foreground/50 text-xs sm:text-sm font-medium">
              Auto-play previews without instrument
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDemoMode(!demoMode)}
            className={`w-20 sm:w-24 landscape:w-16 h-10 sm:h-12 landscape:h-8 rounded-full relative transition-colors duration-300 self-end sm:self-auto ${
              demoMode
                ? "bg-foreground shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-foreground/20"
            }`}
          >
            <div
              className={`absolute top-1 bottom-1 w-8 sm:w-10 landscape:w-6 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm ${
                demoMode
                  ? "bg-background left-[calc(100%-0.25rem-2rem)] sm:left-[calc(100%-0.25rem-2.5rem)] landscape:left-[calc(100%-0.25rem-1.5rem)] scale-110"
                  : "bg-foreground/50 left-1 scale-90"
              }`}
            />
          </button>
        </div>
      </main>

      <footer className="absolute bottom-6 sm:bottom-12 text-foreground/40 text-[8px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black w-full text-center">
        Midi Jam v0.1.0 • Experimental Build
      </footer>
    </div>
  );
}
