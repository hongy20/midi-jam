# Refactor: Unify MIDI Time Units to Milliseconds (ms)

## Background
Currently, the MIDI parsing layer (`getMidiEvents`, `getNoteSpans`) returns times in **seconds**, as provided by Tone.js. However, the majority of the UI rendering, scoring logic, and timeline management in the app uses **milliseconds**. This leads to fragmented `* 1000` and `/ 1000` conversion logic scattered throughout the codebase.

## Objective
Unify all time-related properties in `MidiEvent` and `NoteSpan` to use `ms` as the base unit, immediately at the parsing boundary.

## Proposed Changes

### 1. Data Structure Updates (`src/lib/midi/midi-parser.ts`)
- Rename and update types:
    - `MidiEvent.time` ➡️ `MidiEvent.timeMs`
    - `NoteSpan.startTime` ➡️ `NoteSpan.startTimeMs`
    - `NoteSpan.duration` ➡️ `NoteSpan.durationMs`

### 2. Parser Logic Refactor (`src/lib/midi/midi-parser.ts`)
- **`getMidiEvents`**: Multiply incoming Tone.js second-based times by 1000.
- **`getNoteSpans`**: Use the new `timeMs` properties.
- **`getBarLines`**: Convert resulting bar line timings to milliseconds.
- Update `getNoteRange` if necessary.

### 3. Cleanup of Downstream Consumption
- **Visuals**:
    - `src/components/lane-stage/lane-stage.tsx`: Remove `* 1000` logic.
    - `src/components/lane-stage/lane-segment.tsx`: Remove `* 1000` logic.
    - `src/lib/midi/lane-segment-utils.ts`: Update math to use direct `ms` values.
- **Scoring**:
    - `src/lib/score/score-engine.ts`: Update to use `ms` naming and avoid redundant conversions.
    - `src/hooks/use-lane-score-engine.ts`: Update usages.
- **Audio (The "Seconds" Boundary)**:
    - `src/hooks/use-midi-audio.ts` (and related audio hooks): Convert `ms` back to `seconds` only at the point of calling Tone.js synth methods.

### 4. Test Updates
- Update all mocked MIDI data in unit tests (`src/lib/midi/midi-parser.test.ts`, `src/lib/midi/lane-segment-utils.test.ts`, etc.) to use the new naming and values.

## Verification Plan
1. **Static Analysis**: `npm run type-check` will be the primary driver for identifying all affected call sites.
2. **Linting**: `npm run lint` to ensure naming consistency.
3. **Unit Tests**: `npm test` to verify logic integrity.
4. **Build**: `npm run build` to ensure no production issues.
5. **Manual Verification**: Run `npm run dev` and play a track to confirm fall-timing and scoring still work perfectly.
