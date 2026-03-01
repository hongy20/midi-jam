"use client";

import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

export default function ResultsPage() {
  const { navigate } = useGameNavigation();
  const { setGameSession, sessionResults, clearSelection } = useSelection();

  const handlePlayAgain = () => {
    setGameSession(null);
    navigate("/game");
  };

  const handleNextSong = () => {
    setGameSession(null);
    navigate("/tracks");
  };

  const handleMainMenu = () => {
    clearSelection();
    navigate("/");
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

  const rank = getRank(stats.accuracy);
  const titleLabel = getAccuracyLabel(stats.accuracy);

  return (
    <div className="w-[100dvw] h-[100dvh] bg-background grid grid-rows-[auto_1fr_auto] p-6 landscape:p-4 overflow-hidden animate-fade-in transition-colors duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-accent-primary/5" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-rows-[auto_1fr_auto] h-full animate-slide-up">
        {/* Header */}
        <header className="py-4 landscape:py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl landscape:text-2xl font-black text-foreground uppercase tracking-tighter">
              Performance Summary
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="overflow-y-auto overflow-x-hidden no-scrollbar py-4 landscape:py-2 px-8 -mx-8">
          <div className="w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center -mt-10 sm:-mt-16 landscape:mt-0 landscape:justify-start z-20">
            <header className="text-center mb-8 landscape:mb-4 w-full animate-slide-up">
              <span className="text-accent-primary font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-2 sm:mb-4 landscape:mb-1 block drop-shadow-md">
                Song Complete
              </span>
              <h1 className="text-5xl sm:text-7xl md:text-8xl landscape:text-4xl font-black text-foreground italic uppercase tracking-tighter drop-shadow-xl bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent">
                {titleLabel}
              </h1>
            </header>

            <main className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0 landscape:gap-3 animate-fade-in delay-200">
              <div className="col-span-2 lg:col-span-4 bg-foreground/5 backdrop-blur-3xl border border-foreground/10 flex flex-col items-center justify-center py-6 sm:py-10 landscape:py-4 rounded-[2rem] sm:rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden group hover:border-foreground/30 transition-colors">
                {/* Glossy inner reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1 relative z-10">
                  Total Score
                </span>
                <span className="text-5xl sm:text-7xl landscape:text-4xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-2xl relative z-10">
                  {stats.score.toLocaleString()}
                </span>

                {/* Decorative background glow behind score */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent-primary/10 blur-[80px] rounded-full -z-10 group-hover:bg-accent-primary/20 transition-colors duration-500" />
              </div>

              <div className="bg-foreground/5 backdrop-blur-3xl border border-foreground/10 p-5 sm:p-8 landscape:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col col-span-1 lg:col-span-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-colors">
                <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] mb-1 sm:mb-2 text-center">
                  Accuracy
                </span>
                <span className="text-3xl sm:text-5xl landscape:text-2xl font-black text-foreground text-center animate-accuracy-pop drop-shadow-md tabular-nums">
                  {stats.accuracy}%
                </span>
              </div>

              <div className="bg-foreground/5 backdrop-blur-3xl border border-foreground/10 p-5 sm:p-8 landscape:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col col-span-1 lg:col-span-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-colors">
                <span className="text-foreground/50 font-bold uppercase tracking-widest text-[10px] mb-1 sm:mb-2 text-center">
                  Max Combo
                </span>
                <span className="text-3xl sm:text-5xl landscape:text-2xl font-black text-foreground text-center drop-shadow-md tabular-nums">
                  {stats.combo}
                </span>
              </div>
            </main>

            {/* Rank Indicator Floating in Background */}
            <div className="fixed top-0 right-[5%] h-full flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-0">
              <div className="font-black text-[40vw] sm:text-[35vw] md:text-[25vw] leading-none tracking-tighter italic text-foreground/[0.03] animate-[spin_60s_linear_infinite] origin-center -ml-[10vw]">
                {rank}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 landscape:py-2 flex justify-end flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 w-full px-4 sm:px-0 z-20 landscape:gap-2">
            <button
              type="button"
              onClick={handleMainMenu}
              className="flex-1 py-4 landscape:py-2 bg-foreground/5 text-foreground border border-foreground/10 rounded-full font-bold text-sm sm:text-xl landscape:text-xs uppercase tracking-widest hover:bg-foreground/10 transition-colors order-3 sm:order-1"
            >
              MAIN MENU
            </button>

            <button
              type="button"
              onClick={handleNextSong}
              className="flex-1 py-4 landscape:py-2 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-black text-sm sm:text-xl landscape:text-xs uppercase tracking-widest hover:bg-foreground/20 hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] order-2"
            >
              NEXT SONG ▶️
            </button>

            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex-[1.5] py-4 sm:py-5 landscape:py-2 bg-foreground text-background rounded-full font-black text-lg sm:text-xl landscape:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] order-1 sm:order-3"
            >
              PLAY AGAIN 🔄
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
