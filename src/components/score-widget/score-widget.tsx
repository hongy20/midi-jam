"use client";

import { useEffect, useRef } from "react";
import type { HitQuality } from "@/hooks/use-lane-score-engine";
import styles from "./score-widget.module.css";

interface ScoreWidgetProps {
  score: number;
  combo: number;
  lastHitQuality: HitQuality;
  getProgress: () => number;
}

export function ScoreWidget({
  score,
  combo,
  lastHitQuality,
  getProgress,
}: ScoreWidgetProps) {
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const progressValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const progress = getProgress();

      if (progressBarFillRef.current) {
        progressBarFillRef.current.style.transform = `scaleX(${progress})`;
      }

      if (progressValueRef.current) {
        progressValueRef.current.textContent = `${Math.floor(progress * 100)}%`;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, [getProgress]);

  return (
    <div className={styles.container}>
      {/* Score & Combo */}
      <div className={styles.stats}>
        <div className={styles.statGroup}>
          <span className={styles.label}>Score</span>
          <span className={styles.value}>{score.toLocaleString()}</span>
        </div>

        <div className={styles.statGroup}>
          <span className={styles.label}>Combo</span>
          <span className={styles.value}>x{combo}</span>
        </div>
      </div>

      {/* Hit Quality Feedback */}
      <div className={styles.feedback}>
        {lastHitQuality && (
          <span className={`${styles.hitText} ${styles[lastHitQuality]}`}>
            {lastHitQuality}!
          </span>
        )}
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
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
