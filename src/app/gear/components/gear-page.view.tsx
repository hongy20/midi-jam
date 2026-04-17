"use client";

import { Piano } from "lucide-react";
import { Button } from "@/shared/components/ui/8bit/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/8bit/carousel";
import { GearCard } from "./gear-card";
import { GearHeader } from "./gear-header";

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
  const selectedItemIndex = selectedMIDIInput
    ? inputs.findIndex((i) => i.id === selectedMIDIInput.id)
    : undefined;

  return (
    <main className="flex flex-col h-dvh items-center justify-evenly p-4 overflow-x-hidden text-center">
      {inputs.length === 0 ? (
        <GearHeader title="No gear found." description="Please connect a keyboard to continue..." />
      ) : (
        <>
          <GearHeader
            title="CHOOSE GEAR"
            description="Play a note on your gear to select it, or tap a card below."
          />

          <div className="w-full px-12 md:px-16 overflow-visible">
            <Carousel className="mx-auto w-full max-w-4xl" opts={{ align: "start", loop: false }}>
              <CarouselContent>
                {inputs.map((input, index) => (
                  <CarouselItem
                    className="pl-4 basis-[100%] sm:basis-1/2 lg:basis-1/3"
                    key={input.id}
                  >
                    <GearCard
                      title={input.name || "Unknown Device"}
                      description={input.manufacturer || "Generic MIDI Input"}
                      icon={<Piano className="size-8" />}
                      isSelected={selectedItemIndex === index}
                      onClick={() => onSelect(input)}
                      badge={input.id === selectedMIDIInput?.id ? "SELECTED" : undefined}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </>
      )}

      <div className="jam-action-group">
        <Button onClick={onBack} variant="secondary" className="btn-jam">
          MAIN MENU
        </Button>
        <Button
          onClick={onContinue}
          variant="default"
          className="btn-jam"
          disabled={!selectedMIDIInput}
        >
          CONTINUE
        </Button>
      </div>
    </main>
  );
}
