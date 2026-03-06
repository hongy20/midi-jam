"use client";

import { Play, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function PausePage() {
  const { toPlay, toOptions } = useNavigation();
  const { game, instruments, tracks } = useAppContext();
  const { setSession: setGameSession } = game;
  const { input: selectedMIDIInput } = instruments;
  const { selected: selectedTrack } = tracks;

  const handleResume = () => {
    toPlay();
  };

  const handleRestart = () => {
    setGameSession(null);
    toPlay();
  };

  const handleOptions = () => {
    toOptions("pause");
  };

  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <PageLayout
      header={
        <PageHeader title="Game Paused">
          <Button
            variant="secondary"
            onClick={handleOptions}
            size="sm"
            icon={Settings}
          >
            OPTIONS
          </Button>
        </PageHeader>
      }
      footer={
        <PageFooter>
          <Button
            variant="primary"
            onClick={handleResume}
            size="md"
            icon={Play}
          >
            RESUME JAM
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full flex flex-col items-center justify-center relative z-10 px-6 py-4 landscape:py-2">
        <div className="text-center w-full max-w-lg mb-8 landscape:mb-4">
          <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">
            Currently Playing
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tight truncate">
            {selectedTrack.name}
          </h2>
          <span className="text-accent-primary font-bold text-sm sm:text-lg mt-1 block">
            {selectedMIDIInput.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg">
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={handleResume}
              size="lg"
              icon={Play}
            >
              RESUME
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={handleRestart}
              size="lg"
              icon={RotateCcw}
            >
              RESTART
            </Button>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
