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
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        Select Your Instrument
      </h2>
      {devices.length === 0 ? (
        <p className="p-4 bg-gray-100 rounded-2xl text-gray-600">
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
                  className={`w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 transform active:scale-[0.98] group ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/50 shadow-md translate-y-[-2px]"
                      : "border-gray-200 hover:border-blue-200 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-bold text-lg leading-tight truncate ${isSelected ? "text-blue-700" : "text-slate-900"}`}
                      >
                        {device.name || "Unknown Device"}
                      </div>
                      <div
                        className={`text-sm font-semibold mt-1 truncate ${isSelected ? "text-blue-600/70" : "text-slate-500"}`}
                      >
                        {device.manufacturer || "Generic MIDI"}
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${isSelected ? "bg-blue-500 animate-pulse" : "bg-slate-200 group-hover:bg-blue-300"}`}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
