"use client";

import { useEffect, useState } from "react";
import type { Accuracy } from "@/hooks/use-score-engine";

interface ScoreHudProps {
  score: number;
  combo: number;
  lastAccuracy: Accuracy;
}

export function ScoreHud({ score, combo, lastAccuracy }: ScoreHudProps) {
  const [accuracyDisplay, setAccuracyDisplay] = useState<{
    text: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    if (lastAccuracy) {
      setAccuracyDisplay({
        text: lastAccuracy,
        id: Date.now(),
      });
    }
  }, [lastAccuracy]);

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-40">
      {/* Accuracy Feedback */}
      <div className="h-16 flex items-center justify-center">
        {accuracyDisplay && (
          <div
            key={accuracyDisplay.id}
            className="text-4xl font-black tracking-tighter italic text-white animate-accuracy-pop"
          >
            {accuracyDisplay.text}!
          </div>
        )}
      </div>

      {/* Score & Combo */}
      <div className="flex flex-col items-center gap-1 mt-4">
        <div className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tabular-nums">
          {score.toFixed(1)}
        </div>
        
        {combo >= 2 && (
          <div className="bg-white/90 backdrop-blur-md px-6 py-1 rounded-full text-slate-900 font-black text-xl shadow-xl animate-in zoom-in duration-300">
            {combo}x COMBO
          </div>
        )}
      </div>
    </div>
  );
}
