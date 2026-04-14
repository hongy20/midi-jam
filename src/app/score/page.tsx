import type { Metadata } from "next";
import { ScorePageClient } from "./components/score-page.client";

export const metadata: Metadata = {
  title: "Final Score | Midi Jam",
  description: "View your performance and session results.",
};

export default function ScorePage() {
  return <ScorePageClient />;
}
