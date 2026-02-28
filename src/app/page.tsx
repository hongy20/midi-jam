"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

export default function WelcomePage() {
  const { navigate } = useGameNavigation();
  const { clearSelection } = useSelection();
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    const hasWebMidi = "requestMIDIAccess" in navigator;
    setIsSupported(hasWebMidi);
    clearSelection();
  }, [clearSelection]);

  const handleStart = () => {
    navigate("/instruments");
  };

  const handleSettings = () => {
    navigate("/settings?from=/");
  };

  return (
    <div className="fixed inset-0 grid grid-rows-[1fr_auto_1fr] landscape:grid-rows-[0.5fr_auto_0.5fr] place-items-center overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* Background Layer: Static/Composite-only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-[spin_60s_linear_infinite]" />
      </div>

      {/* Top Spacer */}
      <div className="w-full h-full" />

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-4 landscape:py-2 animate-slide-up w-full max-w-4xl">
        <div className="mb-8 landscape:mb-4 w-full relative">
          <h1 className="text-6xl sm:text-7xl md:text-9xl landscape:text-5xl font-black mb-4 landscape:mb-2 tracking-tighter uppercase italic bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent transform transition-transform hover:scale-105 select-none drop-shadow-2xl">
            MIDI JAM
          </h1>
          <div className="absolute -inset-4 bg-foreground/20 blur-3xl -z-10 rounded-full animate-pulse px-4" />
        </div>

        {!isSupported && (
          <div className="flex flex-col items-center gap-2 text-red-500 font-bold mb-8 landscape:mb-4 animate-bounce">
            <span className="bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              UNSUPPORTED BROWSER
            </span>
            <p className="text-xs text-red-500/60 max-w-xs">
              This app requires Web MIDI API. Please use Android Chrome or a
              modern Chromium browser.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm sm:text-base md:text-xl landscape:text-xs text-foreground/80 font-medium mb-12 landscape:mb-4 bg-foreground/10 px-6 py-3 landscape:py-2 rounded-full backdrop-blur-sm border border-foreground/20 shadow-lg">
          <Volume2 className="animate-pulse text-foreground/90 w-6 h-6 landscape:w-4 landscape:h-4" />
          <span className="tracking-wide">
            WARNING: AUDIO MAY BE LOUD. CONNECT HEADPHONES/SPEAKERS.
          </span>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 landscape:gap-3 w-full max-w-lg mb-8 landscape:mb-2">
          <button
            type="button"
            onClick={handleStart}
            disabled={!isSupported}
            className={`col-span-1 sm:col-span-2 group relative px-8 py-5 sm:py-6 landscape:py-3 bg-foreground text-background text-xl sm:text-2xl landscape:text-lg font-black rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center gap-3 ${
              !isSupported
                ? "opacity-20 cursor-not-allowed grayscale"
                : "hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            }`}
          >
            <span className="relative z-10">START JAM</span>
            <span className="relative z-10 text-2xl landscape:text-lg group-hover:translate-x-1 transition-transform">
              ▶️
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>

          <button
            type="button"
            onClick={handleSettings}
            className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 px-6 py-4 landscape:py-2 rounded-xl border-2 border-foreground/20 text-foreground hover:bg-foreground/10 hover:border-foreground/40 transition-all font-bold tracking-widest uppercase text-sm landscape:text-xs"
          >
            Settings <span className="text-xl landscape:text-sm">⚙️</span>
          </button>
        </div>
      </main>

      {/* Bottom Spacer / Footer */}
      <footer className="w-full flex items-end justify-center pb-8 landscape:pb-2 z-10">
        <p className="text-foreground/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          The ultimate immersive piano experience
        </p>
      </footer>
    </div>
  );
}
