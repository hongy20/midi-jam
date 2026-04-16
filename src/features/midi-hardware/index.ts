export { GearProvider, useGear } from "./context/gear-context";
export {
  getMIDIInputDevices,
  getMIDIOutputDevices,
  onMIDIDevicesStateChange,
} from "./lib/midi-devices";
export type { MIDINoteEvent } from "./lib/midi-listener";
export { subscribeToNotes } from "./lib/midi-listener";
