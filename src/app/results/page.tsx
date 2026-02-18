"use client";

import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useSelection } from "@/context/selection-context";

export default function ResultsPage() {
  const { navigate } = useGameNavigation();
  const { setGameSession } = useSelection();

  const handlePlayAgain = () => {
    setGameSession(null);
    navigate("/game");
  };

  const handleNextSong = () => {
    setGameSession(null);
    navigate("/tracks");
  };

  // Mock stats
  const stats = {
    score: 8420,
    accuracy: "94.2%",
    maxCombo: 124,
    rank: "S",
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glory Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 rounded-full blur-[180px] animate-pulse" />
      </div>

      <header className="relative z-10 text-center mb-12 animate-in slide-in-from-top-4 duration-1000">
        <span className="text-blue-500 font-black uppercase tracking-[0.5em] text-xs mb-4 block">
          Song Complete
        </span>
        <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter shadow-blue-500/20 drop-shadow-2xl">
          Excellent!
        </h1>
      </header>

      <main className="relative z-10 w-full max-w-2xl grid grid-cols-2 gap-4 mb-16 animate-in fade-in zoom-in-95 duration-1000 delay-300">
        <div className="col-span-2 bg-white flex flex-col items-center justify-center py-12 rounded-[3rem] shadow-[0_0_80px_rgba(255,255,255,0.15)]">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">
            Total Score
          </span>
          <span className="text-7xl font-black text-slate-950 tracking-tighter tabular-nums">
            {stats.score.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] flex flex-col">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">
            Accuracy
          </span>
          <span className="text-4xl font-black text-white">
            {stats.accuracy}
          </span>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] flex flex-col">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">
            Max Combo
          </span>
          <span className="text-4xl font-black text-white">
            {stats.maxCombo}
          </span>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-500">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="py-5 bg-white text-slate-950 rounded-full font-black text-xl hover:scale-105 transition-transform"
          >
            PLAY AGAIN
          </button>
          <button
            type="button"
            onClick={handleNextSong}
            className="py-5 bg-slate-900 text-white border border-slate-700 rounded-full font-black text-xl hover:bg-slate-800 transition-colors"
          >
            NEXT SONG
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setGameSession(null);
            navigate("/");
          }}
          className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.3em] py-2"
        >
          Main Menu
        </button>
      </footer>

      {/* Rank Indicator Floating in Background */}
      <div className="absolute top-[10%] right-[10%] opacity-10 font-black text-[30vw] text-white italic pointer-events-none select-none">
        {stats.rank}
      </div>
    </div>
  );
}
