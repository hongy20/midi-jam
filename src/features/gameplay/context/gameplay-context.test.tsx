import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GameplayProvider, useGameplay } from "./gameplay-context";

describe("GameplayProvider & useGameplay", () => {
  it("should throw an error if used outside of GameplayProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useGameplay())).toThrow(
      "useGameplay must be used within a GameplayProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should initialize with 'idle' state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameplayProvider>{children}</GameplayProvider>
    );

    const { result } = renderHook(() => useGameplay(), { wrapper });

    expect(result.current.gameState.status).toBe("idle");
  });

  it("should transition to 'playing' when startGame is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameplayProvider>{children}</GameplayProvider>
    );

    const { result } = renderHook(() => useGameplay(), { wrapper });

    act(() => {
      result.current.startGame();
    });

    expect(result.current.gameState.status).toBe("playing");
    if (result.current.gameState.status === "playing") {
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.combo).toBe(0);
      expect(result.current.gameState.currentProgress).toBe(0);
    }
  });

  it("should transition to 'paused' when pauseGame is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameplayProvider>{children}</GameplayProvider>
    );

    const { result } = renderHook(() => useGameplay(), { wrapper });

    const sessionData = { score: 100, combo: 10, currentProgress: 0.5 };

    act(() => {
      result.current.pauseGame(sessionData);
    });

    expect(result.current.gameState.status).toBe("paused");
    if (result.current.gameState.status === "paused") {
      expect(result.current.gameState).toMatchObject(sessionData);
    }
  });

  it("should transition to 'finished' when finishGame is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameplayProvider>{children}</GameplayProvider>
    );

    const { result } = renderHook(() => useGameplay(), { wrapper });

    const resultsData = { score: 1000, combo: 50 };

    act(() => {
      result.current.finishGame(resultsData);
    });

    expect(result.current.gameState.status).toBe("finished");
    if (result.current.gameState.status === "finished") {
      expect(result.current.gameState.results).toEqual(resultsData);
    }
  });

  it("should transition back to 'idle' when resetGame is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameplayProvider>{children}</GameplayProvider>
    );

    const { result } = renderHook(() => useGameplay(), { wrapper });

    act(() => {
      result.current.startGame();
      result.current.resetGame();
    });

    expect(result.current.gameState.status).toBe("idle");
  });
});
