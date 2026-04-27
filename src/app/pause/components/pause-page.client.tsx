"use client";

import { useEffect } from "react";

import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useGameplay } from "@/features/gameplay";
import { useNavigation } from "@/shared/hooks/use-navigation";

import { PausePageView } from "./pause-page.view";

export function PausePageClient() {
  const { toPlay, toOptions, toScore, toHome, toCollection } = useNavigation();
  const { gameState, resetGame, finishGame } = useGameplay();
  const { selectedMIDIInput } = useGear();
  const { selectedTrack } = useCollection();

  useEffect(() => {
    if (!selectedMIDIInput) {
      toHome();
    } else if (!selectedTrack) {
      toCollection();
    }
  }, [selectedMIDIInput, selectedTrack, toHome, toCollection]);

  return (
    <PausePageView
      onContinue={() => toPlay()}
      onRestart={() => {
        resetGame();
        toPlay();
      }}
      onOptions={() => toOptions("pause")}
      onQuit={() => {
        if (gameState.status === "paused") {
          finishGame({
            score: gameState.score,
            combo: gameState.combo,
          });
        }
        toScore();
      }}
    />
  );
}

