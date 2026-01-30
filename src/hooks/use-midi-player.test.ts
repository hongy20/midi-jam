import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 1. Mock the heavy dependency BEFORE anything else is imported
vi.mock('../lib/midi/midi-player', () => ({
  loadMidiFile: vi.fn(),
  getMidiEvents: vi.fn(),
}));

// 2. Now safe to import the hook
import { useMidiPlayer } from './use-midi-player';

describe('useMidiPlayer', () => {
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
      rafCallback = null;
    });
    vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rafCallback = null;
  });

  const triggerFrame = (time: number) => {
    if (rafCallback) {
      const cb = rafCallback;
      rafCallback = null;
      vi.spyOn(performance, 'now').mockReturnValue(time);
      act(() => { cb(time); });
    }
  };

  it('should handle playback lifecycle', () => {
    const { result } = renderHook(() => useMidiPlayer([]));
    
    act(() => { result.current.play(); });
    expect(result.current.isPlaying).toBe(true);

    act(() => { result.current.pause(); });
    expect(result.current.isPlaying).toBe(false);

    act(() => { result.current.stop(); });
    expect(result.current.currentTime).toBe(0);
  });

  it('should trigger notes at correct times', () => {
    const onNoteOn = vi.fn();
    const events = [{ time: 1.0, type: 'noteOn' as const, note: 60, velocity: 0.8 }];
    
    const { result } = renderHook(() => useMidiPlayer(events, { onNoteOn }));

    act(() => { result.current.play(); });

    // Move to 0.5s -> no note yet
    triggerFrame(500);
    expect(onNoteOn).not.toHaveBeenCalled();

    // Move to 1.1s -> note triggered
    triggerFrame(1100);
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.8);
    expect(result.current.activeNotes.has(60)).toBe(true);
  });
});
