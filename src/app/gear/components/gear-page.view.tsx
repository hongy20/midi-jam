"use client";

import { Piano } from "lucide-react";
import Feature3, {
  type CarouselFeature,
} from "@/components/ui/8bit/blocks/feature3";

interface GearPageViewProps {
  inputs: WebMidi.MIDIInput[];
  selectedMIDIInput: WebMidi.MIDIInput | null;
  onSelect: (input: WebMidi.MIDIInput) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function GearPageView({
  inputs,
  selectedMIDIInput,
  onSelect,
  onContinue,
  onBack,
}: GearPageViewProps) {
  const items: CarouselFeature[] = inputs.map((input) => ({
    icon: <Piano className="size-8" />,
    title: input.name || "Unknown Device",
    description: input.manufacturer || "Generic MIDI Input",
    badge: input.id === selectedMIDIInput?.id ? "ACTIVE" : undefined,
  }));

  const actions = [
    {
      label: "MAIN MENU",
      onClick: onBack,
      variant: "secondary" as const,
    },
    {
      label: "CONTINUE",
      onClick: onContinue,
      variant: "default" as const,
      disabled: !selectedMIDIInput,
    },
  ];

  return (
    <main className="flex h-dvh items-center justify-center">
      {inputs.length === 0 ? (
        <div className="text-center px-8">
          <h2 className="retro mb-6 font-bold text-2xl tracking-tight md:text-3xl text-foreground/60">
            No gear found.
          </h2>
          <p className="retro text-muted-foreground text-[10px] uppercase tracking-[0.3em] mb-12">
            Please connect a keyboard and refresh.
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="retro cursor-pointer bg-foreground p-3 text-background transition-opacity hover:opacity-80 px-8"
              onClick={onBack}
            >
              BACK
            </button>
          </div>
        </div>
      ) : (
        <Feature3
          title="CHOOSE GEAR"
          description="Play a note on your gear to select it, or tap a card below."
          items={items}
          onItemClick={(item) => {
            const input = inputs.find(
              (i) => (i.name || "Unknown Device") === item.title,
            );
            if (input) onSelect(input);
          }}
          selectedItemTitle={selectedMIDIInput?.name || undefined}
          actions={actions}
        />
      )}
    </main>
  );
}
