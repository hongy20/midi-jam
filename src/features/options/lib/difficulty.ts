export type Difficulty = "easy" | "normal" | "hard";

export const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  easy: 0.5,
  normal: 1.0,
  hard: 2.0,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "EASY (0.5x)",
  normal: "NORMAL (1.0x)",
  hard: "HARD (2.0x)",
};

/**
 * Maps a speed value to the nearest difficulty level.
 */
export function speedToDifficulty(speed: number): Difficulty {
  if (speed <= 0.5) return "easy";
  if (speed >= 2.0) return "hard";
  return "normal";
}

/**
 * Maps a difficulty level to its corresponding speed.
 */
export function difficultyToSpeed(difficulty: Difficulty): number {
  return DIFFICULTY_SPEEDS[difficulty];
}

/**
 * Returns a human-readable label for a difficulty level.
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}
