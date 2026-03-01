"use client";

import { LogOut, Settings } from "lucide-react";
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
        className="group px-6 py-3 bg-foreground text-background rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
      >
        EXIT{" "}
        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
    <div className="w-[100dvw] h-[100dvh] overflow-hidden max-w-5xl mx-auto grid grid-rows-[auto_1fr_auto] p-6 landscape:p-4">
      <header className="w-full flex flex-row items-center justify-between py-[var(--header-py)] gap-4 flex-shrink-0">
        <h1 className="text-[var(--h1-size)] font-black italic uppercase tracking-tighter drop-shadow-md flex items-center gap-3 text-foreground">
          Settings{" "}
          <Settings className="w-8 h-8 sm:w-10 sm:h-10 animate-[spin_10s_linear_infinite]" />
        </h1>
        <Suspense>
          <BackButton />
        </Suspense>
      </header>

      <main
        className={`w-full grid grid-cols-1 landscape:grid-cols-2 gap-3 sm:gap-6 overflow-y-auto no-scrollbar py-4`}
      >
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

      <footer className="py-[var(--footer-py)] text-foreground/40 text-[8px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black w-full text-center flex-shrink-0">
        Midi Jam v0.1.0 • Experimental Build
      </footer>
    </div>
  );
}
