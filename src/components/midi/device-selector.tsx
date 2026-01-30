"use client";

interface DeviceSelectorProps {
  devices: WebMidi.MIDIInput[];
  isLoading: boolean;
  error?: string | null;
  selectedDevice: WebMidi.MIDIInput | null;
  onSelect: (device: WebMidi.MIDIInput | null) => void;
}

/**
 * A component that displays a list of available MIDI devices and allows selection.
 */
export function DeviceSelector({
  devices,
  isLoading,
  error,
  selectedDevice,
  onSelect,
}: DeviceSelectorProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center animate-pulse">
        <p className="text-lg font-medium">Searching for MIDI devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-2 border-red-500 rounded-xl bg-red-50 text-red-700">
        <p className="font-bold">Error: {error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Select Your Instrument</h2>
      {devices.length === 0 ? (
        <p className="p-4 bg-gray-100 rounded-xl text-gray-600">
          No MIDI devices found. Please connect your instrument and try again.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {devices.map((device) => {
            const isSelected = selectedDevice?.id === device.id;
            return (
              <li key={device.id}>
                <button
                  type="button"
                  onClick={() => onSelect(isSelected ? null : device)}
                  aria-pressed={isSelected}
                  className={`w-full p-4 text-left rounded-xl border-4 transition-all duration-200 transform active:scale-95 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-lg translate-y-[-2px]"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-bold text-lg">
                    {device.name || "Unknown Device"}
                  </div>
                  {device.manufacturer && (
                    <div className="text-sm opacity-60">
                      {device.manufacturer}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
