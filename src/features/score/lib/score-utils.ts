/**
 * Calculates the maximum possible score for a perfect run of a song.
 * This follows the engine's multiplier logic: +10% per 10 combo
 * (calculated as 1 + Math.floor(combo / 10) * 0.1).
 */
export function calculateMaxRawPoints(noteCount: number): number {
  let totalScore = 0;
  for (let combo = 0; combo < noteCount; combo++) {
    const points = 100;
    const multiplier = 1 + Math.floor(combo / 10) * 0.1;
    totalScore += points * multiplier;
  }
  return Math.floor(totalScore);
}
