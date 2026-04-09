"use client";

import { Play, Settings } from "lucide-react";
import Hero3 from "@/components/8bit/hero3";
import LoadingScreen from "@/components/8bit/loading-screen";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

interface WelcomePageViewProps {
  onStart: () => void;
  onOptions: () => void;
}

export function WelcomePageView({
  onStart,
  onOptions,
}: WelcomePageViewProps) {
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

  return (
    <main>
      <Hero3 title="MIDI JAM" actions={actions} stats={[]} />
    </main>
  );
}
