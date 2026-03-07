"use client";

import { Play } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./track-card.module.css";

export interface CollectionTrack {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}

interface TrackCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  track: CollectionTrack;
  isSelected: boolean;
}

export function TrackCard({
  track,
  isSelected,
  className = "",
  ...props
}: TrackCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${isSelected ? styles.selected : styles.unselected} ${className}`}
      {...props}
    >
      <div className={styles.header}>
        <div
          className={`${styles.iconWrapper} ${
            isSelected ? styles.iconSelected : styles.iconUnselected
          }`}
        >
          <Play className={styles.icon} />
        </div>
        <div className={styles.info}>
          <span
            className={`${styles.name} ${
              isSelected ? styles.textInverted : styles.textPrimary
            }`}
          >
            {track.name}
          </span>
          <span
            className={`${styles.artist} ${
              isSelected ? styles.textInvertedSecondary : styles.textSecondary
            }`}
          >
            {track.artist}
          </span>
        </div>
      </div>

      <span
        className={`${styles.difficulty} ${
          isSelected ? styles.difficultySelected : styles.difficultyUnselected
        }`}
      >
        {track.difficulty}
      </span>
    </button>
  );
}
