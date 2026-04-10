"use client";

import { Piano } from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import { GearCard } from "./gear-card";
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
  const selectedItemIndex = selectedMIDIInput
    ? inputs.findIndex((i) => i.id === selectedMIDIInput.id)
    : undefined;

  return (
    <main className="flex flex-col h-dvh items-center justify-evenly p-4 overflow-x-hidden text-center">
      {inputs.length === 0 ? (
        <GearEmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="retro font-bold text-lg sm:text-2xl md:text-3xl break-words">
              CHOOSE GEAR
            </h2>
            <span className="mx-auto block max-w-xl retro text-muted-foreground text-[9px]">
              Play a note on your gear to select it, or tap a card below.
            </span>
          </div>

          <Carousel
            className="mx-auto w-full max-w-4xl px-10 sm:px-12"
            opts={{ align: "start", loop: false }}
          >
            <CarouselContent>
              {inputs.map((input, index) => (
                <CarouselItem
                  className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                  key={input.id}
                >
                  <GearCard
                    title={input.name || "Unknown Device"}
                    description={input.manufacturer || "Generic MIDI Input"}
                    icon={<Piano className="size-8" />}
                    isSelected={selectedItemIndex === index}
                    onClick={() => onSelect(input)}
                    badge={
                      input.id === selectedMIDIInput?.id
                        ? "SELECTED"
                        : undefined
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      )}

      <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4 shrink-0 px-4 pb-4">
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
