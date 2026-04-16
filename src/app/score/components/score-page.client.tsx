"use client";

import { useMemo } from "react";
import { useStage } from "@/app/play/context/stage-context";
import { useNavigation } from "@/features/navigation";
import { useScore } from "@/features/score/context/score-context";
import { ScorePageView } from "./score-page.view";

export function ScorePageClient() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const { setGameSession } = useStage();
  const { sessionResults } = useScore();

  const results = useMemo(
    () =>
      sessionResults ?? {
        score: 0,
        combo: 0,
      },
    [sessionResults],
  );

  const getAccuracyLabel = (score: number) => {
    if (score >= 91) return "Outstanding!";
    if (score >= 71) return "Great Job!";
    if (score >= 41) return "Not Bad!";
    return "Keep Practicing!";
  };

  const titleLabel = getAccuracyLabel(results.score);

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
      score={results.score.toFixed(1)}
      combo={results.combo}
      onRetry={handleRetry}
      onSongs={handleSongs}
      onHome={() => toHome()}
    />
  );
}
