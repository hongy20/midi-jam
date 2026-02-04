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

/** Control Change command (0xB0) */
export const MIDI_COMMAND_CONTROL_CHANGE = 0xb0;

/** All Notes Off controller number */
export const MIDI_CONTROLLER_ALL_NOTES_OFF = 123;
