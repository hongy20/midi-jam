export const LANE_PIXELS_PER_MS = 0.2; // 200px per second

/**
 * Calculates the Y position of a timestamp within the inner lane.
 *
 * @param timeMs The timestamp in milliseconds.
 * @param targetY The Y position of the target line within the viewport.
 * @returns The Y coordinate in pixels.
 */
export function timeToY(timeMs: number, targetY: number): number {
  return targetY + timeMs * LANE_PIXELS_PER_MS;
}

/**
 * Calculates the top and height of a note block.
 *
 * @param startTimeMs The start time of the note in milliseconds.
 * @param endTimeMs The end time of the note in milliseconds.
 * @param targetY The Y position of the target line within the viewport.
 * @returns An object with top and height in pixels.
 */
export function getNoteLayout(
  startTimeMs: number,
  endTimeMs: number,
  targetY: number,
): { top: number; height: number } {
  const yStart = timeToY(startTimeMs, targetY);
  const yEnd = timeToY(endTimeMs, targetY);

  // In a falling lane, notes are rendered "upwards" from their start time.
  // Wait, if y increases with time, then yEnd > yStart.
  // The note starts at yStart and ends at yEnd.
  // Since we want the note to "fall" into the target,
  // the note block's visual "bottom" should be at yStart?
  // No, if we are scrolling DOWN, the note at yStart appears FIRST.

  return {
    top: yStart,
    height: Math.max(1, yEnd - yStart),
  };
}

/**
 * Calculates the total height of the inner lane.
 *
 * @param totalDurationMs The total duration of the track in milliseconds.
 * @param targetY The Y position of the target line within the viewport.
 * @param viewportHeight The height of the viewport (grid cell).
 * @returns The total height of the inner lane in pixels.
 */
export function getLaneHeight(
  totalDurationMs: number,
  _targetY: number,
  viewportHeight: number,
): number {
  // The lane needs to be tall enough for the last note (at totalDurationMs)
  // to reach the target line, plus some padding at the bottom so the last note
  // can scroll off if desired, but strictly speaking, the animation stops at
  // scrollTop = scrollHeight - viewportHeight.

  // If at scrollTop = max, we want time = totalDurationMs to be at targetY:
  // targetY = y(totalDurationMs) - maxScroll
  // maxScroll = y(totalDurationMs) - targetY
  // scrollHeight - viewportHeight = (targetY + totalDurationMs * ratio) - targetY
  // scrollHeight = totalDurationMs * ratio + viewportHeight

  return totalDurationMs * LANE_PIXELS_PER_MS + viewportHeight;
}
