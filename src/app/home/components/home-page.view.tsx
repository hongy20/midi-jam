"use client";

import { Play, Settings } from "lucide-react";
import { useEffect } from "react";
import Hero3 from "@/components/8bit/hero3";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

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
    const isSupported = typeof navigator !== "undefined" && "requestMIDIAccess" in navigator;
    if (!isSupported) {
      throw new Error("MIDI_UNSUPPORTED");
    }
  }, []);

  const actions = [
    {
      label: "START GAME",
      onClick: onStart,
      icon: Play,
    },
    {
      label: "Options",
      onClick: onOptions,
      variant: "secondary" as const,
      icon: Settings,
    },
  ];

  const stats = [
    { label: "SONGS", value: String(songsCount) },
  ];

  return (
    <main>
      <Hero3 title="MIDI JAM" actions={actions} stats={stats} />
    </main>
  );
}
