"use client";

interface MidiFile {
  name: string;
  url: string;
}

interface SoundTrackSelectorProps {
  files: MidiFile[];
  selectedFile: MidiFile | null;
  onSelectFile: (file: MidiFile) => void;
}

/**
 * A selector for MIDI files.
 * Simplified to focus only on file selection.
 */
export function SoundTrackSelector({
  files,
  selectedFile,
  onSelectFile,
}: SoundTrackSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        Select Backing Track
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {files.map((file) => {
          const isSelected = selectedFile?.url === file.url;
          return (
            <li key={file.url}>
              <button
                type="button"
                onClick={() => onSelectFile(file)}
                aria-pressed={isSelected}
                className={`w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 transform active:scale-[0.98] group ${
                  isSelected
                    ? "border-purple-500 bg-purple-50/50 shadow-md -translate-y-0.5"
                    : "border-gray-100 hover:border-purple-200 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div
                      className={`font-bold text-lg leading-tight truncate ${isSelected ? "text-purple-700" : "text-slate-900"}`}
                    >
                      {file.name}
                    </div>
                    <div
                      className={`text-sm font-semibold mt-1 ${isSelected ? "text-purple-600/70" : "text-slate-500"}`}
                    >
                      MIDI File
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${isSelected ? "bg-purple-500 animate-pulse" : "bg-slate-200 group-hover:bg-purple-300"}`}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
