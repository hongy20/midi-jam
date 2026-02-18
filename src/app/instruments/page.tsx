"use client";

import { useState } from "react";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useSelection } from "@/context/selection-context";

const INSTRUMENTS = [
  { id: "piano", name: "Grand Piano", description: "Classic and rich sound" },
  {
    id: "keyboard",
    name: "Electric Keyboard",
    description: "Versatile synth tones",
  },
  {
    id: "midi",
    name: "Unknown MIDI Device",
    description: "Generic MIDI input",
  },
];

export default function InstrumentsPage() {
  const { navigate } = useGameNavigation();
  const { setInstrument, selectedInstrument } = useSelection();
  const [selected, setSelected] = useState<string | null>(selectedInstrument?.id || null);

  const handleContinue = () => {
    if (selected) {
      const instrument = INSTRUMENTS.find((i) => i.id === selected);
      if (instrument) {
        setInstrument({ id: instrument.id, name: instrument.name });
      }
      navigate("/tracks");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between mb-12">
        <div className="flex flex-col">
          <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2">
            Step 1 of 2
          </span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Instrument Selection
          </h1>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            type="button"
            onClick={() => setSelected(inst.id)}
            className={`p-8 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col gap-4 ${selected === inst.id
              ? "bg-white border-white scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400"
              }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected === inst.id
                ? "bg-slate-950 text-white"
                : "bg-slate-800 text-slate-500"
                }`}
            >
              {/* Simple Icon Placeholder */}
              <div className="w-6 h-6 border-2 border-current rounded" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold ${selected === inst.id ? "text-slate-950" : "text-white"}`}
              >
                {inst.name}
              </span>
              <span className="text-sm opacity-60 font-medium">
                {inst.description}
              </span>
            </div>
          </button>
        ))}
      </main>

      <footer className="relative z-10 w-full max-w-4xl flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          className={`px-12 py-4 rounded-full text-xl font-bold transition-all ${selected
            ? "bg-white text-slate-950 hover:scale-105 active:scale-95 shadow-xl"
            : "bg-slate-900 text-slate-700 cursor-not-allowed"
            }`}
        >
          CONTINUE
        </button>
      </footer>
    </div>
  );
}
