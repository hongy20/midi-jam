import type { Metadata } from "next";
import { PausePageClient } from "./components/pause-page.client";
import { PlayProvider } from "@/features/play-session";

export const metadata: Metadata = {
  title: "Game Paused | Midi Jam",
  description: "Gameplay is currently paused.",
};

export default function PausePage() {
  return (
    <PlayProvider>
      <PausePageClient />
    </PlayProvider>
  );
}
