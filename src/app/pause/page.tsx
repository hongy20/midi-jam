import type { Metadata } from "next";
import { PausePageClient } from "./components/pause-page.client";

export const metadata: Metadata = {
  title: "Game Paused | Midi Jam",
  description: "Gameplay is currently paused.",
};

export default function PausePage() {
  return <PausePageClient />;
}
