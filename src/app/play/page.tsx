import { PlayPageClient } from "./components/play-page.client";
import { PlayProvider } from "./context/play-context";

export const metadata = {
  title: "Stage | MIDI Jam",
  description: "Play your favorite MIDI songs in a high-performance visualizer.",
};

/**
 * PlayPage Entry (Server Component)
 * Wraps the Client logic in a PlayProvider and leverages native Next.js loading.tsx.
 */
export default function PlayPage() {
  return (
    <PlayProvider>
      <PlayPageClient />
    </PlayProvider>
  );
}
