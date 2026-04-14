"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import VictoryScreen from "@/components/ui/8bit/blocks/victory-screen";
import { Button } from "@/components/ui/8bit/button";

export interface ScoreStat {
  id: number;
  title: string;
  stats: string | number;
}

export interface ScoreReport {
  id: number;
  title: string;
  description: string | number;
}

interface ScorePageViewProps {
  title: string;
  stats: ScoreStat[];
  report: ScoreReport[];
  date: string;
  onRetry: () => void;
  onCollection: () => void;
  onHome: () => void;
}

export function ScorePageView({
  title,
  stats,
  report,
  date,
  onRetry,
  onCollection,
  onHome,
}: ScorePageViewProps) {
  return (
    <main className="w-screen h-[100dvh] flex items-center justify-center p-4 bg-background overflow-hidden select-none">
      <VictoryScreen
        title={title}
        stats={stats}
        battleReport={report}
        actions={
          <>
            <Button variant="secondary" onClick={onHome} size="sm" font="retro">
              Main Menu
            </Button>
            <Button
              variant="secondary"
              onClick={onCollection}
              size="sm"
              font="retro"
            >
              Songs
              <ChevronRight className="size-4 ml-2" />
            </Button>
            <Button onClick={onRetry} size="sm" font="retro">
              RETRY
              <RotateCcw className="size-4 ml-2" />
            </Button>
          </>
        }
      />

      {/* Footer text if needed - though actions slot is better */}
      <div className="fixed bottom-4 left-0 right-0 text-center pointer-events-none">
        <div className="retro text-[8px] opacity-20 uppercase tracking-[0.4em]">
          Recording achieved on {date}
        </div>
      </div>
    </main>
  );
}
