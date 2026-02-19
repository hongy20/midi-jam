"use client";

import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

export default function WelcomePage() {
  const { navigate } = useGameNavigation();
  const { clearSelection } = useSelection();

  const handleStart = () => {
    clearSelection(); // Fresh start for everything
    navigate("/instruments");
  };

  const handleSettings = () => {
    navigate("/settings?from=/");
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Aurora Mesh Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse duration-[12s]" />
      </div>

      <main className="relative z-10 text-center animate-in fade-in zoom-in-95 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">
          Midi Jam
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium">
          The ultimate immersive piano experience
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleStart}
            className="px-12 py-4 bg-white text-slate-950 text-xl font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            START JAM
          </button>

          <button
            type="button"
            onClick={handleSettings}
            className="text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            Settings
          </button>
        </div>
      </main>

      <footer className="absolute bottom-8 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        Inspired by performance • Built for precision
      </footer>
    </div>
  );
}
