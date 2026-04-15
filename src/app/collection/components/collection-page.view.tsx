"use client";

import { Dices, Play } from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import { CollectionHeader } from "./collection-header";
import { SongCard, type SongCardTrack } from "./song-card";

interface CollectionPageViewProps {
  tracks: SongCardTrack[];
  selectedTrack: SongCardTrack | null;
  onSelect: (track: SongCardTrack) => void;
  onShuffle: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function CollectionPageView({
  tracks,
  selectedTrack,
  onSelect,
  onShuffle,
  onContinue,
  onBack,
}: CollectionPageViewProps) {
  return (
    <main className="flex flex-col h-dvh items-center justify-evenly p-4 overflow-x-hidden text-center">
      {tracks.length === 0 ? (
        <CollectionHeader
          title="No tracks found."
          description="Please check your library or try again later."
        />
      ) : (
        <>
          <CollectionHeader
            title="CHOOSE SONG"
            description="Select a song to play, or shuffle for a surprise."
          />

          <div className="w-full px-12 md:px-16 overflow-visible">
            <Carousel
              className="mx-auto w-full max-w-4xl"
              opts={{ align: "start", loop: false }}
            >
              <CarouselContent>
                {tracks.map((track) => (
                  <CarouselItem
                    className="pl-4 jam-carousel-item"
                    key={track.id}
                  >
                    <SongCard
                      track={track}
                      isSelected={selectedTrack?.id === track.id}
                      onClick={() => onSelect(track)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </>
      )}

      <div className="jam-action-group">
        <Button onClick={onBack} variant="secondary" className="btn-jam">
          BACK TO GEAR
        </Button>
        <Button
          onClick={onShuffle}
          variant="secondary"
          className="btn-jam"
          disabled={tracks.length <= 1}
        >
          <Dices />
          SHUFFLE
        </Button>
        <Button
          onClick={onContinue}
          variant="default"
          className="btn-jam"
          disabled={!selectedTrack}
        >
          <Play className="fill-current" />
          PLAY
        </Button>
      </div>
    </main>
  );
}
