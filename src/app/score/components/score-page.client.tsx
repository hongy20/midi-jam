"use client";

import { useMemo } from "react";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useNavigation } from "@/hooks/use-navigation";
import { ScorePageView } from "./score-page.view";

export function ScorePageClient() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const { setGameSession } = useStage();
  const { sessionResults } = useScore();

  const results = useMemo(
    () =>
      sessionResults ?? {
        score: 0,
        accuracy: 0,
        combo: 0,
      },
    [sessionResults],
  );

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 91) return "Outstanding!";
    if (accuracy >= 71) return "Great Job!";
    if (accuracy >= 41) return "Not Bad!";
    return "Keep Practicing!";
  };

  const titleLabel = getAccuracyLabel(results.accuracy);

  const handleRetry = () => {
    setGameSession(null);
    toPlay();
  };

  const handleSongs = () => {
    setGameSession(null);
    toCollection();
  };

  return (
    <ScorePageView
      title={titleLabel}
      score={results.score.toFixed(2)}
      accuracy={`${results.accuracy.toFixed(2)}%`}
      combo={results.combo}
      onRetry={handleRetry}
      onSongs={handleSongs}
      onHome={() => toHome()}
    />
  );
}
