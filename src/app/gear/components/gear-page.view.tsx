"use client";

import { Piano } from "lucide-react";
import Feature3, {
  type CarouselFeature,
} from "@/components/ui/8bit/blocks/feature3";
import { Button } from "@/components/ui/8bit/button";
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
    badge: input.id === selectedMIDIInput?.id ? "SELECTED" : undefined,
  }));

  return (
    <main className="flex flex-col h-dvh items-center justify-between p-8 gap-16">
      <div className="flex-1 w-full max-w-5xl flex items-center justify-center min-h-0">
        {inputs.length === 0 ? (
          <GearEmptyState />
        ) : (
          <Feature3
            title="CHOOSE GEAR"
            description="Play a note on your gear to select it, or tap a card below."
            items={items}
            onItemClick={(index) => {
              const input = inputs[index];
              if (input) onSelect(input);
            }}
            selectedItemIndex={
              selectedMIDIInput
                ? inputs.findIndex((i) => i.id === selectedMIDIInput.id)
                : undefined
            }
          />
        )}
      </div>

      <div className="w-full max-w-5xl pb-12 flex flex-wrap justify-center gap-4 shrink-0">
        <Button onClick={onBack} variant="secondary" className="w-48">
          MAIN MENU
        </Button>
        <Button
          onClick={onContinue}
          variant="default"
          className="w-48"
          disabled={!selectedMIDIInput}
        >
          CONTINUE
        </Button>
      </div>
    </main>
  );
}
