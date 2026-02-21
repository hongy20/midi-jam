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
  const totalDuration = 10000; // 10 seconds
  const maxScroll = totalDuration * LANE_PIXELS_PER_MS;

  it("calculates Y position correctly", () => {
    // At t=0, y = maxScroll + targetY
    expect(timeToY(0, targetY, maxScroll)).toBe(maxScroll + targetY);
    // At t=1000, y = maxScroll + targetY - 1000 * ratio
    expect(timeToY(1000, targetY, maxScroll)).toBe(
      maxScroll + targetY - 1000 * LANE_PIXELS_PER_MS,
    );
  });

  it("calculates note layout correctly", () => {
    const startTime = 1000;
    const endTime = 1500;
    const layout = getNoteLayout(startTime, endTime, targetY, maxScroll);

    // In falling mode, top is the end time (further up)
    expect(layout.top).toBe(timeToY(endTime, targetY, maxScroll));
    expect(layout.height).toBe(500 * LANE_PIXELS_PER_MS);
  });

  it("calculates total lane height correctly", () => {
    const height = getLaneHeight(totalDuration, viewportHeight);

    // scrollHeight = totalDuration * ratio + viewportHeight
    expect(height).toBe(10000 * LANE_PIXELS_PER_MS + viewportHeight);

    // Verify that at max scroll (t=0), note at t=0 is at targetY
    const y0 = timeToY(0, targetY, maxScroll);
    expect(y0 - maxScroll).toBe(targetY);

    // Verify that at min scroll (t=totalDuration), note at t=totalDuration is at targetY
    const yEnd = timeToY(totalDuration, targetY, maxScroll);
    expect(yEnd - 0).toBe(targetY);
  });
});
