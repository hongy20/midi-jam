"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { StatCard } from "@/components/stat-card/stat-card";
import { Button } from "@/components/ui/8bit/button";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function ScorePage() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const { setGameSession } = useStage();
  const { sessionResults } = useScore();

  const stats = sessionResults ?? {
    score: 0,
    accuracy: 0,
    combo: 0,
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 91) return "Outstanding!";
    if (accuracy >= 71) return "Great Job!";
    if (accuracy >= 41) return "Not Bad!";
    return "Keep Practicing!";
  };

  const titleLabel = getAccuracyLabel(stats.accuracy);

  return (
    <PageLayout
      header={<PageHeader title="Final Score" />}
      footer={
        <PageFooter>
          <Button
            variant="secondary"
            onClick={() => toHome()}
            size="sm"
            font="retro"
          >
            Main Menu
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setGameSession(null);
              toCollection();
            }}
            size="sm"
            font="retro"
          >
            Songs
            <ChevronRight className="size-4 ml-2" />
          </Button>
          <Button
            onClick={() => {
              setGameSession(null);
              toPlay();
            }}
            size="sm"
            font="retro"
          >
            RETRY
            <RotateCcw className="size-4 ml-2" />
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full overflow-hidden py-12 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center gap-12 sm:gap-16">
        <h1 className="retro text-3xl sm:text-4xl md:text-5xl font-black bg-foreground text-background px-6 py-4 border-8 border-foreground dark:border-ring uppercase leading-tight select-none text-center">
          {titleLabel}
        </h1>

        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <StatCard
            label="Total Score"
            value={stats.score.toLocaleString()}
            variant="large"
            className="col-span-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]"
          />

          <StatCard
            label="Accuracy"
            value={`${stats.accuracy}%`}
            variant="small"
            className="col-span-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
          />

          <StatCard
            label="Max Combo"
            value={stats.combo}
            variant="small"
            className="col-span-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
          />
        </div>

        <div className="retro text-[8px] opacity-20 uppercase tracking-[0.4em] mt-8">
          Recording achieved on{" "}
          {new Date()
            .toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
            .toUpperCase()}
        </div>
      </main>
    </PageLayout>
  );
}
