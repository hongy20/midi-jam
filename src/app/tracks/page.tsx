"use client";

import { useState } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
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
    <NavigationLayout
      title="Soundtrack Selection"
      step={2}
      totalSteps={2}
      accentColor="purple"
      onBack={handleBack}
      backLabel="Instrument Setup"
      footer={
        <button
          type="button"
          onClick={handlePlay}
          disabled={!selected}
          className={`px-12 py-4 rounded-full text-xl font-bold transition-all ${
            selected
              ? "bg-white text-slate-950 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
              : "bg-slate-900 text-slate-700 cursor-not-allowed opacity-50"
          }`}
        >
          LET&apos;S PLAY
        </button>
      }
    >
      <div className="flex flex-col gap-4">
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
      </div>
    </NavigationLayout>
  );
}
