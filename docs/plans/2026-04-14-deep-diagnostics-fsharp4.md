# Plan: Deep Diagnostics for Persistent Stuck Note

## Goal Description
The previous fixes failed to resolve the F#4 stuck note at ~13%. This plan re-inserts detailed logging across the entire audio pipeline (IO, Mutations, Component Callbacks, Synth) to identify exactly where the release signal is lost.

## Proposed Changes

### [MODIFY] [use-demo-playback.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-demo-playback.ts)
- Log all `observe()` calls with `noteId`.
- Log all `IntersectionObserver` entries (isIntersecting, pitch, noteId, isConnected, rectTop).
- Log `MutationObserver` removals and the cleanup of active notes.
- Log `noteOn` and `noteOff` signals leaving the hook.

### [MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)
- Log `onNoteOn` and `onNoteOff` proxy calls.

### [MODIFY] [use-midi-audio.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-midi-audio.ts)
- Log `triggerAttack` and `triggerRelease` timing and pitch.

## Verification Plan
1. Re-run the Golden track in Demo Mode.
2. Analyze console output around 13% progress (31.8s + 2s lead-in).
