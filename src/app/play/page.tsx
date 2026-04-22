import { PlayPageClient } from "./components/play-page.client";
import { PlayPageLoader } from "./components/play-page.loader";

export const metadata = {
  title: "Stage | MIDI Jam",
  description: "Play your favorite MIDI songs in a high-performance visualizer.",
};

/**
 * PlayPage Entry (Server Component)
 * Leverages PlayPageLoader for suspense.
 */
export default function PlayPage() {
  return (
    <PlayPageLoader>
      <PlayPageClient />
    </PlayPageLoader>
  );
}
