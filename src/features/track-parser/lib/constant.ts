/**
 * MIDI Command Constants
 *
 * MIDI status bytes are composed of a command type (high 4 bits)
 * and a channel number (low 4 bits, 0-15).
 *
 * These constants represent the command types for Channel 1 (0).
 */

/** MIDI pitch used for silent dummy notes (e.g., duration extension) */
export const MIDI_DUMMY_NOTE_PITCH = 0;

/** Default lead-in time before notes hit the target line */
export const LEAD_IN_DEFAULT_MS = 2000;

/** Default lead-out time before the game auto-completes */
export const LEAD_OUT_DEFAULT_MS = 800;

/** Minimal gap between sequential notes of the same pitch to ensure triggering on MIDI devices (in milliseconds) */
export const MIN_NOTE_GAP_MS = 10;

/** Duration in ms of each windowed LaneSegment */
export const LANE_SEGMENT_DURATION_MS = 5 * 1000;

/** Threshold for considering two notes 'connected' in a cluster (in milliseconds) */
export const CLUSTER_CONNECTION_GAP_MS = 10;
