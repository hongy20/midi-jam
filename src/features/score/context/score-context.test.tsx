import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ScoreProvider, useScore } from "./score-context";

describe("ScoreProvider & useScore", () => {
  it("should throw an error if used outside of ScoreProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useScore())).toThrow(
      "useScore must be used within a ScoreProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should provide sessionResults with null default", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ScoreProvider>{children}</ScoreProvider>
    );

    const { result } = renderHook(() => useScore(), { wrapper });

    expect(result.current.sessionResults).toBe(null);
  });

  it("should allow updating sessionResults", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ScoreProvider>{children}</ScoreProvider>
    );

    const { result } = renderHook(() => useScore(), { wrapper });

    const mockResults = {
      score: 1500,
      accuracy: 95,
      combo: 42,
    };

    act(() => {
      result.current.setSessionResults(mockResults);
    });

    expect(result.current.sessionResults).toEqual(mockResults);
  });
});
