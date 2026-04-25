import { PlayPageClient } from "./components/play-page.client";

export const metadata = {
  title: "Stage | MIDI Jam",
  description: "Play your favorite MIDI songs in a high-performance note highway.",
};

/**
 * PlayPage Entry (Server Component)
 * Uses standard Next.js loading.tsx boundary for client-side loading.
 */
export default function PlayPage() {
  return <PlayPageClient />;
}
