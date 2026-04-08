"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
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
      header={<PageHeader title="Choose Gear" />}
      footer={
        <PageFooter>
          <Button variant="secondary" onClick={toHome} size="sm" font="retro">
            <ArrowLeft className="size-4 mr-2" />
            Main Menu
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
            <p className="flex-1 retro text-center text-foreground/60 text-[10px] uppercase tracking-[0.5em] flex flex-col items-center justify-center gap-6 before:content-[''] before:block before:size-16 before:border-8 before:border-foreground/10 before:border-t-primary before:animate-spin">
              Searching for gear...
            </p>
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
            <p className="flex-1 retro text-center text-foreground/60 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-6">
              No gear found. Please connect a keyboard and refresh.
            </p>
          ) : (
            <>
              <p className="retro text-center text-foreground/60 text-[10px] uppercase tracking-widest mb-4">
                Play a note on your gear to select it, or tap a card below.
              </p>

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
