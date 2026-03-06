"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function ScorePage() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const { stage, score, home } = useAppContext();
  const { setGameSession } = stage;
  const { sessionResults } = score;
  const { resetAll: clearSelection } = home;

  const handleRetry = () => {
    setGameSession(null);
    toPlay();
  };

  const handleNextSong = () => {
    setGameSession(null);
    toCollection();
  };

  const handleMainMenu = () => {
    clearSelection();
    toHome();
  };

  const stats = sessionResults || {
    score: 0,
    accuracy: 0,
    combo: 0,
  };

  const getRank = (accuracy: number) => {
    if (accuracy >= 95) return "S";
    if (accuracy >= 90) return "A";
    if (accuracy >= 80) return "B";
    if (accuracy >= 70) return "C";
    return "D";
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 91) return "Outstanding!";
    if (accuracy >= 71) return "Great Job!";
    if (accuracy >= 41) return "Not Bad!";
    return "Keep Practicing!";
  };

  const _rank = getRank(stats.accuracy);
  const titleLabel = getAccuracyLabel(stats.accuracy);

  return (
    <PageLayout
      header={<PageHeader title="Final Score" />}
      footer={
        <PageFooter>
          <Button variant="secondary" onClick={handleMainMenu} size="md">
            MAIN MENU
          </Button>
          <Button
            variant="secondary"
            onClick={handleNextSong}
            size="md"
            icon={ChevronRight}
          >
            NEXT SONG
          </Button>
          <Button
            variant="primary"
            onClick={handleRetry}
            size="md"
            icon={RotateCcw}
          >
            RETRY
          </Button>
        </PageFooter>
      }
    >
      <main
        className={`w-full h-full overflow-y-auto overflow-x-hidden py-4 px-8 -mx-8 min-h-0 max-w-4xl mx-auto flex flex-col items-center justify-center -mt-10 sm:-mt-16 z-20`}
      >
        <div className="text-center mb-8 w-full">
          <span className="text-accent-primary font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-2 sm:mb-4 block drop-shadow-md">
            SONG FINISHED
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-foreground italic uppercase tracking-tighter drop-shadow-xl bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent">
            {titleLabel}
          </h1>
        </div>

        <section className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
          <div className="col-span-2 lg:col-span-4 bg-[var(--ui-card-bg)] backdrop-blur-3xl border border-[var(--ui-card-border)] flex flex-col items-center justify-center py-6 sm:py-10 rounded-[2rem] sm:rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden group hover:border-foreground/30 transition-colors">
            {/* Glossy inner reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1 relative z-10">
              Total Score
            </span>
            <span className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-2xl relative z-10">
              {stats.score.toLocaleString()}
            </span>

            {/* Decorative background glow behind score */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent-primary/10 blur-[80px] rounded-full -z-10 group-hover:bg-accent-primary/20 transition-colors duration-500" />
          </div>

          <div className="bg-[var(--ui-card-bg)] backdrop-blur-3xl border border-[var(--ui-card-border)] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col col-span-1 lg:col-span-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-colors">
            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] mb-1 sm:mb-2 text-center">
              Accuracy
            </span>
            <span className="text-3xl sm:text-5xl font-black text-foreground text-center drop-shadow-md tabular-nums">
              {stats.accuracy}%
            </span>
          </div>

          <div className="bg-[var(--ui-card-bg)] backdrop-blur-3xl border border-[var(--ui-card-border)] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col col-span-1 lg:col-span-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-colors">
            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] mb-1 sm:mb-2 text-center">
              Max Combo
            </span>
            <span className="text-3xl sm:text-5xl font-black text-foreground text-center drop-shadow-md tabular-nums">
              {stats.combo}
            </span>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
