"use client";

import { ArrowLeft, Dices, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import {
  type CollectionTrack,
  TrackCard,
} from "@/components/track-card/track-card";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { getSoundTracks } from "@/lib/action/sound-track";

export default function CollectionPage() {
  const { toPlay, toGear } = useNavigation();
  const {
    collection: { setSelectedTrack, selectedTrack },
  } = useAppContext();

  const [tracks, setTracks] = useState<CollectionTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      const data = await getSoundTracks();
      setTracks(data);
      setIsLoading(false);
    }
    fetchTracks();
  }, []);

  return (
    <PageLayout
      header={
        <PageHeader title="Songs">
          <Button
            variant="secondary"
            onClick={() => {
              if (tracks.length > 0) {
                const track = tracks[Math.floor(Math.random() * tracks.length)];
                setSelectedTrack({
                  id: track.id,
                  name: track.name,
                  url: track.url,
                });
              }
            }}
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
      <main className="w-full h-full overflow-y-auto overflow-x-hidden py-4 px-8 min-h-0 flex flex-col">
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
            <div className="flex-1 flex items-center gap-6 overflow-x-auto snap-x snap-mandatory px-8">
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
                  className="shrink-0 w-[calc(100%-3rem)] sm:w-[360px] h-full snap-center"
                />
              ))}
            </div>
          </>
        )}
      </main>
    </PageLayout>
  );
}
