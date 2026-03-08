"use client";

import { ArrowLeft, Dices, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/button/button";
import { Carousel } from "@/components/carousel/carousel";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import {
  type CollectionTrack,
  TrackCard,
} from "@/components/track-card/track-card";
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

  const handleNavigate = useCallback(
    (direction: "prev" | "next" | "random") => {
      if (tracks.length === 0) return;

      let track: CollectionTrack;

      if (direction === "random") {
        const availableTracks =
          tracks.length > 1
            ? tracks.filter((t) => t.id !== selectedTrack?.id)
            : tracks;

        track =
          availableTracks[Math.floor(Math.random() * availableTracks.length)];
      } else {
        const currentIndex = tracks.findIndex(
          (t) => t.id === selectedTrack?.id,
        );
        let nextIndex: number;

        if (direction === "prev") {
          nextIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        } else {
          nextIndex = (currentIndex + 1) % tracks.length;
        }

        track = tracks[nextIndex];
      }

      setSelectedTrack({
        id: track.id,
        name: track.name,
        url: track.url,
      });
    },
    [tracks, selectedTrack, setSelectedTrack],
  );

  const selectedIndex = tracks.findIndex((t) => t.id === selectedTrack?.id);

  return (
    <PageLayout
      header={
        <PageHeader title="Songs">
          <Button
            variant="secondary"
            onClick={() => handleNavigate("random")}
            icon={Dices}
            size="sm"
          />
        </PageHeader>
      }
      footer={
        <PageFooter>
          <Button
            variant="secondary"
            icon={ArrowLeft}
            iconPosition="left"
            onClick={() => toGear()}
            size="sm"
          >
            Select Gear
          </Button>
          <Button
            onClick={() => toPlay()}
            disabled={!selectedTrack}
            icon={Play}
            size="sm"
          >
            PLAY
          </Button>
        </PageFooter>
      }
    >
      <main className="w-full h-full py-4 px-8 min-h-0 flex flex-col justify-center">
        {isLoading ? (
          <p className="text-center text-foreground/60 text-base font-medium animate-pulse">
            Searching for tracks...
          </p>
        ) : tracks.length === 0 ? (
          <p className="text-center text-foreground/60 text-base font-medium">
            No songs found. Please refresh or try again later.
          </p>
        ) : (
          <>
            <p className="text-center text-foreground/60 text-base font-medium mb-8">
              Select a song below to continue.
            </p>

            <Carousel
              selectedIndex={selectedIndex}
              onSelect={(index) => {
                const track = tracks[index];
                if (track) {
                  setSelectedTrack({
                    id: track.id,
                    name: track.name,
                    url: track.url,
                  });
                }
              }}
              className="group/gallery"
            >
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isSelected={selectedTrack?.id === track.id}
                  onClick={() =>
                    setSelectedTrack({
                      id: track.id,
                      name: track.name,
                      url: track.url,
                    })
                  }
                />
              ))}
            </Carousel>
          </>
        )}
      </main>
    </PageLayout>
  );
}
