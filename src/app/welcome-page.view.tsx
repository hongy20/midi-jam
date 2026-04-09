"use client";

import { Play, Settings } from "lucide-react";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import styles from "./welcome-page.view.module.css";

interface WelcomePageViewProps {
  isLoading: boolean;
  isSupported: boolean;
  onStart: () => void;
  onOptions: () => void;
}

export function WelcomePageView({
  isLoading,
  isSupported,
  onStart,
  onOptions,
}: WelcomePageViewProps) {
  return (
    <PageLayout
      className={styles.page}
      footer={
        <PageFooter>The ultimate immersive musical experience</PageFooter>
      }
    >
      <main className="w-full h-full flex flex-col gap-12 items-center justify-center text-center p-4">
        <header className="flex flex-col gap-2">
          <h1 className="text-5xl md:text-7xl font-black retro tracking-tight bg-foreground text-background px-6 py-4 border-8 border-foreground dark:border-ring shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]">
            MIDI JAM
          </h1>
          <p className="retro text-xs opacity-60 uppercase tracking-widest mt-4">
            Press Start to Play
          </p>
        </header>

        {isLoading ? (
          <p className="mt-8 retro font-bold uppercase tracking-[0.5em] text-[10px] opacity-60 flex flex-col items-center gap-6 before:content-[''] before:block before:size-16 before:border-8 before:border-foreground/20 before:border-t-foreground before:animate-spin">
            Initializing Engine...
          </p>
        ) : isSupported ? (
          <Card className="w-full max-w-sm border-8 border-foreground dark:border-ring shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            <CardContent className="flex flex-col gap-6 p-8!">
              <Button
                onClick={onStart}
                size="lg"
                font="retro"
                className="w-full h-16 text-lg!"
              >
                <Play className="size-6 mr-2 fill-current" />
                START GAME
              </Button>
              <Button
                variant="secondary"
                onClick={onOptions}
                size="lg"
                font="retro"
                className="w-full h-16 text-lg!"
              >
                <Settings className="size-6 mr-2" />
                Options
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md border-8 border-destructive shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="retro text-destructive flex items-center justify-center gap-2">
                UNSUPPORTED BROWSER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6!">
              <p className="retro text-[10px] leading-relaxed text-foreground/70">
                This frequency requires Web MIDI API. Please deploy a modern
                Chromium browser or Android device.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </PageLayout>
  );
}
