export { GearProvider, useGear } from "./context/gear-context";
export type { GearContextType } from "./context/gear-context";
export { requestMIDIAccess } from "./lib/midi-access";
export { 
  getMIDIInputDevices, 
  getMIDIOutputDevices, 
  onMIDIDevicesStateChange 
} from "./lib/midi-devices";
export { subscribeToNotes } from "./lib/midi-listener";
export type { MIDINoteEvent } from "./lib/midi-listener";
