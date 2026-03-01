"use client";

import { ArrowLeft, Dices, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { getSoundTracks } from "@/lib/action/sound-track";
import styles from "./page.module.css";

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

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-hidden max-w-5xl mx-auto grid grid-rows-[auto_1fr_auto] p-6 landscape:p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-[var(--header-py)] flex-shrink-0">
        <h1 className="text-[var(--h1-size)] font-black text-foreground uppercase tracking-tighter">
          Select Soundtrack
        </h1>

        <button
          type="button"
          onClick={handleBack}
          className="group flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/50 font-bold text-[10px] sm:text-xs uppercase hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Instrument Setup
        </button>
      </header>

      {/* Content */}
      <main className={`overflow-y-auto overflow-x-hidden ${styles.noScrollbar} py-4 landscape:py-2 px-8 -mx-8 min-h-0 grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-6 pb-12 w-full`}>
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-foreground/50 animate-pulse font-medium col-span-full">
            Loading soundtracks...
          </div>
        ) : (
          <>
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
                    <Play className="w-5 h-5 fill-current" />
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-end gap-[var(--layout-gap)] py-[var(--footer-py)] w-full flex-shrink-0">
        <button
          type="button"
          onClick={handleSurprise}
          className="w-full sm:flex-1 px-[var(--app-btn-px)] py-[var(--btn-py)] bg-foreground/10 text-foreground border border-foreground/20 font-black rounded-full hover:bg-foreground/20 hover:scale-[1.02] active:scale-95 transition-all text-[var(--btn-text)] flex items-center justify-center gap-2"
        >
          SURPRISE <Dices className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          onClick={handlePlay}
          disabled={!selected}
          className={`w-full sm:flex-[2] px-[var(--app-btn-px)] py-[var(--btn-py)] rounded-full font-black text-[var(--btn-text)] transition-all flex items-center justify-center gap-2 ${
            selected
              ? "bg-foreground text-background hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
              : "opacity-40 bg-foreground/10 text-foreground/40 cursor-not-allowed"
          }`}
        >
          PLAY <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        </button>
      </footer>
    </div>
  );
}
