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
      <main className="w-full h-full flex flex-col items-center justify-center relative z-10 px-6 py-4 gap-6 sm:gap-12 min-h-0 overflow-hidden">
        {/* Info Section */}
        <div className="text-center w-full max-w-2xl shrink-0">
          <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] text-[10px] mb-1 sm:mb-4 block">
            Currently Playing
          </span>
          <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight truncate leading-tight">
            {selectedTrack.name}
          </h2>
          <span className="text-accent-primary font-bold text-xs sm:text-lg mt-1 sm:mt-2 block tracking-wide">
            {selectedMIDIInput.name}
          </span>
        </div>

        {/* Primary Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl px-4 sm:px-0">
          <Button
            variant="secondary"
            onClick={() => {
              setGameSession(null);
              toPlay();
            }}
            size="md"
            icon={RotateCcw}
            className="w-full sm:py-8"
          >
            RESTART
          </Button>
          <Button
            variant="secondary"
            onClick={() => toOptions("pause")}
            size="md"
            icon={Settings}
            className="w-full sm:py-8"
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
            size="md"
            icon={XCircle}
            className="w-full sm:py-8 text-red-500/80 hover:text-red-500"
          >
            END JAM
          </Button>
        </div>
      </main>
    </PageLayout>
  );
}
