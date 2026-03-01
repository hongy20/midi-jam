"use client";

import { ArrowLeft, ChevronRight, Piano } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import styles from "./page.module.css";


export default function InstrumentsPage() {
  const { navigate } = useGameNavigation();
  const { selectMIDIInput, selectedMIDIInput } = useSelection();
  const { inputs, isLoading, error } = useMIDIDevices();

  const [selected, setSelected] = useState<string | null>(
    selectedMIDIInput?.id || null,
  );
  const [lastInputId, setLastInputId] = useState<string | null>(null);

  useEffect(() => {
    if (lastInputId && lastInputId !== selected) {
      setSelected(lastInputId);
    }
  }, [lastInputId, selected]);

  useEffect(() => {
    // If a device is disconnected and was selected, unselect it.
    if (selected && !inputs.some((input) => input.id === selected)) {
      setSelected(null);
      if (lastInputId === selected) {
        setLastInputId(null);
      }
    }
  }, [inputs, selected, lastInputId]);

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
        selectMIDIInput(instrument);
      }
      navigate("/tracks");
    }
  };

  return (
    <div className={`w-[100dvw] h-[100dvh] bg-background grid grid-rows-[auto_1fr_auto] p-6 landscape:p-4 overflow-hidden ${styles.animateFadeIn} transition-colors duration-500 max-w-5xl mx-auto h-full ${styles.animateSlideUp}`}>
      {/* Header */}
      <header className="py-4 landscape:py-2 flex items-center justify-between flex-shrink-0">
          <h1 className="text-3xl sm:text-4xl landscape:text-2xl font-black text-foreground uppercase tracking-tighter">
            Select Your Instrument
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 px-4 py-2 border border-foreground/10 rounded-full text-foreground/50 font-bold text-[10px] sm:text-xs uppercase hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Main Menu
          </button>
        </header>

        {/* Content */}
        <main className={`overflow-y-auto overflow-x-hidden ${styles.noScrollbar} py-4 landscape:py-2 px-8 -mx-8 min-h-0 w-full max-w-5xl mx-auto flex flex-col gap-8`}>
          <p className={`text-center text-foreground/60 text-lg sm:text-xl font-medium ${styles.animateFadeIn}`}>
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

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12 ${styles.noScrollbar}`}>
            {inputs.map((inst) => {
              const isSelected = selected === inst.id;
              const isActive = lastInputId === inst.id;

              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => setSelected(inst.id)}
                  className={`group relative p-5 sm:p-8 landscape:p-4 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col gap-3 sm:gap-4 overflow-hidden ${
                    isSelected
                      ? "bg-foreground border-foreground scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                      : "bg-foreground/5 border-foreground/10 hover:border-foreground/30 hover:bg-foreground/10"
                  }`}
                >
                  {/* Active Pulse Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr from-accent-primary/20 to-transparent transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 landscape:w-10 landscape:h-10 rounded-2xl flex items-center justify-center transition-colors relative z-10 ${
                      isSelected
                        ? "bg-background text-foreground"
                        : "bg-background/50 text-foreground/60"
                    }`}
                  >
                    <Piano className="w-6 h-6 sm:w-7 sm:h-7 landscape:w-5 landscape:h-5" />
                  </div>

                  <div className="flex flex-col relative z-10 min-w-0">
                    <span
                      className={`text-lg sm:text-xl landscape:text-base font-bold truncate ${isSelected ? "text-background" : "text-foreground"}`}
                      title={inst.name || "Unknown Device"}
                    >
                      {inst.name || "Unknown Device"}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium mt-0.5 sm:mt-1 ${isSelected ? "text-background/70" : "text-foreground/50"}`}
                    >
                      {inst.manufacturer || "Generic MIDI Input"}
                    </span>
                  </div>

                  {/* Pulse ring when active */}
                  {isActive && (
                    <div className="absolute inset-0 border-2 border-transparent rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] z-20 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 landscape:py-2 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selected}
            className={`group px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-black tracking-wider transition-all duration-300 flex items-center gap-2 ${
              selected
                ? "bg-foreground text-background hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
                : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
            }`}
          >
            CONTINUE <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </div>
  );
}
