"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { getSoundTracks } from "@/lib/action/sound-track";

interface Track {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}

export default function TracksPage() {
  const { navigate } = useGameNavigation();
  const { setTrack, selectedTrack } = useSelection();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selected, setSelected] = useState<string | null>(
    selectedTrack?.id || null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      const data = await getSoundTracks();
      setTracks(data);
      setIsLoading(false);
    }
    fetchTracks();
  }, []);

  const handlePlay = () => {
    if (selected) {
      const track = tracks.find((t) => t.id === selected);
      if (track) {
        setTrack({ id: track.id, name: track.name, url: track.url });
      }
      navigate("/game");
    }
  };

  const handleBack = () => {
    navigate("/instruments");
  };

  const handleSurprise = () => {
    if (tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setSelected(randomTrack.id);
    }
  };

  const step = 2;
  const totalSteps = 2;

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
            <div className="flex items-center gap-3 mb-2 landscape:mb-0.5">
              <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-accent-primary">
                Step {step} of {totalSteps}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={`step-${i + 1}`}
                    className={`h-1 w-6 rounded-full transition-all duration-500 ${
                      i + 1 <= step ? "bg-accent-primary" : "bg-foreground/10"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl landscape:text-2xl font-black text-foreground uppercase tracking-tighter">
              Select Soundtrack
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-2 px-4 py-2 border border-foreground/10 rounded-full text-foreground/50 font-bold text-[10px] sm:text-xs uppercase hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Instrument Setup
          </button>
        </header>

        {/* Content */}
        <main className="overflow-y-auto overflow-x-hidden no-scrollbar py-4 landscape:py-2 px-8 -mx-8">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-foreground/50 animate-pulse font-medium">
              Loading soundtracks...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-6 overflow-y-auto no-scrollbar pb-12 w-full">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelected(track.id)}
                  className={`w-full p-5 sm:p-6 landscape:p-3 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col items-start gap-4 landscape:gap-2 ${
                    selected === track.id
                      ? "bg-foreground border-foreground scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                      : "bg-foreground/5 border-foreground/10 hover:border-foreground/30 hover:bg-foreground/10 text-foreground/80"
                  }`}
                >
                  <div className="flex items-center gap-4 landscape:gap-3 w-full">
                    <div
                      className={`shrink-0 w-12 h-12 landscape:w-10 landscape:h-10 rounded-full flex items-center justify-center ${
                        selected === track.id
                          ? "bg-background text-foreground"
                          : "bg-foreground/10 text-foreground/50"
                      }`}
                    >
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-lg sm:text-xl landscape:text-base font-bold truncate ${
                          selected === track.id
                            ? "text-background"
                            : "text-foreground"
                        }`}
                      >
                        {track.name}
                      </span>
                      <span
                        className={`text-sm landscape:text-xs font-medium truncate ${
                          selected === track.id
                            ? "text-background/70"
                            : "text-foreground/60"
                        }`}
                      >
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs landscape:text-[9px] font-black uppercase tracking-widest px-3 py-1.5 landscape:py-1 rounded-full ${
                      selected === track.id
                        ? "bg-background/20 text-background"
                        : "bg-foreground/10 text-foreground/70"
                    }`}
                  >
                    {track.difficulty}
                  </span>
                </button>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 landscape:py-2 flex justify-end flex-shrink-0">
          <div className="flex gap-4 w-full">
            <button
              type="button"
              onClick={handleSurprise}
              className="flex-1 px-4 sm:px-8 py-4 bg-foreground/10 text-foreground font-black rounded-full hover:bg-foreground/20 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-lg"
            >
              SURPRISE 🎲
            </button>
            <button
              type="button"
              onClick={handlePlay}
              disabled={!selected}
              className={`flex-[2] px-8 sm:px-12 py-4 rounded-full text-lg sm:text-xl font-black transition-all ${
                selected
                  ? "bg-foreground text-background hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
                  : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
              }`}
            >
              PLAY ▶️
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
