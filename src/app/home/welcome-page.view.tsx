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
  isSupported: boolean;
  onStart: () => void;
  onOptions: () => void;
}

export function WelcomePageView({
  isSupported,
  onStart,
  onOptions,
}: WelcomePageViewProps) {

  const actions = isSupported
    ? [
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
      ]
    : [];

  return (
    <main>
      <Hero3 title="MIDI JAM" actions={actions} stats={[]}>
        {!isSupported && (
          <Card className="max-w-md mx-auto border-8 border-destructive shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="retro text-destructive flex items-center justify-center gap-2">
                UNSUPPORTED BROWSER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6!">
              <p className="retro text-[10px] leading-relaxed text-foreground/70">
                This app requires Web MIDI API. Please use Android Chrome or a
                modern Chromium browser.
              </p>
            </CardContent>
          </Card>
        )}
      </Hero3>
    </main>
  );
}
