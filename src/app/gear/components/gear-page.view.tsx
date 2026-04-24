"use client";

import "@/shared/components/ui/8bit/styles/retro.css";

import { Piano } from "lucide-react";

import { GearCard } from "@/features/midi-hardware";
import { Button } from "@/shared/components/ui/8bit/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/8bit/carousel";

interface GearPageViewProps {
  inputs: WebMidi.MIDIInput[];
  selectedMIDIInput: WebMidi.MIDIInput | null;
  onSelect: (input: WebMidi.MIDIInput) => void;
  onContinue: () => void;
  onBack: () => void;
}

const GearHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col gap-2">
    <h2 className="retro text-lg font-bold wrap-break-word uppercase sm:text-2xl md:text-3xl">
      {title}
    </h2>
    <span className="retro text-muted-foreground mx-auto block max-w-xl text-[9px] tracking-wider uppercase">
      {description}
    </span>
  </div>
);

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
    <main className="flex h-dvh flex-col items-center justify-evenly overflow-x-hidden p-4 text-center">
      {inputs.length === 0 ? (
        <GearHeader title="No gear found." description="Please connect a keyboard to continue..." />
      ) : (
        <>
          <GearHeader
            title="CHOOSE GEAR"
            description="Play a note on your gear to select it, or tap a card below."
          />

          <div className="w-full overflow-visible px-12 md:px-16">
            <Carousel className="mx-auto w-full max-w-4xl" opts={{ align: "start", loop: false }}>
              <CarouselContent>
                {inputs.map((input, index) => (
                  <CarouselItem
                    className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
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
