# Feature Modules Refactor

Six targeted refactors across `audio-player`, `collection`, `settings`, `theme`, `score`, and `midi-hardware`. Each is self-contained and executed sequentially.

## 1. `features/audio-player` — Extract observer into `lib/note-observer.ts`

Extract the dual-observer logic (`IntersectionObserver` + `MutationObserver`) from the hook into a pure factory function in `lib/`. The hook becomes a thin wiring layer.

- **NEW** `features/audio-player/lib/note-observer.ts`: exports `createNoteObserver(container, onNoteOn, onNoteOff): { disconnect }`. Owns all observer state.
- **MODIFY** `features/audio-player/hooks/use-track-player.ts`: remove ~120 lines of observer logic; call `createNoteObserver` and wire cleanup.

## 2. `features/collection` — `getSoundTracks` → `getSongTracks`

- Rename `sound-track.ts` → `song-track.ts` and `sound-track.test.ts` → `song-track.test.ts`.
- Rename function `getSoundTracks` → `getSongTracks`.
- Update `index.ts` barrel.

## 3. `features/settings` → `features/options`

- Rename folder `settings/` → `options/`.
- Add `lib/difficulty.ts`: `speedToDifficulty`, `difficultyToSpeed`, `getDifficultyLabel`, `DIFFICULTY_SPEEDS`.
- Export from `index.ts`.
- Update 4 call sites: `app/layout.tsx`, `play-page.client.tsx`, `options-page.client.tsx` (remove inline mapping), `options-page.view.tsx` (use `getDifficultyLabel`), `options-page.view.stories.tsx`.

## 4. `shared/types/mode.ts` → `shared/lib/mode.ts`

- Delete `shared/types/mode.ts`.
- Create `shared/lib/mode.ts` with `Mode` type + `DARK` and `LIGHT` constants.
- In `theme-context.tsx`: update import, replace `"dark"` literals, extract localStorage key consts, remove 'D' key `useEffect`.
- Update 3 other import sites.

## 5. `features/score` — Partial Tailwind migration for `live-score`

- Replace structural CSS module classes with Tailwind in `live-score.tsx`.
- Retain `.perfect`, `.good`, `.miss`, `.hitText`, and `@keyframes bounce` in the module file.

## 6. `features/midi-hardware` — No change

Per-hook listeners kept as-is (Option B).
