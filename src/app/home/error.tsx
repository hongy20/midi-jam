"use client";

import { useEffect } from "react";
import Hero3 from "@/components/8bit/hero3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (error.message === "MIDI_UNSUPPORTED") {
    return (
      <main>
        <Hero3 title="MIDI JAM" actions={[]} stats={[]}>
          <Card className="max-w-md mx-auto border-8 border-destructive shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="retro text-destructive flex items-center justify-center gap-2">
                UNSUPPORTED BROWSER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6!">
              <p className="retro text-[10px] leading-relaxed text-foreground/70">
                This app requires Web MIDI API. Please use Android Chrome or a modern Chromium browser.
              </p>
            </CardContent>
          </Card>
        </Hero3>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center p-8">
      <Card className="max-w-md border-8 border-destructive">
        <CardHeader>
          <CardTitle className="retro text-destructive">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="retro text-[10px]">{error.message}</p>
          <button 
            type="button"
            className="retro bg-foreground text-background p-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => reset()}
          >
            TRY AGAIN
          </button>
        </CardContent>
      </Card>
    </main>
  );
}
