"use client";

import { useCallback } from "react";
import { useCollection } from "@/features/collection";
import { useNavigation } from "@/features/navigation";
import { CollectionPageView } from "./collection-page.view";
import type { SongCardTrack } from "./song-card";

export function CollectionPageClient({ tracks }: { tracks: SongCardTrack[] }) {
  const { toPlay, toGear } = useNavigation();
  const { setSelectedTrack, selectedTrack } = useCollection();

  const handleTrackSelection = useCallback(
    (track?: SongCardTrack) => {
      if (!track) return;
      setSelectedTrack({
        id: track.id,
        name: track.name,
        url: track.url,
      });
    },
    [setSelectedTrack],
  );

  const handleShuffle = useCallback(() => {
    const otherTracks = tracks.filter((t) => t.id !== selectedTrack?.id);
    if (otherTracks.length > 0) {
      handleTrackSelection(otherTracks[Math.floor(Math.random() * otherTracks.length)]);
    }
  }, [tracks, selectedTrack, handleTrackSelection]);

  return (
    <CollectionPageView
      tracks={tracks}
      selectedTrack={selectedTrack as SongCardTrack | null}
      onSelect={handleTrackSelection}
      onShuffle={handleShuffle}
      onContinue={toPlay}
      onBack={() => toGear()}
    />
  );
}
