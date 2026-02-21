import { describe, expect, it } from "vitest";
import {
  getLaneHeight,
  getNoteLayout,
  LANE_PIXELS_PER_MS,
  timeToY,
} from "./lane-geometry";

describe("Lane Geometry Utilities", () => {
  const targetY = 500; // Target line at 500px from top of viewport
  const viewportHeight = 600;

  it("calculates Y position correctly", () => {
    expect(timeToY(0, targetY)).toBe(targetY);
    expect(timeToY(1000, targetY)).toBe(targetY + 1000 * LANE_PIXELS_PER_MS);
  });

  it("calculates note layout correctly", () => {
    const startTime = 1000;
    const endTime = 1500;
    const layout = getNoteLayout(startTime, endTime, targetY);

    expect(layout.top).toBe(timeToY(startTime, targetY));
    expect(layout.height).toBe(500 * LANE_PIXELS_PER_MS);
  });

  it("calculates total lane height correctly", () => {
    const totalDuration = 10000; // 10 seconds
    const height = getLaneHeight(totalDuration, targetY, viewportHeight);

    // scrollHeight = totalDuration * ratio + viewportHeight
    expect(height).toBe(10000 * LANE_PIXELS_PER_MS + viewportHeight);

    // Verify that max scroll puts the end of the song at the target line
    const maxScroll = height - viewportHeight;
    const endY = timeToY(totalDuration, targetY);
    expect(endY - maxScroll).toBe(targetY);
  });
});
