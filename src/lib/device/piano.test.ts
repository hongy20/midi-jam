import { describe, it, expect } from 'vitest';
import { getVisibleMidiRange } from './piano';
import { PIANO_88_KEY_MIN, PIANO_88_KEY_MAX } from '../midi/constant';

describe('getVisibleMidiRange', () => {
  it('should return default 88-key range for empty notes', () => {
    const range = getVisibleMidiRange([]);
    expect(range).toEqual({ startNote: PIANO_88_KEY_MIN, endNote: PIANO_88_KEY_MAX });
  });

  it('should add 2 white keys buffer to song notes and clamp to 88-key range', () => {
    // Song uses C4 (60)
    // -1 white key: B3 (59)
    // -2 white keys: A3 (57)
    // +1 white key: D4 (62)
    // +2 white keys: E4 (64)
    const range = getVisibleMidiRange([60]); 
    expect(range).toEqual({ startNote: 57, endNote: 64 });
  });

  it('should clamp to PIANO_88_KEY_MIN and PIANO_88_KEY_MAX', () => {
    const range = getVisibleMidiRange([21, 108]); 
    expect(range).toEqual({ startNote: 21, endNote: 108 });
  });
});
