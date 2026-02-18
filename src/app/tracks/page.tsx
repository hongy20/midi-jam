"use client";

import { useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

const TRACKS = [
  {
    id: "moonlight",
    name: "Moonlight Sonata",
    artist: "Beethoven",
    difficulty: "Intermediate",
  },
  {
    id: "claire",
    name: "Claire de Lune",
    artist: "Debussy",
    difficulty: "Hard",
  },
  {
    id: "turkish",
    name: "Turkish March",
    artist: "Mozart",
    difficulty: "Expert",
  },
];

export default function TracksPage() {
  const { navigate } = useGameNavigation();
  const { setTrack, selectedTrack } = useSelection();
  const [selected, setSelected] = useState<string | null>(
    selectedTrack?.id || null,
  );

  const handlePlay = () => {
    if (selected) {
      const track = TRACKS.find((t) => t.id === selected);
      if (track) {
        setTrack({ id: track.id, name: track.name });
      }
      navigate("/game");
    }
  };

  const handleBack = () => {
    navigate("/instruments");
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[10%] left-[10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between mb-12">
        <div className="flex flex-col">
          <span className="text-purple-500 font-bold uppercase tracking-widest text-xs mb-2">
            Step 2 of 2
          </span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Soundtrack Selection
          </h1>
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 border border-slate-700 rounded-full text-slate-400 font-bold text-xs uppercase hover:text-white hover:border-slate-500 transition-colors"
        >
          ← Instrument Setup
        </button>
      </header>

      <main className="relative z-10 w-full max-w-4xl flex flex-col gap-4 mb-12">
        {TRACKS.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => setSelected(track.id)}
            className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 text-left flex items-center justify-between ${
              selected === track.id
                ? "bg-white border-white scale-[1.02] shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="flex items-center gap-6">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selected === track.id
                    ? "bg-slate-950 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xl font-bold ${selected === track.id ? "text-slate-950" : "text-white"}`}
                >
                  {track.name}
                </span>
                <span className="text-sm opacity-60 font-medium">
                  {track.artist}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                selected === track.id
                  ? "bg-slate-100 text-slate-950"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {track.difficulty}
            </span>
          </button>
        ))}
      </main>

      <footer className="relative z-10 w-full max-w-4xl flex justify-end">
        <button
          type="button"
          onClick={handlePlay}
          disabled={!selected}
          className={`px-12 py-4 rounded-full text-xl font-bold transition-all ${
            selected
              ? "bg-white text-slate-950 hover:scale-105 active:scale-95 shadow-xl"
              : "bg-slate-900 text-slate-700 cursor-not-allowed"
          }`}
        >
          LET&apos;S PLAY
        </button>
      </footer>
    </div>
  );
}
