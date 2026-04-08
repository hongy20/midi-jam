"use client";

import { ArrowLeft, Dices, Music, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Carousel } from "@/components/carousel/carousel";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import {
  type CollectionTrack,
  TrackCard,
} from "@/components/track-card/track-card";
import { Button } from "@/components/ui/8bit/button";
import { useCollection } from "@/context/collection-context";
import { useNavigation } from "@/hooks/use-navigation";
import { getSoundTracks } from "@/lib/action/sound-track";

export default function CollectionPage() {
  const { toPlay, toGear } = useNavigation();
  const { setSelectedTrack, selectedTrack } = useCollection();

  const [tracks, setTracks] = useState<CollectionTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tracks on mount
  useEffect(() => {
    async function fetchTracks() {
      const data = await getSoundTracks();
      setTracks(data);
      setIsLoading(false);
    }
    fetchTracks();
  }, []);

  const handleTrackSelection = useCallback(
    (track?: CollectionTrack) => {
      if (!track) return;
      setSelectedTrack({
        id: track.id,
        name: track.name,
        url: track.url,
      });
    },
    [setSelectedTrack],
  );

  return (
    <PageLayout
      header={
        <PageHeader title="SONG GALLERY">
          <Button
            variant="secondary"
            onClick={() => {
              const otherTracks = tracks.filter(
                (t) => t.id !== selectedTrack?.id,
              );
              handleTrackSelection(
                otherTracks[Math.floor(Math.random() * otherTracks.length)],
              );
            }}
            disabled={tracks.length <= 1}
            size="sm"
            font="retro"
          >
            <Dices className="size-4 mr-2" />
            SHUFFLE
          </Button>
        </PageHeader>
      }
      footer={
        <PageFooter>
          <Button
            variant="secondary"
            onClick={() => toGear()}
            size="sm"
            font="retro"
          >
            <ArrowLeft className="size-4 mr-2" />
            GEAR
          </Button>
          <Button
            onClick={() => toPlay()}
            disabled={!selectedTrack}
            size="sm"
            font="retro"
          >
            START JAM
            <Play className="size-4 ml-2 fill-current" />
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full py-8 px-4 sm:px-8 min-h-0 flex flex-col justify-center gap-8 overflow-hidden">
        {isLoading ? (
          <p className="retro text-center text-foreground/60 text-[10px] uppercase tracking-[0.5em] animate-pulse flex flex-col items-center gap-6 before:content-[''] before:block before:size-16 before:border-8 before:border-foreground/10 before:border-t-primary before:animate-spin">
            Retrieving Track List...
          </p>
        ) : tracks.length === 0 ? (
          <p className="retro text-center text-foreground/20 text-[10px] uppercase tracking-[0.3em] leading-loose flex flex-col items-center gap-6">
            <Music className="size-16 opacity-20" />
            No songs found. Please refresh or try again later.
          </p>
        ) : (
          <>
            <div className="bg-accent px-4 py-2 border-4 border-foreground dark:border-ring retro text-[10px] uppercase tracking-widest mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] self-center">
              {tracks.length} TRACKS FOUND
            </div>

            <p className="retro text-[8px] opacity-40 uppercase tracking-widest text-center mb-4">
              Select a song below to continue.
            </p>

            <Carousel
              selectedIndex={tracks.findIndex(
                (t) => t.id === selectedTrack?.id,
              )}
              onSelectedIndexChange={(idx) => handleTrackSelection(tracks[idx])}
              className="flex-1 min-h-0"
            >
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isSelected={selectedTrack?.id === track.id}
                  className="w-[280px] h-[140px] shrink-0"
                />
              ))}
            </Carousel>
          </>
        )}
      </main>
    </PageLayout>
  );
}
