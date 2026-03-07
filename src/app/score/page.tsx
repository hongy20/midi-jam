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
      <main className="w-full h-full overflow-hidden py-2 sm:py-4 px-6 sm:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 sm:gap-8 z-20">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-foreground italic uppercase tracking-tighter drop-shadow-xl bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent text-center w-full leading-[0.9] md:whitespace-nowrap">
          {titleLabel}
        </h1>

        <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 justify-center items-stretch">
          <StatCard
            label="Total Score"
            value={stats.score.toLocaleString()}
            variant="large"
            className="col-span-2"
          />

          <StatCard
            label="Accuracy"
            value={`${stats.accuracy}%`}
            variant="small"
            className="col-span-1"
          />

          <StatCard
            label="Max Combo"
            value={stats.combo}
            variant="small"
            className="col-span-1"
          />
        </section>
      </main>
    </PageLayout>
  );
}
