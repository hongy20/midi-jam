import { Suspense } from "react";

import { PlayPageClient } from "./components/play-page.client";

export const metadata = {
  title: "Stage | MIDI Jam",
  description: "Play your favorite MIDI songs in a high-performance visualizer.",
};

/**
 * PlayPage Entry (Server Component)
 * Uses standard Suspense boundary for client-side loading.
 */
export default function PlayPage() {
  return (
    <Suspense>
      <PlayPageClient />
    </Suspense>
  );
}
