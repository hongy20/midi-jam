/**
 * MIDI Command Constants
 *
 * MIDI status bytes are composed of a command type (high 4 bits)
 * and a channel number (low 4 bits, 0-15).
 *
 * These constants represent the command types for Channel 1 (0).
 */

/** Note Off command (0x80) */
export const MIDI_COMMAND_NOTE_OFF = 0x80;

/** Note On command (0x90) */
export const MIDI_COMMAND_NOTE_ON = 0x90;

/** Theoretical minimum MIDI note value */
export const MIDI_MIN_NOTE = 0;

/** Theoretical maximum MIDI note value */
export const MIDI_MAX_NOTE = 127;

/** MIDI pitch used for silent dummy notes (e.g., duration extension) */
export const MIDI_DUMMY_NOTE_PITCH = 0;

/** Standard 88-key piano minimum MIDI note (A0) */
export const PIANO_88_KEY_MIN = 21;

/** Standard 88-key piano maximum MIDI note (C8) */
export const PIANO_88_KEY_MAX = 108;

/** Middle C MIDI note */
export const MIDI_NOTE_C4 = 60;

/** Default lead-in time before notes hit the target line */
export const LEAD_IN_DEFAULT_MS = 2000;

/** Default lead-out time before the game auto-completes */
export const LEAD_OUT_DEFAULT_MS = 800;

/** Minimal gap between sequential notes of the same pitch to ensure triggering on MIDI devices (in milliseconds) */
export const MIN_NOTE_GAP_MS = 10;

/** Duration in ms of each windowed LaneSegment */
export const LANE_SEGMENT_DURATION_MS = 5 * 1000;

/** Time in ms for a note to scroll one full container height at speed 1.0 */
export const LANE_SCROLL_DURATION_MS = 3000;

/** Extra time in ms to keep segments in the DOM after they finish scrolling to ensure IO callbacks fire */
export const LANE_UNMOUNT_GRACE_PERIOD_MS = 1000;
