"use client";
import { memo, useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import type { HitQuality } from "../../hooks/use-score-engine";
import styles from "./live-score.module.css";

interface LiveScoreProps {
  getScore: () => number;
  getCombo: () => number;
  getLastHitQuality: () => HitQuality;
  getProgress: () => number;
}

export const LiveScore = memo(function LiveScore({
  getScore,
  getCombo,
  getLastHitQuality,
  getProgress,
}: LiveScoreProps) {
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const progressValueRef = useRef<HTMLSpanElement>(null);
  const scoreValueRef = useRef<HTMLSpanElement>(null);
  const comboValueRef = useRef<HTMLSpanElement>(null);
  const feedbackRef = useRef<HTMLSpanElement>(null);

  // Keep track of previous values to avoid redundant DOM updates
  const lastStateRef = useRef({
    score: -1,
    combo: -1,
    progress: -1,
    quality: null as HitQuality,
  });

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const score = getScore();
      const combo = getCombo();
      const progress = getProgress();
      const quality = getLastHitQuality();
      const state = lastStateRef.current;

      // 1. Update Score (Normalized)
      if (score !== state.score && scoreValueRef.current) {
        scoreValueRef.current.textContent = score.toFixed(1);
        state.score = score;
      }

      // 2. Update Combo
      if (combo !== state.combo && comboValueRef.current) {
        comboValueRef.current.textContent = `x${combo}`;
        state.combo = combo;
      }

      // 3. Update Progress Bar
      if (progress !== state.progress) {
        if (progressBarFillRef.current) {
          progressBarFillRef.current.style.transform = `scaleX(${progress})`;
        }
        if (progressValueRef.current) {
          const percentage = Math.floor(progress * 100);
          // Only update text if the rounded percentage actually changed
          if (Math.floor(state.progress * 100) !== percentage) {
            progressValueRef.current.textContent = `${percentage}%`;
          }
        }
        state.progress = progress;
      }

      // 4. Update Hit Quality Feedback
      if (quality !== state.quality && feedbackRef.current) {
        const el = feedbackRef.current;
        // Clean up previous classes
        if (state.quality) el.classList.remove(styles[state.quality]);

        if (quality) {
          el.textContent = `${quality.toUpperCase()}!`;
          el.classList.add(styles[quality]);
          el.style.opacity = "1";

          // Trigger animation restart
          el.style.animation = "none";
          void el.offsetWidth; // Force reflow
          el.style.animation = "";
        } else {
          el.style.opacity = "0";
        }
        state.quality = quality;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [getScore, getCombo, getLastHitQuality, getProgress]);

  return (
    <div className="flex items-center gap-8 w-full">
      {/* Score & Combo */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[8px] text-foreground opacity-60 font-normal uppercase tracking-widest retro">
            Score
          </span>
          <span
            ref={scoreValueRef}
            className="text-base font-normal tabular-nums leading-relaxed retro"
          >
            0
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[8px] text-foreground opacity-60 font-normal uppercase tracking-widest retro">
            Combo
          </span>
          <span
            ref={comboValueRef}
            className="text-base font-normal tabular-nums leading-relaxed retro"
          >
            x0
          </span>
        </div>
      </div>

      {/* Hit Quality Feedback */}
      <div className="min-w-[120px] flex items-center justify-center">
        <span
          ref={feedbackRef}
          className={cn(
            "text-[0.875rem] font-normal uppercase tracking-tight will-change-transform transition-colors duration-100 retro",
            styles.hitText,
          )}
          style={{ opacity: 0 }}
        />
      </div>

      {/* Progress Bar */}
      <div className="flex-1 max-w-[150px] hidden sm:flex flex-col gap-2">
        <div className="flex justify-between items-end gap-1">
          <span className="text-[8px] text-foreground opacity-60 font-normal uppercase retro">
            Progress
          </span>
          <span ref={progressValueRef} className="text-[8px] font-normal tabular-nums retro">
            0%
          </span>
        </div>
        <div className="h-3 w-full bg-foreground/10 border-4 border-foreground overflow-hidden [image-rendering:pixelated]">
          <div
            ref={progressBarFillRef}
            className="h-full w-full bg-primary origin-left [transform:scaleX(0)]"
          />
        </div>
      </div>
    </div>
  );
});
