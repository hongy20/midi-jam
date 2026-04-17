import { PlayPageClient } from "./components/play-page.client";

export const metadata = {
  title: "Stage | MIDI Jam",
  description: "Play your favorite MIDI songs in a high-performance visualizer.",
};

/**
 * PlayPage Entry (Server Component)
 * Wraps the Client logic in a Suspense boundary to leverage the native Next.js loading state.
 */
export default function PlayPage() {
  return <PlayPageClient />;
}
