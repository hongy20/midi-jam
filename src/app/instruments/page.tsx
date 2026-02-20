"use client";

import { useEffect, useState } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useMIDIDevices } from "@/hooks/use-midi-devices";

export default function InstrumentsPage() {
  const { navigate } = useGameNavigation();
  const { setInstrument, selectedInstrument } = useSelection();
  const { inputs, isLoading, error } = useMIDIDevices();

  const [selected, setSelected] = useState<string | null>(
    selectedInstrument?.id || null,
  );
  const [lastInputId, setLastInputId] = useState<string | null>(null);

  useEffect(() => {
    if (lastInputId && lastInputId !== selected) {
      setSelected(lastInputId);
    }
  }, [lastInputId, selected]);

  useEffect(() => {
    // Attach listener to all inputs to detect activity
    const handlers = new Map<string, (e: Event) => void>();

    inputs.forEach((input) => {
      const handler = () => {
        setLastInputId(input.id);
      };
      input.addEventListener("midimessage", handler);
      handlers.set(input.id, handler);
    });

    return () => {
      inputs.forEach((input) => {
        const handler = handlers.get(input.id);
        if (handler) {
          input.removeEventListener("midimessage", handler);
        }
      });
    };
  }, [inputs]);

  const handleContinue = () => {
    if (selected) {
      const instrument = inputs.find((i) => i.id === selected);
      if (instrument) {
        setInstrument({ id: instrument.id, name: instrument.name });
      } else {
        // Fallback or explicit mapping? No, we require a matched instrument from API or keep fallback.
        // What if user had previously selected something not in the list?
        // the spec says we use Web MIDI API to populate devices
      }
      navigate("/tracks");
    }
  };

  return (
    <NavigationLayout
      title="Select Your Instrument"
      step={1}
      totalSteps={2}
      accentColor="blue"
      footer={
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          className={`px-12 py-4 rounded-full text-xl font-black tracking-wider transition-all duration-300 ${
            selected
              ? "bg-foreground text-background hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
              : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
          }`}
        >
          CONTINUE ▶️
        </button>
      }
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 h-full">
        <p className="text-center text-foreground/60 text-lg sm:text-xl font-medium animate-fade-in">
          {isLoading
            ? "Searching for MIDI devices..."
            : inputs.length > 0
              ? "Play a note on your MIDI keyboard to select it, or tap a card below."
              : "No MIDI devices found. Please connect a keyboard and refresh."}
        </p>

        {error && (
          <div className="p-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto no-scrollbar pb-12">
          {inputs.map((inst) => {
            const isSelected = selected === inst.id;
            const isActive = lastInputId === inst.id;

            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => setSelected(inst.id)}
                className={`group relative p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col gap-4 overflow-hidden ${
                  isSelected
                    ? "bg-foreground border-foreground scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    : "bg-foreground/5 border-foreground/10 hover:border-foreground/30 hover:bg-foreground/10"
                }`}
              >
                {/* Active Pulse Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-colors relative z-10 ${
                    isSelected
                      ? "bg-background text-foreground"
                      : "bg-background/50 text-foreground/60"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Piano</title>
                    <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2z" />
                    <path d="M8 2v8" />
                    <path d="M12 2v8" />
                    <path d="M16 2v8" />
                  </svg>
                </div>

                <div className="flex flex-col relative z-10">
                  <span
                    className={`text-xl font-bold truncate ${isSelected ? "text-background" : "text-foreground"}`}
                    title={inst.name || "Unknown Device"}
                  >
                    {inst.name || "Unknown Device"}
                  </span>
                  <span
                    className={`text-sm font-medium mt-1 ${isSelected ? "text-background/70" : "text-foreground/50"}`}
                  >
                    {inst.manufacturer || "Generic MIDI Input"}
                  </span>
                </div>

                {/* Pulse ring when active */}
                {isActive && (
                  <div className="absolute inset-0 border-2 border-transparent rounded-3xl animate-[countdown-pulse_1s_ease-out_infinite] shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] z-20 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </NavigationLayout>
  );
}
