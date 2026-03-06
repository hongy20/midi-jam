"use client";

import { ArrowLeft, ChevronRight, Piano } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useNavigation } from "@/hooks/use-navigation";

function GearContent() {
  const { toCollection, toHome, toPause } = useNavigation();
  const searchParams = useSearchParams();
  const fromGame = searchParams.get("from") === "game";

  const { gear: contextGear } = useAppContext();
  const { selectMIDIInput, selectedMIDIInput } = contextGear;
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
      if (fromGame) {
        toPause();
      } else {
        toCollection();
      }
    }
  };

  return (
    <PageLayout
      header={
        <PageHeader title={fromGame ? "Reconnect Gear" : "Your Gear"}>
          <Button
            variant="secondary"
            icon={ArrowLeft}
            iconPosition="left"
            onClick={toHome}
            size="sm"
          >
            {fromGame ? "Back to Menu" : "Main Menu"}
          </Button>
        </PageHeader>
      }
      footer={
        <PageFooter>
          <Button
            onClick={handleContinue}
            disabled={!selected}
            icon={ChevronRight}
            size="sm"
          >
            {fromGame ? "RESUME GAME" : "CONTINUE"}
          </Button>
        </PageFooter>
      }
    >
      <main
        className={`w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar py-4 px-8 -mx-8 min-h-0 max-w-5xl mx-auto flex flex-col gap-8`}
      >
        <p className="text-center text-foreground/60 text-lg sm:text-xl font-medium">
          {isLoading
            ? "Searching for gear..."
            : inputs.length > 0
              ? fromGame
                ? "The game is paused. Please reconnect your gear to continue."
                : "Play a note on your gear to select it, or tap a card below."
              : "No gear found. Please connect a keyboard and refresh."}
        </p>

        {error && (
          <div className="p-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded-xl text-center">
            {error}
          </div>
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12 no-scrollbar`}
        >
          {inputs.map((inst) => {
            const isSelected = selected === inst.id;
            const isActive = lastInputId === inst.id;

            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => setSelected(inst.id)}
                className={`group relative p-5 sm:p-8 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col gap-3 sm:gap-4 overflow-hidden ${
                  isSelected
                    ? "bg-foreground border-foreground scale-[1.02] shadow-[var(--ui-btn-primary-shadow)]"
                    : "bg-[var(--ui-card-bg)] border-[var(--ui-card-border)] hover:border-foreground/30 hover:bg-foreground/10"
                }`}
              >
                {/* Active Pulse Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr from-accent-primary/20 to-transparent transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-colors relative z-10 ${
                    isSelected
                      ? "bg-background text-foreground"
                      : "bg-background/50 text-foreground/60"
                  }`}
                >
                  <Piano className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div className="flex flex-col relative z-10 min-w-0">
                  <span
                    className={`text-lg sm:text-xl font-bold truncate ${isSelected ? "text-background" : "text-foreground"}`}
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
    </PageLayout>
  );
}

export default function GearPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-[100dvh] gap-4">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <span className="font-bold uppercase tracking-widest text-xs">
            Loading Gear Setup...
          </span>
        </div>
      }
    >
      <GearContent />
    </Suspense>
  );
}
