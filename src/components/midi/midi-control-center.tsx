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
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {files.map((file) => {
          const isSelected = selectedFile?.url === file.url;
          return (
            <li key={file.url}>
              <button
                type="button"
                onClick={() => onSelectFile(file)}
                aria-pressed={isSelected}
                className={`w-full p-4 text-left rounded-2xl border-4 transition-all duration-200 transform active:scale-95 ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-lg translate-y-[-2px]"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="font-bold text-lg leading-tight">
                  {file.name}
                </div>
                <div className="text-sm opacity-60 mt-1">
                  MIDI File
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
