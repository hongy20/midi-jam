"use client";

import { useEffect, useMemo } from "react";
import { useNavigation } from "@/shared/hooks/use-navigation";
import { useScore } from "@/features/score";
import { ScorePageView } from "./score-page.view";

export function ScorePageClient() {
  const { toPlay, toCollection, toHome } = useNavigation();
  const { sessionResults } = useScore();

  useEffect(() => {
    if (!sessionResults) {
      toHome();
    }
  }, [sessionResults, toHome]);

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
    toPlay();
  };

  const handleSongs = () => {
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
