"use client";

import { useStage } from "@/app/play/context/stage-context";
import { useCollection } from "@/features/collection";
import { useTrack } from "@/features/midi-assets";
import { useGear } from "@/features/midi-hardware";
import { useNavigation } from "@/features/navigation";
import { useScore } from "@/features/score";
import { PausePageView } from "./pause-page.view";

export function PausePageClient() {
  const { toPlay, toOptions, toScore } = useNavigation();
  const { gameSession, setGameSession } = useStage();
  const { trackStatus } = useTrack();
  const { selectedMIDIInput } = useGear();
  const { selectedTrack } = useCollection();
  const { setSessionResults } = useScore();

  // If state is missing, either throw (client-side) or return null (SSR/prerender)
  if (!selectedTrack || !selectedMIDIInput) {
    if (typeof window !== "undefined") {
      throw new Error("Cannot access Pause page without an active track and MIDI input.");
    }
    return null;
  }

  return (
    <PausePageView
      onContinue={() => toPlay()}
      onRestart={() => {
        setGameSession(null);
        toPlay();
      }}
      onOptions={() => toOptions("pause")}
      onQuit={() => {
        if (gameSession && trackStatus.isReady) {
          const { score: currentScore, combo } = gameSession;
          setSessionResults({
            score: currentScore,
            combo,
          });
        }
        setGameSession(null);
        toScore();
      }}
    />
  );
}
