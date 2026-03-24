import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StageProvider, useStage } from "./stage-context";

describe("StageProvider & useStage", () => {
  it("should throw an error if used outside of StageProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useStage())).toThrow(
      "useStage must be used within a StageProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should provide gameSession with null default", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StageProvider>{children}</StageProvider>
    );

    const { result } = renderHook(() => useStage(), { wrapper });

    expect(result.current.gameSession).toBe(null);
  });

  it("should allow updating gameSession", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StageProvider>{children}</StageProvider>
    );

    const { result } = renderHook(() => useStage(), { wrapper });

    const mockSession = {
      score: 100,
      combo: 5,
      currentTimeMs: 5000,
    };

    act(() => {
      result.current.setGameSession(mockSession);
    });

    expect(result.current.gameSession).toEqual(mockSession);
  });
});
