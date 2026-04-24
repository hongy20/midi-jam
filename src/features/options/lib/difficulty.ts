export const SPEED_EASY = 0.5;
export const SPEED_NORMAL = 1.0;
export const SPEED_HARD = 2.0;

export type Difficulty = "easy" | "normal" | "hard";

const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  easy: SPEED_EASY,
  normal: SPEED_NORMAL,
  hard: SPEED_HARD,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: `EASY (${SPEED_EASY}x)`,
  normal: `NORMAL (${SPEED_NORMAL}x)`,
  hard: `HARD (${SPEED_HARD}x)`,
};

/**
 * Maps a speed value to the nearest difficulty level.
 */
export function speedToDifficulty(speed: number): Difficulty {
  if (speed <= SPEED_EASY) return "easy";
  if (speed >= SPEED_HARD) return "hard";
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
