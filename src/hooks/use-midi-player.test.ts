import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMidiPlayer } from './use-midi-player';

describe('useMidiPlayer', () => {
  let mockNow = 10000;
  let rafCallback: ((time: number) => void) | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    mockNow = 10000;
    rafCallback = null;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
      rafCallback = null;
    });
    vi.spyOn(performance, 'now').mockImplementation(() => mockNow);

    (window as any).triggerRaf = (time: number) => {
      mockNow = time;
      if (rafCallback) {
        const cb = rafCallback;
        rafCallback = null;
        cb(time);
      }
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).triggerRaf;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMidiPlayer([]));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.speed).toBe(1);
    expect(result.current.activeNotes).toBeInstanceOf(Set);
    expect(result.current.activeNotes.size).toBe(0);
  });

  it('should start playback', () => {
    const { result } = renderHook(() => useMidiPlayer([]));

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should pause playback', () => {
    const { result } = renderHook(() => useMidiPlayer([]));

    act(() => {
      result.current.play();
    });
    act(() => {
      result.current.pause();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should stop and reset playback', () => {
    const { result } = renderHook(() => useMidiPlayer([]));

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.activeNotes.size).toBe(0);
  });

  it('should adjust speed', () => {
    const { result } = renderHook(() => useMidiPlayer([]));

    act(() => {
      result.current.setSpeed(2);
    });

    expect(result.current.speed).toBe(2);
  });

  it('should trigger notes based on timeline', () => {
    const events = [
      { time: 1.0, type: 'noteOn' as const, note: 60, velocity: 0.8 },
      { time: 2.0, type: 'noteOff' as const, note: 60, velocity: 0 },
    ];

    const { result } = renderHook(() => useMidiPlayer(events));

    // Start
    act(() => {
      result.current.play();
    });

    // First frame (t=0)
    act(() => {
      (window as any).triggerRaf(10000); 
    });
    expect(result.current.currentTime).toBe(0);
    expect(result.current.activeNotes.has(60)).toBe(false);

    // Second frame (t=1.1s)
    act(() => {
      (window as any).triggerRaf(11100); 
    });
    expect(result.current.currentTime).toBeCloseTo(1.1);
    expect(result.current.activeNotes.has(60)).toBe(true);

    // Third frame (t=2.1s)
    act(() => {
      (window as any).triggerRaf(12100); 
    });
    expect(result.current.currentTime).toBeCloseTo(2.1);
    expect(result.current.activeNotes.has(60)).toBe(false);
  });
});
