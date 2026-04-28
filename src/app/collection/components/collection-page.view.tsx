"use client";

import { Dices, Play } from "lucide-react";

import { TrackCard } from "@/features/collection";
import { Button } from "@/shared/components/ui/8bit/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/8bit/carousel";
import type { Track } from "@/shared/types/track";

const CollectionHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="retro text-lg font-bold wrap-break-word uppercase sm:text-2xl md:text-3xl">
        {title}
      </h2>
      <span className="retro text-muted-foreground mx-auto block max-w-xl text-[9px] tracking-wider uppercase">
        {description}
      </span>
    </div>
  );
};

interface CollectionPageViewProps {
  tracks: Track[];
  selectedTrack: Track | null;
  onSelect: (track: Track) => void;
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
    <main className="flex h-dvh flex-col items-center justify-evenly overflow-x-hidden p-4 text-center">
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

          <div className="w-full overflow-visible px-12 md:px-16">
            <Carousel className="mx-auto w-full max-w-4xl" opts={{ align: "start", loop: false }}>
              <CarouselContent>
                {tracks.map((track) => (
                  <CarouselItem className="jam-carousel-item pl-4" key={track.id}>
                    <TrackCard
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
