"use client";

import { use, useCallback, useEffect } from "react";

import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useNavigation } from "@/shared/hooks/use-navigation";
import type { Track } from "@/shared/types/track";

import { CollectionPageView } from "./collection-page.view";

export function CollectionPageClient({ tracksPromise }: { tracksPromise: Promise<Track[]> }) {
  const tracks = use(tracksPromise);
  const { toPlay, toGear } = useNavigation();
  const { setSelectedTrack, selectedTrack } = useCollection();
  const { selectedMIDIInput } = useGear();

  useEffect(() => {
    if (!selectedMIDIInput) {
      toGear();
    }
  }, [selectedMIDIInput, toGear]);

  const handleTrackSelection = useCallback(
    (track: Track) => {
      setSelectedTrack(track);
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
      selectedTrack={selectedTrack}
      onSelect={handleTrackSelection}
      onShuffle={handleShuffle}
      onContinue={toPlay}
      onBack={() => toGear()}
    />
  );
}
