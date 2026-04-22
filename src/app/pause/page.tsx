import type { Metadata } from "next";
import { PausePageClient } from "./components/pause-page.client";

export const metadata: Metadata = {
  title: "Game Paused | Midi Jam",
  description: "Take a break and resume when you're ready.",
};

/**
 * PausePage Entry (Server Component)
 */
export default function PausePage() {
  return <PausePageClient />;
}
