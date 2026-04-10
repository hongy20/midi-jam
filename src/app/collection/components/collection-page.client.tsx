"use client";

import { useCallback, useEffect, useState } from "react";
import { useCollection } from "@/context/collection-context";
import { useNavigation } from "@/hooks/use-navigation";
import { getSoundTracks } from "@/lib/action/sound-track";
import { CollectionPageView } from "./collection-page.view";
import type { SongCardTrack } from "./song-card";

export function CollectionPageClient() {
  const { toPlay, toGear } = useNavigation();
  const { setSelectedTrack, selectedTrack } = useCollection();

  const [tracks, setTracks] = useState<SongCardTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tracks on mount
  useEffect(() => {
    async function fetchTracks() {
      const data = await getSoundTracks(800); // Add a small delay for smoother transition
      setTracks(data);
      setIsLoading(false);
    }
    fetchTracks();
  }, []);

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
      handleTrackSelection(
        otherTracks[Math.floor(Math.random() * otherTracks.length)],
      );
    }
  }, [tracks, selectedTrack, handleTrackSelection]);

  return (
    <CollectionPageView
      tracks={tracks}
      selectedTrack={selectedTrack as SongCardTrack | null}
      isLoading={isLoading}
      onSelect={handleTrackSelection}
      onShuffle={handleShuffle}
      onContinue={toPlay}
      onBack={() => toGear()}
    />
  );
}
