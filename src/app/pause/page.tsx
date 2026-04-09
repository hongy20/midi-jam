"use client";

import { Music, Play, RotateCcw, Settings, XCircle } from "lucide-react";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { useCollection } from "@/context/collection-context";
import { useGear } from "@/context/gear-context";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useTrack } from "@/context/track-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function PausePage() {
  const { toPlay, toOptions, toScore } = useNavigation();
  const { gameSession, setGameSession } = useStage();
  const { trackStatus } = useTrack();
  const { selectedMIDIInput } = useGear();
  const { selectedTrack } = useCollection();
  const { setSessionResults } = useScore();

  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <PageLayout
      header={<PageHeader title="Game Paused" />}
      footer={
        <PageFooter>
          <Button
            variant="default"
            onClick={() => toPlay()}
            size="lg"
            font="retro"
            className="w-full sm:w-auto"
          >
            <Play className="size-5 mr-2" />
            RESUME
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full flex flex-col items-center justify-center relative z-10 px-4 sm:px-8 py-8 gap-12 sm:gap-16 max-w-4xl mx-auto">
        {/* Info Card */}
        <Card className="w-full border-8 border-primary/20 bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <Music className="size-16 text-primary bg-primary/10 p-4 border-4 border-primary/20 shrink-0" />
            <div className="flex flex-col gap-2 shrink-0">
              <span className="retro text-[8px] opacity-40 uppercase tracking-[0.3em] mb-1">
                Currently Playing
              </span>
              <h2 className="retro text-xl sm:text-2xl md:text-3xl uppercase tracking-tighter leading-tight">
                {selectedTrack.name}
              </h2>
              <span className="retro text-[10px] text-primary uppercase tracking-widest mt-2 px-3 py-1 bg-primary/5 border border-primary/10 self-center">
                {selectedMIDIInput.name}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Button
            variant="secondary"
            onClick={() => {
              setGameSession(null);
              toPlay();
            }}
            size="lg"
            font="retro"
            className="h-24 sm:h-auto py-6"
          >
            <div className="flex flex-col items-center gap-2">
              <RotateCcw className="size-6" />
              <span className="text-[10px]">RESTART</span>
            </div>
          </Button>

          <Button
            variant="secondary"
            onClick={() => toOptions("pause")}
            size="lg"
            font="retro"
            className="h-24 sm:h-auto py-6"
          >
            <div className="flex flex-col items-center gap-2">
              <Settings className="size-6" />
              <span className="text-[10px]">OPTIONS</span>
            </div>
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
            font="retro"
            className="h-24 sm:h-auto py-6 border-destructive/20 hover:border-destructive text-destructive"
          >
            <div className="flex flex-col items-center gap-2">
              <XCircle className="size-6" />
              <span className="text-[10px]">END JAM</span>
            </div>
          </Button>
        </div>
      </main>
    </PageLayout>
  );
}
