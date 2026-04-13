"use client";

import { useCollection } from "@/context/collection-context";
import { useGear } from "@/context/gear-context";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useTrack } from "@/context/track-context";
import { useNavigation } from "@/hooks/use-navigation";
import { PausePageView } from "./pause-page.view";

export function PausePageClient() {
  const { toPlay, toOptions, toScore } = useNavigation();
  const { gameSession, setGameSession } = useStage();
  const { trackStatus } = useTrack();
  const { selectedMIDIInput } = useGear();
  const { selectedTrack } = useCollection();
  const { setSessionResults } = useScore();

  // Error guard: if we're on the pause page without an active session/selection, 
  // something is wrong. We throw to let the error boundary handle it.
  if (!selectedTrack || !selectedMIDIInput) {
    throw new Error("Cannot access Pause page without an active track and MIDI input.");
  }

  return (
    <PausePageView
      onContinue={() => toPlay()}
      onRestart={() => {
        setGameSession(null);
        toPlay();
      }}
      onSettings={() => toOptions("pause")}
      onQuit={() => {
        if (gameSession && trackStatus.isReady) {
          const { score: currentScore, combo } = gameSession;
          const totalEvents = trackStatus.events.length;
          setSessionResults({
            score: currentScore,
            accuracy: Math.floor((currentScore / (totalEvents * 100)) * 100) || 0,
            combo,
          });
        }
        setGameSession(null);
        toScore();
      }}
    />
  );
}
