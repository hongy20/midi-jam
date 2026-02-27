import { useEffect, useState } from "react";
import { useSelection } from "@/context/selection-context";
import { loadMidiFile } from "@/lib/midi/midi-loader";
import {
  getMidiEvents,
  getNoteSpans,
  type MidiEvent,
  type NoteSpan,
} from "@/lib/midi/midi-parser";

interface UseMidiTrackResult {
  events: MidiEvent[];
  spans: NoteSpan[];
  duration: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to load and parse the currently selected MIDI track.
 */
export function useMidiTrack(): UseMidiTrackResult {
  const { selectedTrack } = useSelection();
  const url = selectedTrack?.url || null;

  const [events, setEvents] = useState<MidiEvent[]>([]);
  const [spans, setSpans] = useState<NoteSpan[]>([]);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setEvents([]);
      setSpans([]);
      setDuration(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setError(null);

    loadMidiFile(url)
      .then((midi) => {
        if (!mounted) return;
        const midiEvents = getMidiEvents(midi);
        const noteSpans = getNoteSpans(midiEvents);

        setEvents(midiEvents);
        setSpans(noteSpans);
        setDuration(midi.duration * 1000); // Convert to ms
        setIsLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  return { events, spans, duration, isLoading, error };
}
