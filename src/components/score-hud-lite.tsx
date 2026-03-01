"use client";

import { useEffect, useState } from "react";
import type { HitQuality } from "@/hooks/use-lane-score-engine";

interface ScoreHudLiteProps {
  score: number;
  combo: number;
  lastHitQuality: HitQuality;
  getProgress: () => number;
  isPaused: boolean;
}

export function ScoreHudLite({
  score,
  combo,
  lastHitQuality,
  getProgress,
  isPaused,
}: ScoreHudLiteProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(getProgress());
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, getProgress]);

  const percentage = Math.floor(progress * 100);

  return (
    <div className="flex items-center gap-8 w-full">
      {/* Score & Combo */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
            Score
          </span>
          <span className="text-xl font-black tabular-nums leading-none">
            {score.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
            Combo
          </span>
          <span className="text-xl font-black tabular-nums leading-none">
            x{combo}
          </span>
        </div>
      </div>

      {/* Hit Quality Feedback */}
      <div className="min-w-[80px] flex items-center justify-center">
        {lastHitQuality && (
          <span
            className={`text-lg font-black uppercase italic tracking-tighter animate-bounce ${
              lastHitQuality === "perfect"
                ? "text-yellow-400"
                : lastHitQuality === "good"
                  ? "text-green-400"
                  : "text-red-500"
            }`}
          >
            {lastHitQuality}!
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex-1 max-w-[200px] hidden sm:flex flex-col gap-1">
        <div className="flex justify-between items-end gap-1">
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest leading-none">
            Progress
          </span>
          <span className="text-[10px] font-black tabular-nums leading-none">
            {percentage}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full w-full bg-foreground origin-left"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </div>
  );
}
