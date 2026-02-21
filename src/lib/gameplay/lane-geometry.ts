export const LANE_PIXELS_PER_MS = 0.4; // 400px per second for better visibility

/**
 * Calculates the Y position of a timestamp within the inner lane for a falling visualizer.
 * In this model, the lane is traversed from bottom to top (scrollTop max -> 0).
 *
 * @param timeMs The timestamp in milliseconds.
 * @param targetY The Y position of the target line within the viewport.
 * @param maxScroll The maximum scrollable distance (totalDurationMs * ratio).
 * @returns The absolute Y coordinate in the lane.
 */
export function timeToY(
  timeMs: number,
  targetY: number,
  maxScroll: number,
): number {
  // At t=0, absolute Y should be maxScroll + targetY.
  // As t increases, absolute Y decreases.
  return maxScroll + targetY - timeMs * LANE_PIXELS_PER_MS;
}

/**
 * Calculates the top and height of a note block for a falling visualizer.
 *
 * @param startTimeMs The start time of the note in milliseconds.
 * @param endTimeMs The end time of the note in milliseconds.
 * @param targetY The Y position of the target line within the viewport.
 * @param maxScroll The maximum scrollable distance.
 * @returns An object with top and height in pixels.
 */
export function getNoteLayout(
  startTimeMs: number,
  endTimeMs: number,
  targetY: number,
  maxScroll: number,
): { top: number; height: number } {
  const yStart = timeToY(startTimeMs, targetY, maxScroll);
  const yEnd = timeToY(endTimeMs, targetY, maxScroll);

  // In a falling lane, the "start" of the note (earlier time) is at a HIGHER Y (further down).
  // The "end" of the note (later time) is at a LOWER Y (further up).
  // So yStart > yEnd.
  return {
    top: yEnd,
    height: Math.max(1, yStart - yEnd),
  };
}

/**
 * Calculates the total height of the inner lane.
 *
 * @param totalDurationMs The total duration of the track in milliseconds.
 * @param viewportHeight The height of the viewport.
 * @returns The total height of the inner lane in pixels.
 */
export function getLaneHeight(
  totalDurationMs: number,
  viewportHeight: number,
): number {
  // Lane height = song length in pixels + viewport height
  // This allows the scroll to start at maxScroll and end at 0.
  return totalDurationMs * LANE_PIXELS_PER_MS + viewportHeight;
}
