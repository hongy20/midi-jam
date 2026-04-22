import { PlayPageClient } from "./components/play-page.client";
import { PlayPageLoader, PlayProvider } from "@/features/play-session";

export const metadata = {
  title: "Stage | MIDI Jam",
  description: "Play your favorite MIDI songs in a high-performance visualizer.",
};

/**
 * PlayPage Entry (Server Component)
 * Wraps the Client logic in a PlayProvider and leverages PlayPageLoader for suspense.
 */
export default function PlayPage() {
  return (
    <PlayProvider>
      <PlayPageLoader>
        <PlayPageClient />
      </PlayPageLoader>
    </PlayProvider>
  );
}
