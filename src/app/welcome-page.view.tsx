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

import { cn } from "@/lib/utils";
import styles from "./welcome-page.view.module.css";

interface WelcomePageViewProps {
  isLoading: boolean;
  isSupported: boolean;
  loadingTimeout: number;
  onStart: () => void;
  onOptions: () => void;
}

const LOADING_TIPS = [
  "Tip: Connect your MIDI keyboard before starting for the best experience.",
  "Tip: Use the Gear menu to configure your MIDI inputs and instruments.",
  "Tip: Lower your buffer size in Options if you experience audio latency.",
  "Did you know? You can play along with any MIDI song in your collection.",
  "Tip: Use the sustain pedal for more expressive piano performances.",
];

export function WelcomePageView({
  isLoading,
  isSupported,
  loadingTimeout,
  onStart,
  onOptions,
}: WelcomePageViewProps) {
  if (isLoading) {
    return (
      <main className={cn(styles.page, "flex items-center justify-center")}>
        <LoadingScreen
          autoProgress
          autoProgressDuration={loadingTimeout}
          tips={LOADING_TIPS}
        />
      </main>
    );
  }

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
    <main className={styles.page}>
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
