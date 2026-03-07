"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { StatCard } from "@/components/stat-card/stat-card";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function ScorePage() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const {
    stage: { setGameSession },
    score: { sessionResults },
  } = useAppContext();

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
          <Button variant="secondary" onClick={() => toHome()} size="sm">
            Main Menu
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setGameSession(null);
              toCollection();
            }}
            size="sm"
            icon={ChevronRight}
          >
            Songs
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setGameSession(null);
              toPlay();
            }}
            size="sm"
            icon={RotateCcw}
          >
            RETRY
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full overflow-y-auto overflow-x-hidden py-4 px-8 min-h-0 max-w-4xl mx-auto flex flex-col items-center justify-center -mt-10 sm:-mt-16 z-20">
        <div className="text-center mb-8 w-full">
          <span className="text-accent-primary font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-2 sm:mb-4 block drop-shadow-md">
            SONG FINISHED
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-foreground italic uppercase tracking-tighter drop-shadow-xl bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent">
            {titleLabel}
          </h1>
        </div>

        <section className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
          <StatCard
            label="Total Score"
            value={stats.score.toLocaleString()}
            variant="large"
            className="col-span-2 lg:col-span-4"
          />

          <StatCard
            label="Accuracy"
            value={`${stats.accuracy}%`}
            variant="small"
            className="col-span-1 lg:col-span-2"
          />

          <StatCard
            label="Max Combo"
            value={stats.combo}
            variant="small"
            className="col-span-1 lg:col-span-2"
          />
        </section>
      </main>
    </PageLayout>
  );
}
