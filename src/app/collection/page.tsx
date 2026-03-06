"use client";

import { ArrowLeft, Dices, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { getSoundTracks } from "@/lib/action/sound-track";

interface Track {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}

export default function CollectionPage() {
  const { toPlay, toGear } = useNavigation();
  const { tracks: contextTracks } = useAppContext();
  const { set: setTrack, selected: selectedTrack } = contextTracks;

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
      toPlay();
    }
  };

  const handleBack = () => {
    toGear();
  };

  const handleSurprise = () => {
    if (tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setSelected(randomTrack.id);
    }
  };

  return (
    <PageLayout
      header={
        <PageHeader title="Song Collection">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            iconPosition="left"
            onClick={handleBack}
            size="sm"
          >
            Your Gear
          </Button>
        </PageHeader>
      }
      footer={
        <PageFooter>
          <div className="w-full sm:flex-1 flex">
            <Button
              variant="secondary"
              onClick={handleSurprise}
              icon={Dices}
              size="md"
            >
              SURPRISE
            </Button>
          </div>
          <div className="w-full sm:flex-[2] flex">
            <Button
              onClick={handlePlay}
              disabled={!selected}
              icon={Play}
              size="md"
            >
              PLAY
            </Button>
          </div>
        </PageFooter>
      }
    >
      <main
        className={`overflow-y-auto overflow-x-hidden no-scrollbar py-4 landscape:py-2 px-8 -mx-8 min-h-0 grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-6 pb-12 w-full`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-foreground/50 animate-pulse font-medium col-span-full">
            Loading songs...
          </div>
        ) : (
          tracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelected(track.id)}
              className={`w-full p-5 sm:p-6 landscape:p-3 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col items-start gap-4 landscape:gap-2 ${
                selected === track.id
                  ? "bg-foreground border-foreground scale-[1.02] shadow-[var(--ui-btn-primary-shadow)]"
                  : "bg-[var(--ui-card-bg)] border-[var(--ui-card-border)] hover:border-foreground/30 hover:bg-foreground/10 text-foreground/80"
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
          ))
        )}
      </main>
    </PageLayout>
  );
}
