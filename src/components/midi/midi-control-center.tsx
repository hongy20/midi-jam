"use client";

interface MidiFile {
  name: string;
  url: string;
}

interface MidiControlCenterProps {
  files: MidiFile[];
  selectedFile: MidiFile | null;
  onSelectFile: (file: MidiFile) => void;
}

/**
 * A selector for MIDI files.
 * Simplified to focus only on file selection.
 */
export function MidiControlCenter({
  files,
  selectedFile,
  onSelectFile,
}: MidiControlCenterProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Backing Track</h2>
      <div className="w-full space-y-2">
        <label
          htmlFor="midi-file-select"
          className="block text-sm font-bold text-gray-500 uppercase tracking-wider ml-1"
        >
          Music Library
        </label>
        <select
          id="midi-file-select"
          value={selectedFile?.url || ""}
          onChange={(e) => {
            const file = files.find((f) => f.url === e.target.value);
            if (file) onSelectFile(file);
          }}
          className="w-full px-4 py-3 bg-white border-4 border-gray-100 rounded-2xl text-gray-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Choose a song to learn...
          </option>
          {files.map((file) => (
            <option key={file.url} value={file.url}>
              {file.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}