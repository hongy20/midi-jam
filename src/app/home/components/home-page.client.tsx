"use client";

import { use, useEffect } from "react";

import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";
import { useNavigation } from "@/shared/hooks/use-navigation";
import type { Track } from "@/shared/types/track";

import { HomePageView } from "./home-page.view";

interface HomePageClientProps {
  tracksPromise: Promise<Track[]>;
}

export function HomePageClient({ tracksPromise }: HomePageClientProps) {
  const tracks = use(tracksPromise);

  const { toGear, toOptions } = useNavigation();
  const { resetCollection } = useCollection();
  const { selectMIDIInput } = useGear();
  const { resetScore } = useScore();

  useEffect(() => {
    resetCollection();
    resetScore();
    selectMIDIInput(null);
  }, [resetCollection, resetScore, selectMIDIInput]);

  return (
    <HomePageView
      onStart={() => toGear()}
      onOptions={() => toOptions()}
      songsCount={tracks.length}
    />
  );
}
