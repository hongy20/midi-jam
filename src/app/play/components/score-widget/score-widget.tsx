"use client";

import { memo, useEffect, useRef } from "react";
import type { HitQuality } from "@/features/score/hooks/use-lane-score-engine";
import styles from "./score-widget.module.css";

interface ScoreWidgetProps {
  getScore: () => number;
  getCombo: () => number;
  getLastHitQuality: () => HitQuality;
  getProgress: () => number;
}

export const ScoreWidget = memo(function ScoreWidget({
  getScore,
  getCombo,
  getLastHitQuality,
  getProgress,
}: ScoreWidgetProps) {
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
    <div className={styles.container}>
      {/* Score & Combo */}
      <div className={styles.stats}>
        <div className={styles.statGroup}>
          <span className={styles.label}>Score</span>
          <span ref={scoreValueRef} className={styles.value}>
            0
          </span>
        </div>

        <div className={styles.statGroup}>
          <span className={styles.label}>Combo</span>
          <span ref={comboValueRef} className={styles.value}>
            x0
          </span>
        </div>
      </div>

      {/* Hit Quality Feedback */}
      <div className={styles.feedback}>
        <span
          ref={feedbackRef}
          className={styles.hitText}
          style={{ opacity: 0 }}
        />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span ref={progressValueRef} className={styles.progressValue}>
            0%
          </span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            ref={progressBarFillRef}
            className={styles.progressBarFill}
            // Note: Transform is managed exclusively by the rAF loop via ref
          />
        </div>
      </div>
    </div>
  );
});
