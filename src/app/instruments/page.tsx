"use client";

import { useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

import { NavigationLayout } from "@/components/navigation-layout";

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
  const [selected, setSelected] = useState<string | null>(
    selectedInstrument?.id || null,
  );

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
    <NavigationLayout
      title="Instrument Selection"
      step={1}
      totalSteps={2}
      accentColor="blue"
      footer={
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          className={`px-12 py-4 rounded-full text-xl font-bold transition-all ${selected
              ? "bg-white text-slate-950 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
              : "bg-slate-900 text-slate-700 cursor-not-allowed opacity-50"
            }`}
        >
          CONTINUE
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </NavigationLayout>
  );
}

