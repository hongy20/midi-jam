"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";

export default function ScorePage() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const { game, results, actions } = useAppContext();
  const { setSession: setGameSession } = game;
  const { last: sessionResults } = results;
  const { resetAll: clearSelection } = actions;

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
          <div className="flex-1 flex order-3 sm:order-1">
            <Button variant="secondary" onClick={handleMainMenu} size="md">
              MAIN MENU
            </Button>
          </div>

          <div className="flex-1 flex order-2">
            <Button
              variant="secondary"
              onClick={handleNextSong}
              size="md"
              icon={ChevronRight}
            >
              NEXT SONG
            </Button>
          </div>

          <div className="flex-[1.5] flex order-1 sm:order-3">
            <Button
              variant="primary"
              onClick={handleRetry}
              size="md"
              icon={RotateCcw}
            >
              RETRY
            </Button>
          </div>
        </PageFooter>
      }
    >
      <main
        className={`overflow-y-auto overflow-x-hidden no-scrollbar py-4 landscape:py-2 px-8 -mx-8 min-h-0 w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center -mt-10 sm:-mt-16 landscape:mt-0 landscape:justify-start z-20`}
      >
        <div className="text-center mb-8 landscape:mb-4 w-full">
          <span className="text-accent-primary font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-2 sm:mb-4 landscape:mb-1 block drop-shadow-md">
            SONG FINISHED
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl landscape:text-4xl font-black text-foreground italic uppercase tracking-tighter drop-shadow-xl bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent">
            {titleLabel}
          </h1>
        </div>

        <section className="w-full grid grid-cols-2 landscape:grid-cols-4 lg:grid-cols-4 gap-4 px-4 sm:px-0 landscape:gap-3">
          <div className="col-span-2 landscape:col-span-2 lg:col-span-4 bg-[var(--ui-card-bg)] backdrop-blur-3xl border border-[var(--ui-card-border)] flex flex-col items-center justify-center py-6 sm:py-10 landscape:py-3 rounded-[2rem] sm:rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden group hover:border-foreground/30 transition-colors">
            {/* Glossy inner reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1 relative z-10">
              Total Score
            </span>
            <span className="text-5xl sm:text-7xl landscape:text-3xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-2xl relative z-10">
              {stats.score.toLocaleString()}
            </span>

            {/* Decorative background glow behind score */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent-primary/10 blur-[80px] rounded-full -z-10 group-hover:bg-accent-primary/20 transition-colors duration-500" />
          </div>

          <div className="bg-[var(--ui-card-bg)] backdrop-blur-3xl border border-[var(--ui-card-border)] p-5 sm:p-8 landscape:p-3 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col col-span-1 landscape:col-span-1 lg:col-span-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-colors">
            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] mb-1 sm:mb-2 text-center">
              Accuracy
            </span>
            <span className="text-3xl sm:text-5xl landscape:text-xl font-black text-foreground text-center drop-shadow-md tabular-nums">
              {stats.accuracy}%
            </span>
          </div>

          <div className="bg-[var(--ui-card-bg)] backdrop-blur-3xl border border-[var(--ui-card-border)] p-5 sm:p-8 landscape:p-3 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col col-span-1 landscape:col-span-1 lg:col-span-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-colors">
            <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] mb-1 sm:mb-2 text-center">
              Max Combo
            </span>
            <span className="text-3xl sm:text-5xl landscape:text-xl font-black text-foreground text-center drop-shadow-md tabular-nums">
              {stats.combo}
            </span>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
