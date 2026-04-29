# Storybook Stories Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create missing Storybook stories for 7 components and fix the non-functional `highway.stories.tsx`.

**Architecture:** Each story file lives next to its component, uses Storybook CSF3 format (`Meta` + `StoryObj`), follows the `App/` or `Features/` title hierarchy, and covers the main visual states (default, selected/active, edge cases). No `autodocs` tags — project has the Docs addon disabled.

**Tech Stack:** `@storybook/react`, TypeScript, Tailwind CSS v4, 8bitcn UI, `lucide-react`.

---

## Context: Naming Conventions & Patterns

- **Title hierarchy:** `App/[Name]` for app-layer pages; `Features/[Feature]/[ComponentName]` for feature components.
- **Layout param:** Use `layout: "fullscreen"` for stage/page components, `layout: "centered"` for small standalone cards.
- **Decorators:** Wrap layout-sensitive components (stages, lanes) in a sized container div so they render correctly out of page context.
- **No `autodocs`:** The Docs addon is disabled — remove this tag from `highway.stories.tsx`.
- **`console.log` for callbacks:** Use `() => console.log(...)` for all action handler args.

---

## Task 1: Fix `highway.stories.tsx`

The file has `tags: ["autodocs"]` which will cause an error because the Docs addon is disabled. Remove the tag.

**File:**
- Modify: `src/features/highway/components/highway.stories.tsx`

**Step 1: Remove `tags: ["autodocs"]` from the meta object**

```tsx
// Before
const meta: Meta<typeof Highway> = {
  title: "Features/Highway",
  component: Highway,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],    // ← DELETE THIS LINE
  decorators: [...]
};

// After
const meta: Meta<typeof Highway> = {
  title: "Features/Highway",
  component: Highway,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...]
};
```

**Step 2: Commit**

```bash
git add src/features/highway/components/highway.stories.tsx
git commit -m "fix(storybook): remove autodocs tag from highway stories"
```

---

## Task 2: `background-lane.stories.tsx`

**Component:** `src/features/piano/components/background-lane/background-lane.tsx`
- Zero props — renders 88 piano key lanes.
- Depends on `piano-layout.css` (imported inside the component itself).
- Needs `--start-unit` / `--end-unit` CSS custom properties on a parent container to define the visible range.

**File:**
- Create: `src/features/piano/components/background-lane/background-lane.stories.tsx`

**Step 1: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { BackgroundLane } from "./background-lane";

const meta: Meta<typeof BackgroundLane> = {
  title: "Features/Piano/BackgroundLane",
  component: BackgroundLane,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={
          {
            width: "100%",
            height: "400px",
            background: "var(--background)",
            position: "relative",
            "--start-unit": "36",
            "--end-unit": "192",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BackgroundLane>;

/** Full 88-key range with the default octave viewport. */
export const Default: Story = {};

/** Narrowed viewport showing only the middle octave (C4–B4, units 108–129). */
export const NarrowViewport: Story = {
  decorators: [
    (Story) => (
      <div
        style={
          {
            width: "100%",
            height: "400px",
            background: "var(--background)",
            position: "relative",
            "--start-unit": "108",
            "--end-unit": "129",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
```

**Step 2: Commit**

```bash
git add src/features/piano/components/background-lane/background-lane.stories.tsx
git commit -m "feat(storybook): add BackgroundLane stories"
```

---

## Task 3: `drum-stage.stories.tsx`

**Component:** `src/features/drum/components/drum-stage.tsx`
- Props: `StageProps` → `{ notes, liveActiveNotes, playbackNotes, highway }`.
- `highway` is a `React.ReactElement`.
- `DrumStage` uses CSS `row-start-2`, so it needs a grid parent.

**File:**
- Create: `src/features/drum/components/drum-stage.stories.tsx`

**Step 1: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { DrumStage } from "./drum-stage";

const meta: Meta<typeof DrumStage> = {
  title: "Features/Drum/DrumStage",
  component: DrumStage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          background: "var(--background)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div />
        <Story />
      </div>
    ),
  ],
  args: {
    notes: [],
    liveActiveNotes: new Set(),
    playbackNotes: new Set(),
  },
};

export default meta;
type Story = StoryObj<typeof DrumStage>;

/** Placeholder state — no highway element mounted. */
export const NoHighway: Story = {
  args: {
    highway: undefined as unknown as React.ReactElement,
  },
};

/** With a highway slot passed in (simulated with a colored div). */
export const WithHighway: Story = {
  args: {
    highway: (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted-foreground)",
        }}
      >
        Highway Slot
      </div>
    ),
  },
};
```

**Step 2: Commit**

```bash
git add src/features/drum/components/drum-stage.stories.tsx
git commit -m "feat(storybook): add DrumStage stories"
```

---

## Task 4: `piano-stage.stories.tsx`

**Component:** `src/features/piano/components/piano-stage/piano-stage.tsx`
- Props: `StageProps` → `{ notes, liveActiveNotes, playbackNotes, highway }`.
- `PianoStage` calls `React.cloneElement(highway, ...)`, so `highway` **must** be a real element.
- Pass a minimal `<div>` as the `highway` prop.
- `notes` drives `getPianoLayoutUnits` to compute `--start-unit` / `--end-unit`.

**File:**
- Create: `src/features/piano/components/piano-stage/piano-stage.stories.tsx`

**Step 1: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { PianoStage } from "./piano-stage";

const mockNotes = Array.from({ length: 25 }, (_, i) => ({
  id: String(i),
  pitch: 48 + i,
  startTimeMs: i * 500,
  durationMs: 400,
  velocity: 0.8,
}));

const meta: Meta<typeof PianoStage> = {
  title: "Features/Piano/PianoStage",
  component: PianoStage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          background: "var(--background)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div />
        <Story />
      </div>
    ),
  ],
  args: {
    notes: mockNotes,
    liveActiveNotes: new Set(),
    playbackNotes: new Set(),
    highway: <div style={{ width: "100%", height: "100%" }} />,
  },
};

export default meta;
type Story = StoryObj<typeof PianoStage>;

/** Default state — no active notes. */
export const Default: Story = {};

/** With live MIDI input notes (C major chord). */
export const WithLiveNotes: Story = {
  args: {
    liveActiveNotes: new Set([60, 64, 67]),
  },
};

/** With playback notes active. */
export const WithPlayback: Story = {
  args: {
    playbackNotes: new Set([60, 64, 67, 72]),
  },
};
```

**Step 2: Commit**

```bash
git add src/features/piano/components/piano-stage/piano-stage.stories.tsx
git commit -m "feat(storybook): add PianoStage stories"
```

---

## Task 5: `gear-card.stories.tsx`

**Component:** `src/features/midi-hardware/components/gear-card.tsx`
- Props: `{ badge?, description, icon, title, isSelected?, onClick?, className? }`
- `icon` is a `ReactNode` — pass a `lucide-react` icon element.

**File:**
- Create: `src/features/midi-hardware/components/gear-card.stories.tsx`

**Step 1: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Piano } from "lucide-react";

import { GearCard } from "./gear-card";

const meta: Meta<typeof GearCard> = {
  title: "Features/MidiHardware/GearCard",
  component: GearCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "200px", height: "160px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Yamaha P-125",
    description: "Yamaha Corporation",
    icon: <Piano className="size-8" />,
  },
};

export default meta;
type Story = StoryObj<typeof GearCard>;

export const Default: Story = {};

export const WithBadge: Story = {
  args: {
    badge: "PIANO",
  },
};

export const Selected: Story = {
  args: {
    badge: "PIANO",
    isSelected: true,
  },
};

export const Clickable: Story = {
  args: {
    badge: "PIANO",
    onClick: () => console.log("GearCard clicked"),
  },
};
```

**Step 2: Commit**

```bash
git add src/features/midi-hardware/components/gear-card.stories.tsx
git commit -m "feat(storybook): add GearCard stories"
```

---

## Task 6: `track-card.stories.tsx`

**Component:** `src/features/collection/components/track-card.tsx`
- Props: `{ track: Track, isSelected?, onClick?, className? }`
- `Track` type: `{ id, name, artist, difficulty, url }`

**File:**
- Create: `src/features/collection/components/track-card.stories.tsx`

**Step 1: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import type { Track } from "@/shared/types/track";

import { TrackCard } from "./track-card";

const mockTrack: Track = {
  id: "1",
  name: "Golden",
  artist: "Kpop Demon Hunters",
  difficulty: "hard",
  url: "/midi/golden.mid",
};

const meta: Meta<typeof TrackCard> = {
  title: "Features/Collection/TrackCard",
  component: TrackCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "200px", height: "160px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    track: mockTrack,
  },
};

export default meta;
type Story = StoryObj<typeof TrackCard>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const Clickable: Story = {
  args: {
    onClick: () => console.log("TrackCard clicked"),
  },
};

export const EasyDifficulty: Story = {
  args: {
    track: { ...mockTrack, difficulty: "easy", name: "Blue", artist: "Yung Kai" },
  },
};
```

**Step 2: Commit**

```bash
git add src/features/collection/components/track-card.stories.tsx
git commit -m "feat(storybook): add TrackCard stories"
```

---

## Task 7: `theme-picker.stories.tsx`

**Component:** `src/features/theme/components/theme-picker.tsx`
- Props: `{ activeTheme: Theme, onThemeChange: (theme: Theme) => void }`
- Uses a `Dialog` — story renders trigger button.

**File:**
- Create: `src/features/theme/components/theme-picker.stories.tsx`

**Step 1: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { Theme } from "../lib/themes";
import { ThemePicker } from "./theme-picker";

const meta: Meta<typeof ThemePicker> = {
  title: "Features/Theme/ThemePicker",
  component: ThemePicker,
  parameters: {
    layout: "centered",
  },
  args: {
    activeTheme: Theme.Default,
    onThemeChange: (theme) => console.log("Theme changed:", theme),
  },
};

export default meta;
type Story = StoryObj<typeof ThemePicker>;

/** Trigger button with the default theme selected. */
export const Default: Story = {};

/** Trigger showing the Arcade theme as active. */
export const ArcadeTheme: Story = {
  args: {
    activeTheme: Theme.Arcade,
  },
};

/** Trigger showing the Gameboy theme as active. */
export const GameboyTheme: Story = {
  args: {
    activeTheme: Theme.Gameboy,
  },
};
```

**Step 2: Commit**

```bash
git add src/features/theme/components/theme-picker.stories.tsx
git commit -m "feat(storybook): add ThemePicker stories"
```

---

## Task 8: `play-page.view.stories.tsx`

**Component:** `src/app/play/components/play-page.view.tsx`
- All props required. Key items:
  - `selectedMIDIInput: WebMidi.MIDIInput` → cast a mock object
  - `getLastHitQuality: () => HitQuality` → check `HitQuality` type values in `@/features/gameplay`
  - `getInstrumentType()` checks `selectedMIDIInput.name` — use `"Yamaha P-125 Piano"` to get piano branch; any other name for drums.

**File:**
- Create: `src/app/play/components/play-page.view.stories.tsx`

**Step 1: Check `HitQuality` type before writing**

Look at `src/features/gameplay/index.ts` (or wherever `HitQuality` is defined) and use a valid value.

**Step 2: Write the stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import type { HitQuality } from "@/features/gameplay";

import { PlayPageView } from "./play-page.view";

const mockPianoInput = {
  id: "piano-1",
  name: "Yamaha P-125 Piano",
  manufacturer: "Yamaha",
} as WebMidi.MIDIInput;

const mockDrumInput = {
  id: "drum-1",
  name: "Roland TD-17 Drum",
  manufacturer: "Roland",
} as WebMidi.MIDIInput;

const mockNotes = Array.from({ length: 25 }, (_, i) => ({
  id: String(i),
  pitch: 48 + i,
  startTimeMs: i * 500,
  durationMs: 400,
  velocity: 0.8,
}));

const mockGroups = [
  {
    index: 0,
    startMs: 0,
    durationMs: 5000,
    notes: [
      { id: "1", pitch: 60, startTimeMs: 1000, durationMs: 500, velocity: 0.8 },
      { id: "2", pitch: 64, startTimeMs: 1500, durationMs: 500, velocity: 0.8 },
    ],
  },
];

const meta: Meta<typeof PlayPageView> = {
  title: "App/Play",
  component: PlayPageView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    selectedMIDIInput: mockPianoInput,
    selectedTrack: { name: "Golden" },
    getScore: () => 0,
    getCombo: () => 0,
    getLastHitQuality: () => "miss" as HitQuality,
    getProgress: () => 0,
    handlePause: () => console.log("Pause clicked"),
    isFullscreen: false,
    handleToggleFullscreen: () => console.log("Toggle fullscreen"),
    liveActiveNotes: new Set(),
    playbackNotes: new Set(),
    notes: mockNotes,
    groups: mockGroups,
    scrollRef: { current: null },
    getCurrentTimeMs: () => 0,
    speed: 1,
  },
};

export default meta;
type Story = StoryObj<typeof PlayPageView>;

/** Piano stage, no active notes, score at zero. */
export const PianoDefault: Story = {};

/** Piano stage with live MIDI notes and a score. */
export const PianoWithScore: Story = {
  args: {
    liveActiveNotes: new Set([60, 64, 67]),
    playbackNotes: new Set([72]),
    getScore: () => 1250,
    getCombo: () => 8,
    getProgress: () => 0.4,
    getLastHitQuality: () => "good" as HitQuality,
  },
};

/** Fullscreen mode active. */
export const Fullscreen: Story = {
  args: {
    isFullscreen: true,
  },
};

/** Drum stage branch. */
export const DrumDefault: Story = {
  args: {
    selectedMIDIInput: mockDrumInput,
  },
};
```

**Step 3: Run lint:fix and commit**

```bash
npm run lint:fix
git add src/app/play/components/play-page.view.stories.tsx
git commit -m "feat(storybook): add PlayPageView stories"
```

---

## Task 9: Final Validation

**Step 1: Run full validation suite**

```bash
npm run lint:fix
npm run lint
npm run type-check
npm test
npm run build
```

**Step 2: Verify clean git state**

```bash
git status   # must show nothing to commit
```

**Step 3: Create PR**

```bash
PATH=$PATH:/opt/homebrew/bin gh pr create --fill
```

---

## Open Questions

> [!IMPORTANT]
> **`HitQuality` type values** — `PlayPageView` accepts `getLastHitQuality: () => HitQuality`. Confirm what string values `HitQuality` accepts (`"perfect"`, `"good"`, `"miss"`, etc.) so the story mock is type-safe. The plan uses `"miss" as HitQuality` and `"good" as HitQuality` as placeholders — verify before executing Task 8.

> [!NOTE]
> **`getInstrumentType` detection logic** — If the instrument-type detection doesn't work by name substring, check `src/shared/lib/instrument.ts` to understand how it distinguishes piano from drums and adjust mock input names accordingly.
