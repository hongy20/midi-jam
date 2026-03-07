"use client";

import { Play, RotateCcw, Settings, XCircle } from "lucide-react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function PausePage() {
  const { toPlay, toOptions, toScore } = useNavigation();
  const {
    stage: { gameSession, setGameSession, trackStatus },
    gear: { selectedMIDIInput },
    collection: { selectedTrack },
    score: { setSessionResults },
  } = useAppContext();

  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <PageLayout
      header={<PageHeader title="Game Paused" />}
      footer={
        <PageFooter>
          <Button
            variant="primary"
            onClick={() => toPlay()}
            size="md"
            icon={Play}
          >
            RESUME
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full flex flex-col items-center justify-center relative z-10 px-6 py-4 gap-8 sm:gap-12">
        <div className="text-center w-full max-w-lg">
          <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 sm:mb-4 block">
            Currently Playing
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight truncate leading-tight">
            {selectedTrack.name}
          </h2>
          <span className="text-accent-primary font-bold text-sm sm:text-lg mt-2 block tracking-wide">
            {selectedMIDIInput.name}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs">
          <Button
            variant="secondary"
            onClick={() => {
              setGameSession(null);
              toPlay();
            }}
            size="lg"
            icon={RotateCcw}
            className="w-full"
          >
            RESTART
          </Button>
          <Button
            variant="secondary"
            onClick={() => toOptions("pause")}
            size="lg"
            icon={Settings}
            className="w-full"
          >
            OPTIONS
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (gameSession && trackStatus.isReady) {
                const { score: currentScore, combo } = gameSession;
                const totalEvents = trackStatus.events.length;
                setSessionResults({
                  score: currentScore,
                  accuracy:
                    Math.floor((currentScore / (totalEvents * 100)) * 100) || 0,
                  combo,
                });
              }
              setGameSession(null);
              toScore();
            }}
            size="lg"
            icon={XCircle}
            className="w-full"
          >
            END JAM
          </Button>
        </div>
      </main>
    </PageLayout>
  );
}
