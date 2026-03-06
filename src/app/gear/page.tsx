"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button/button";
import { GearCard } from "@/components/gear-card/gear-card";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useNavigation } from "@/hooks/use-navigation";

export default function GearPage() {
  const { toCollection, toHome } = useNavigation();

  const {
    gear: { selectMIDIInput, selectedMIDIInput },
  } = useAppContext();
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
      toCollection();
    }
  };

  return (
    <PageLayout
      header={
        <PageHeader title="Your Gear">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            iconPosition="left"
            onClick={toHome}
            size="sm"
          >
            Main Menu
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
            CONTINUE
          </Button>
        </PageFooter>
      }
    >
      <main
        className={`w-full h-full overflow-y-auto overflow-x-hidden py-4 px-8 -mx-8 min-h-0 max-w-5xl mx-auto flex flex-col gap-8`}
      >
        <p className="text-center text-foreground/60 text-lg sm:text-xl font-medium">
          {isLoading
            ? "Searching for gear..."
            : inputs.length > 0
              ? "Play a note on your gear to select it, or tap a card below."
              : "No gear found. Please connect a keyboard and refresh."}
        </p>

        {error && (
          <div className="p-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded-xl text-center">
            {error}
          </div>
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12`}
        >
          {inputs.map((inst) => (
            <GearCard
              key={inst.id}
              instrument={inst}
              isSelected={selected === inst.id}
              isActive={lastInputId === inst.id}
              onClick={() => setSelected(inst.id)}
            />
          ))}
        </div>
      </main>
    </PageLayout>
  );
}
