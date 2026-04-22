"use client";

import { useEffect } from "react";

import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";
import { useNavigation } from "@/shared/hooks/use-navigation";

import { HomePageView } from "./home-page.view";

interface HomePageClientProps {
  songsCount: number;
}

export function HomePageClient({ songsCount }: HomePageClientProps) {
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
    <HomePageView onStart={() => toGear()} onOptions={() => toOptions()} songsCount={songsCount} />
  );
}
