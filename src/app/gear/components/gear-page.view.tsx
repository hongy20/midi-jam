"use client";

import { Piano } from "lucide-react";
import Feature3, {
  type CarouselFeature,
} from "@/components/ui/8bit/blocks/feature3";
import { GearEmptyState } from "./gear-empty-state";

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
        <GearEmptyState onBack={onBack} />
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
