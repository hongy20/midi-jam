"use client";

import { useEffect, useState } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
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
        setTrack({ id: track.id, name: track.name });
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
    <NavigationLayout
      title="Select Soundtrack"
      step={2}
      totalSteps={2}
      accentColor="primary"
      onBack={handleBack}
      backLabel="Instrument Setup"
      footer={
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
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-foreground/50 animate-pulse font-medium">
          Loading soundtracks...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto no-scrollbar pb-12 w-full">
          {tracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelected(track.id)}
              className={`w-full p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col items-start gap-4 ${
                selected === track.id
                  ? "bg-foreground border-foreground scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                  : "bg-foreground/5 border-foreground/10 hover:border-foreground/30 hover:bg-foreground/10 text-foreground/80"
              }`}
            >
              <div className="flex items-center gap-4 w-full">
                <div
                  className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    selected === track.id
                      ? "bg-background text-foreground"
                      : "bg-foreground/10 text-foreground/50"
                  }`}
                >
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-lg sm:text-xl font-bold truncate ${
                      selected === track.id
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {track.name}
                  </span>
                  <span
                    className={`text-sm font-medium truncate ${
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
                className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
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
    </NavigationLayout>
  );
}
