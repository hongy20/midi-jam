"use client";

import { ArrowLeft, Dices, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/button";
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
import styles from "./page.module.css";

export default function CollectionPage() {
  const { toPlay, toGear } = useNavigation();
  const { setSelectedTrack, selectedTrack } = useCollection();

  const [tracks, setTracks] = useState<CollectionTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      const data = await getSoundTracks();
      setTracks(data);
      setIsLoading(false);
    }
    fetchTracks();
  }, []);

  const setupObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (node) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const trackId = entry.target.getAttribute("data-track-id");
                const track = tracks.find((t) => t.id === trackId);
                if (track) {
                  setSelectedTrack({
                    id: track.id,
                    name: track.name,
                    url: track.url,
                  });
                }
              }
            }
          },
          {
            root: node,
            rootMargin: "0px -45% 0px -45%",
            threshold: 0.5,
          },
        );

        observerRef.current = observer;
      }
    },
    [tracks, setSelectedTrack],
  );

  return (
    <PageLayout
      header={
        <PageHeader title="Songs">
          <Button
            variant="secondary"
            onClick={() => {
              if (tracks.length > 0) {
                // Filter out the currently selected track if there are other options
                const availableTracks =
                  tracks.length > 1
                    ? tracks.filter((t) => t.id !== selectedTrack?.id)
                    : tracks;

                const track =
                  availableTracks[
                    Math.floor(Math.random() * availableTracks.length)
                  ];

                setSelectedTrack({
                  id: track.id,
                  name: track.name,
                  url: track.url,
                });

                // Programmatically scroll the selected track into center
                const container = scrollContainerRef.current;
                if (container) {
                  const element = container.querySelector(
                    `[data-track-id="${track.id}"]`,
                  );
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }
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
      <main className="w-full h-full overflow-y-auto overflow-x-hidden py-4 px-8 min-h-0 flex flex-col justify-center">
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
            <div
              ref={(node) => {
                scrollContainerRef.current = node;
                setupObserver(node);
              }}
              className={styles.gallery}
            >
              {tracks.map((track) => (
                <div
                  key={track.id}
                  data-track-id={track.id}
                  ref={(el) => {
                    if (el && observerRef.current)
                      observerRef.current.observe(el);
                  }}
                  className="shrink-0 h-[80%] flex items-center"
                >
                  <TrackCard
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
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </PageLayout>
  );
}
