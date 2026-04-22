"use client";

import { useEffect } from "react";

import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { usePlay } from "@/features/play-session";
import { useScore } from "@/features/score";
import { useNavigation } from "@/shared/hooks/use-navigation";

import { PausePageView } from "./pause-page.view";

export function PausePageClient() {
  const { toPlay, toOptions, toScore, toHome, toCollection } = useNavigation();
  const { playStatus, gameSession, setGameSession } = usePlay();
  const { selectedMIDIInput } = useGear();
  const { selectedTrack } = useCollection();
  const { setSessionResults } = useScore();

  useEffect(() => {
    if (!selectedMIDIInput) {
      toHome();
    } else if (!selectedTrack) {
      toCollection();
    }
  }, [selectedMIDIInput, selectedTrack, toHome, toCollection]);

  // If state is missing, return null while redirecting
  if (!selectedTrack || !selectedMIDIInput) {
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
        if (gameSession && playStatus.isReady) {
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
