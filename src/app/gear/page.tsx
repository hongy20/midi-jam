"use client";

import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { useEffect } from "react";
import { GearCard } from "@/components/gear-card/gear-card";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { useGear } from "@/context/gear-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function GearPage() {
  const { toCollection, toHome } = useNavigation();

  const { selectMIDIInput, selectedMIDIInput, inputs, isLoading, error } =
    useGear();

  useEffect(() => {
    // Attach listener to all inputs to detect activity and auto-select
    const handlers = new Map<string, (e: Event) => void>();

    inputs.forEach((input) => {
      const handler = () => {
        selectMIDIInput(input);
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
  }, [inputs, selectMIDIInput]);

  return (
    <PageLayout
      header={
        <PageHeader title="SELECT GEAR">
          <div className="retro text-[10px] opacity-40 uppercase tracking-widest hidden sm:block">
            Midi Input Configuration
          </div>
        </PageHeader>
      }
      footer={
        <PageFooter>
          <Button variant="secondary" onClick={toHome} size="sm" font="retro">
            <ArrowLeft className="size-4 mr-2" />
            BACK
          </Button>
          <Button
            onClick={() => toCollection()}
            disabled={!selectedMIDIInput}
            size="sm"
            font="retro"
          >
            CONTINUE
            <ChevronRight className="size-4 ml-2" />
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full max-h-full max-w-full overflow-hidden flex flex-col gap-8 py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 h-full">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-8 border-foreground/10 border-t-primary animate-spin" />
              <p className="retro text-center text-foreground/60 text-[10px] uppercase tracking-widest">
                Scanning MIDI Ports...
              </p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="border-8 border-destructive max-w-md w-full">
                <CardContent className="p-8! text-center flex flex-col gap-4 text-destructive">
                  <div className="retro text-lg!">CRITICAL ERROR</div>
                  <div className="retro text-[10px] leading-relaxed opacity-80">
                    {error}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : inputs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-6 opacity-40 max-w-xs text-center">
                <Search className="size-16" />
                <p className="retro text-[10px] uppercase tracking-widest leading-loose">
                  No gear detected. Connect your device and check connection.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center px-4">
                <div className="inline-block bg-accent px-4 py-2 border-4 border-foreground dark:border-ring retro text-[10px] uppercase tracking-widest mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  AUTO-DETECT ACTIVE
                </div>
                <p className="retro text-[8px] opacity-40 uppercase mt-4">
                  Play a note on your gear to select or tap a card below
                </p>
              </div>

              <div className="flex-1 flex items-center gap-8 overflow-x-auto snap-x snap-mandatory py-10 px-4 -mx-4 no-scrollbar">
                {inputs.map((inst) => (
                  <GearCard
                    key={inst.id}
                    instrument={inst}
                    isSelected={selectedMIDIInput?.id === inst.id}
                    onClick={() => selectMIDIInput(inst)}
                    className="shrink-0 w-[240px] sm:w-[280px] h-[360px] snap-center"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
