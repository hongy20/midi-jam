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
  const { stage, gear, collection, score } = useAppContext();
  const { gameSession, setGameSession, trackStatus } = stage;
  const { selectedMIDIInput } = gear;
  const { selectedTrack } = collection;
  const { setSessionResults } = score;

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

  const handleExit = () => {
    if (gameSession && trackStatus.isReady) {
      const { score: currentScore, combo } = gameSession;
      const totalEvents = trackStatus.events.length;
      setSessionResults({
        score: currentScore,
        accuracy: Math.floor((currentScore / (totalEvents * 100)) * 100) || 0,
        combo,
      });
    }
    setGameSession(null);
    toScore();
  };

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
            onClick={handleResume}
            size="md"
            icon={Play}
          >
            RESUME
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full flex flex-col items-center justify-center relative z-10 px-6 py-4">
        <div className="text-center w-full max-w-lg mb-8">
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

        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-lg">
          <Button
            variant="secondary"
            onClick={handleRestart}
            size="lg"
            icon={RotateCcw}
          >
            RESTART
          </Button>
          <Button
            variant="secondary"
            onClick={handleOptions}
            size="lg"
            icon={Settings}
          >
            OPTIONS
          </Button>
          <Button
            variant="secondary"
            onClick={handleExit}
            size="lg"
            icon={XCircle}
          >
            END JAM
          </Button>
        </div>
      </main>
    </PageLayout>
  );
}
