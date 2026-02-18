"use client";

import { useSearchParams } from "next/navigation";
import { useGameNavigation } from "@/hooks/use-game-navigation";

export default function SettingsPage() {
  const { goBack } = useGameNavigation();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const handleBack = () => {
    goBack(from);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900/40" />
      </div>

      <header className="relative z-10 w-full max-w-2xl flex items-center justify-between mb-12">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          Settings
        </h1>
        <button
          type="button"
          onClick={handleBack}
          className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform"
        >
          Back
        </button>
      </header>

      <main className="relative z-10 w-full max-w-2xl flex flex-col gap-6">
        {/* Setting Item: Speed */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold uppercase tracking-tight">
              Playback Speed
            </span>
            <span className="text-slate-500 text-sm font-medium">
              Adjust game tempo
            </span>
          </div>
          <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-full border border-slate-800">
            <span className="px-4 text-white font-black">1.0x</span>
          </div>
        </div>

        {/* Setting Item: Theme */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold uppercase tracking-tight">
              Visual Theme
            </span>
            <span className="text-slate-500 text-sm font-medium">
              Coming soon
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-bold uppercase text-xs tracking-widest px-4">
            Aurora
          </div>
        </div>

        {/* Setting Item: Demo Mode */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold uppercase tracking-tight">
              Demo Mode
            </span>
            <span className="text-slate-500 text-sm font-medium">
              Auto-play preview
            </span>
          </div>
          <button
            type="button"
            className="w-16 h-8 bg-slate-800 rounded-full relative transition-colors"
          >
            <div className="absolute left-1 top-1 w-6 h-6 bg-slate-600 rounded-full" />
          </button>
        </div>
      </main>

      <footer className="absolute bottom-12 text-slate-700 text-[10px] uppercase tracking-[0.4em] font-black">
        Midi Jam v0.1.0 • Experimental Build
      </footer>
    </div>
  );
}
