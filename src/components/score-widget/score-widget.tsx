"use client";

import { useEffect, useState } from "react";
import type { HitQuality } from "@/hooks/use-lane-score-engine";
import styles from "./score-widget.module.css";

interface ScoreWidgetProps {
  score: number;
  combo: number;
  lastHitQuality: HitQuality;
  getProgress: () => number;
  isPaused: boolean;
}

export function ScoreWidget({
  score,
  combo,
  lastHitQuality,
  getProgress,
  isPaused,
}: ScoreWidgetProps) {
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
          <span className={styles.progressValue}>{percentage}%</span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </div>
  );
}
