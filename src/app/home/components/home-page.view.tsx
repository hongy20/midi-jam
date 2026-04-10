"use client";

import { useEffect } from "react";
import Hero3 from "@/components/ui/8bit/blocks/hero3";
import { MIDI_UNSUPPORTED } from "../lib/constants";

interface HomePageViewProps {
  onStart: () => void;
  onOptions: () => void;
  songsCount: number;
}

export function HomePageView({
  onStart,
  onOptions,
  songsCount,
}: HomePageViewProps) {
  useEffect(() => {
    const isSupported =
      typeof navigator !== "undefined" && "requestMIDIAccess" in navigator;
    if (!isSupported) {
      throw new Error(MIDI_UNSUPPORTED);
    }
  }, []);

  const actions = [
    {
      label: "START GAME",
      onClick: onStart,
      variant: "default" as const,
      className: "w-40",
    },
    {
      label: "Options",
      onClick: onOptions,
      variant: "secondary" as const,
      className: "w-40",
    },
  ];

  const stats = [{ label: "SONGS", value: String(songsCount) }];

  return (
    <main className="flex h-dvh items-center justify-center">
      <Hero3 title="MIDI JAM" actions={actions} stats={stats} />
    </main>
  );
}
