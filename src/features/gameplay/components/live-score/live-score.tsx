"use client";
import { memo, useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import type { HitQuality } from "../../hooks/use-score-engine";
import styles from "./live-score.module.css";

interface LiveScoreProps {
  getScore: () => number;
  getCombo: () => number;
  lastHit: { quality: Exclude<HitQuality, null>; id: number } | null;
  getProgress: () => number;
}

export const LiveScore = memo(function LiveScore({
  getScore,
  getCombo,
  lastHit,
  getProgress,
}: LiveScoreProps) {
  const scoreValueRef = useRef<HTMLSpanElement>(null);
  const comboValueRef = useRef<HTMLSpanElement>(null);
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const progressValueRef = useRef<HTMLSpanElement>(null);
  const feedbackRef = useRef<HTMLSpanElement>(null);

  const lastStateRef = useRef({
    score: -1,
    combo: -1,
    progress: -1,
    lastHitId: -1,
  });

  // Handle hit quality feedback via discrete event state
  useEffect(() => {
    if (!lastHit || !feedbackRef.current) return;
    if (lastHit.id === lastStateRef.current.lastHitId) return;

    const el = feedbackRef.current;
    const { quality } = lastHit;

    // Remove previous quality classes
    const previousQuality = el.getAttribute("data-quality") as HitQuality;
    if (previousQuality) el.classList.remove(styles[previousQuality]);

    // Set new quality
    el.textContent = `${quality.toUpperCase()}!`;
    el.classList.add(styles[quality]);
    el.setAttribute("data-quality", quality);
    el.style.opacity = "1";

    // Restart animation
    el.style.animation = "none";
    void el.offsetWidth; // Force reflow
    el.style.animation = "";

    lastStateRef.current.lastHitId = lastHit.id;

    // Auto-fade after 1 second
    const timeoutId = setTimeout(() => {
      if (feedbackRef.current) feedbackRef.current.style.opacity = "0";
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [lastHit]);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const score = getScore();
      const combo = getCombo();
      const progress = getProgress();
      const state = lastStateRef.current;

      // 1. Update Score (Normalized)
      if (score !== state.score && scoreValueRef.current) {
        scoreValueRef.current.textContent = score.toFixed(1);
        state.score = score;
      }

      // 2. Update Combo
      if (combo !== state.combo && comboValueRef.current) {
        comboValueRef.current.textContent = combo > 0 ? `x${combo}` : "";
        state.combo = combo;
      }

      // 3. Update Progress Bar
      if (progress !== state.progress) {
        if (progressBarFillRef.current) {
          progressBarFillRef.current.style.transform = `scaleX(${progress})`;
        }
        if (progressValueRef.current) {
          const percentage = Math.floor(progress * 100);
          if (Math.floor(state.progress * 100) !== percentage) {
            progressValueRef.current.textContent = `${percentage}%`;
          }
        }
        state.progress = progress;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [getScore, getCombo, getProgress]);

  return (
    <div className="flex w-full items-center gap-8">
      {/* Score & Combo */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-foreground retro text-[8px] font-normal tracking-widest uppercase opacity-60">
            Score
          </span>
          <span
            ref={scoreValueRef}
            className="retro text-base leading-relaxed font-normal tabular-nums"
          >
            0
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-foreground retro text-[8px] font-normal tracking-widest uppercase opacity-60">
            Combo
          </span>
          <span
            ref={comboValueRef}
            className="retro text-base leading-relaxed font-normal tabular-nums"
          >
            x0
          </span>
        </div>
      </div>

      {/* Hit Quality Feedback */}
      <div className="flex min-w-[120px] items-center justify-center">
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
      <div className="hidden max-w-[150px] flex-1 flex-col gap-2 sm:flex">
        <div className="flex items-end justify-between gap-1">
          <span className="text-foreground retro text-[8px] font-normal uppercase opacity-60">
            Progress
          </span>
          <span ref={progressValueRef} className="retro text-[8px] font-normal tabular-nums">
            0%
          </span>
        </div>
        <div className="bg-foreground/10 border-foreground h-3 w-full overflow-hidden border-4 [image-rendering:pixelated]">
          <div
            ref={progressBarFillRef}
            className="bg-primary h-full w-full origin-left [transform:scaleX(0)]"
          />
        </div>
      </div>
    </div>
  );
});
