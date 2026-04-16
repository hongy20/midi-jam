/**
 * Calculates the maximum possible score for a perfect run of a song.
 * This takes into account the combo multiplier:
 * +10% per 10 combo (capped at some reasonable level if the engine caps it,
 * but here it follows the engine's Math.floor(combo / 10) * 0.1 logic).
 */
export function calculateMaxPossibleScore(noteCount: number): number {
  let totalScore = 0;
  for (let combo = 0; combo < noteCount; combo++) {
    const points = 100;
    const multiplier = 1 + Math.floor(combo / 10) * 0.1;
    totalScore += points * multiplier;
  }
  return Math.floor(totalScore);
}
