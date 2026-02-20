---
name: conductor-track-planning
description: Manages the full lifecycle of Gemini Conductor tracks for this project: generating new track files (spec.md, plan.md, metadata.json, index.md), guiding implementation according to conductor/workflow.md, and marking tracks complete and archiving them. Use when the user wants to plan, implement, or finish a Conductor track in MIDI Jam, optionally starting from Superpowers workflows like /brainstorm.
---

# Conductor Track Planning & Lifecycle

## When to Use

Use this skill when:

- The user asks to **plan a new feature** and wants it tracked as a **Conductor track**.
- The user mentions **Conductor**, **tracks**, or files like `spec.md` / `plan.md` under `conductor/`.
- The user wants to use **Superpowers workflows** (e.g. `/brainstorm`) but still end up with a **Gemini Conductor-compatible track**.
- The user is **implementing an existing track** and needs guidance on using `plan.md` and `workflow.md`.
- The user wants to **finish a track**, mark it as done, and **archive** it under `conductor/archive/`.

Always prefer this skill over ad‑hoc instructions when producing new Conductor tracks in this repo.

## Target Structure

All new tracks for this project must follow the same 4‑file structure as the archived tracks in `conductor/archive/`:

- `conductor/<track_id>/spec.md`
- `conductor/<track_id>/plan.md`
- `conductor/<track_id>/metadata.json`
- `conductor/<track_id>/index.md`

For reference, existing examples live under `conductor/archive/*/`. Mirror their structure and tone.

> If the user explicitly wants the new track archived immediately, place it under
> `conductor/archive/<track_id>/` instead. Otherwise, default to `conductor/<track_id>/`.

## Track ID Convention

When creating a new track:

1. **If the user provides a track id**, use it exactly as given (no extra suffixes).
2. **Otherwise**, derive one from a short slug and today’s date:
   - Slug: kebab‑case summary, e.g. `demo_mode_toggle`
   - Date: `YYYYMMDD`
   - Combined: `<slug>_<YYYYMMDD>`, e.g. `demo_mode_toggle_20260220`

Use this `track_id` consistently in:

- Folder name: `conductor/<track_id>/`
- `metadata.json.track_id`
- `index.md` title and links

## Workflow Overview

When using this skill, follow this sequence:

1. **Clarify the feature** (if needed)
   - Ask for a 1–2 sentence user‑facing description and any constraints (navigation, MIDI, scoring, UI, etc.).
2. **(Optional) Use Superpowers /brainstorm**
   - If the user invoked `/brainstorm` or asked for “superpower workflow”, let the **brainstorming** flow run first to explore ideas.
   - Treat the brainstorming output as raw material, **not** as the final spec/plan.
3. **Map to Conductor format**
   - Condense the agreed feature design into:
     - `spec.md`: “what & why”
     - `plan.md`: “how, in phases & tasks”, aligned with `conductor/workflow.md`
     - `metadata.json`: machine‑readable summary
     - `index.md`: simple entrypoint linking the three files
4. **Create or update files**
   - Write all four files in one pass under `conductor/<track_id>/`.
   - Keep content concise and consistent with existing tracks (see examples in `conductor/archive/`).

Once a track has been created, use the **Implementation Workflow** and **Completion & Archiving** sections below to drive day‑to‑day work.

## File Templates

### 1. spec.md

Use this shape, mirroring existing specs (e.g. `midi_visualizer_20260130/spec.md`):

```markdown
# Specification: <Track Title>

## Objective
<1–3 short paragraphs describing the goal and user impact.>

## Key Features

### 1. <Feature Area>
- <Bulleted requirements>

### 2. <Feature Area>
- <Bulleted requirements>

## Acceptance Criteria
- [ ] <Clear, testable criterion 1>
- [ ] <Clear, testable criterion 2>

## Constraints
- <Constraints specific to MIDI Jam / this feature, if any>
```

Adapt sections as needed, but keep headings and checkboxes consistent with other specs in `conductor/archive/`.

### 2. plan.md

Plan files must respect `conductor/workflow.md` (TDD, phases, checkpoints). Use this pattern:

```markdown
# Implementation Plan: <Track Title>

## Phase 1: <Phase Name> [checkpoint: ]

- [ ] Task: <Task name>
    - [ ] Write Failing Tests: <1–2 lines on what behavior the tests cover>
    - [ ] Implement to Pass Tests
    - [ ] Refactor
- [ ] Task: <Task name>
    - [ ] Write Failing Tests: ...
    - [ ] Implement to Pass Tests
    - [ ] Refactor
- [ ] Task: Conductor - User Manual Verification '<Phase Name>' (Protocol in workflow.md)

## Phase 2: <Phase Name> [checkpoint: ]
...
```

Guidelines:

- Break the work into **phases**, each ending with a **manual verification task** that references `workflow.md`.
- Each task should be describable in a single focused commit.
- Do **not** pre‑fill checkpoint SHAs; those are added after implementation.

### 3. metadata.json

Use a minimal, consistent schema:

```json
{
  "track_id": "<track_id>",
  "type": "feature",
  "status": "new",
  "created_at": "<ISO8601 timestamp>",
  "updated_at": "<ISO8601 timestamp>",
  "description": "<Short, human‑readable summary>"
}
```

Guidelines:

- `created_at` / `updated_at`: use the current date/time in UTC ISO8601 format.
- `type`: usually `"feature"` for new work in this project.
- `status`: start at `"new"` unless the user specifies otherwise.

### 4. index.md

Keep this file tiny; it’s just a navigation entrypoint:

```markdown
# Track <track_id> Context

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)
```

Use the exact relative links above so it matches existing archived tracks.

## Implementation Workflow (Executing a Track)

When implementing a track, always align with `conductor/workflow.md`. Use this condensed workflow:

1. **Select the next task**
   - Open `conductor/<track_id>/plan.md`.
   - Pick the **next `[ ] Task:`** in order within the current phase.
2. **Mark task in progress**
   - Change its status marker from `[ ]` to `[~]` in `plan.md`.
   - Keep the nested sub‑steps (`Write Failing Tests`, `Implement to Pass Tests`, `Refactor`) as plain checklist items under the task.
3. **Red phase – Write failing tests**
   - Create or extend the relevant test file(s) in `src/` following existing testing patterns.
   - Run the test command from this repo (`npm test` or `npm test <pattern>`).
   - Confirm that the new tests **fail for the right reason**.
4. **Green phase – Implement to pass tests**
   - Implement the minimum code needed to satisfy the tests.
   - Re‑run tests until everything passes.
5. **Refactor**
   - Improve clarity, remove duplication, and ensure performance and style guidelines are met (see `conductor/code_styleguides/`).
   - Re‑run tests after refactors.
6. **Mark task complete with commit SHA**
   - After committing the code for that task, obtain the commit hash.
   - In `plan.md`, change `[~] Task: …` to `[x] Task: … (<7‑char SHA>)`, mirroring existing archived plans.

For **phase‑level completion**, follow the “Phase Completion Verification and Checkpointing Protocol” in `conductor/workflow.md`:

- Run full tests (and coverage if appropriate).
- Propose and execute a checkpoint commit.
- Attach a git note summarizing verification (per `workflow.md`).
- Append `[checkpoint: <7‑char SHA>]` to the phase heading in `plan.md`.

When using the separate `conductor-sync` skill, let it handle the mechanical updating of `plan.md` / `spec.md` while this skill provides the conceptual workflow.

## Completion & Archiving

When the user considers a track “done”, follow this process to finish it cleanly and archive it:

1. **Verify all work is complete**
   - Ensure **every task** in `conductor/<track_id>/plan.md` is marked `[x] … (<SHA>)`.
   - Ensure each phase heading has a `[checkpoint: <SHA>]` entry.
   - Confirm acceptance criteria in `spec.md` are met (tests + manual verification).
2. **Update metadata**
   - Open `conductor/<track_id>/metadata.json`.
   - Set `"status": "done"` (or `"completed"` if the project standard uses that term).
   - Update `"updated_at"` to the current UTC ISO8601 timestamp.
3. **(Optional) Update track index**
   - If `conductor/tracks.md` is being used as a catalog, add or update an entry summarizing the track, mirroring any existing entries.
4. **Archive the track**
   - Move the entire folder `conductor/<track_id>/` to `conductor/archive/<track_id>/`.
   - Ensure relative links inside `index.md` (`./spec.md`, `./plan.md`, `./metadata.json`) remain valid after the move.
5. **Communicate completion**
   - In your summary back to the user, clearly state that:
     - All tasks in `plan.md` are complete.
     - The track has been archived under `conductor/archive/<track_id>/`.
     - `metadata.json.status` is updated to `"done"` and `updated_at` reflects the completion time.

This ensures the track lifecycle is fully captured: **planned**, **implemented** according to TDD and Conductor workflow, and **archived** with an auditable history.

## Using Superpowers (/brainstorm) with This Skill

When the user wants to “use /brainstorm and output a Conductor track”:

1. **Follow the Superpowers /brainstorm flow** (brainstorming skill) to refine the idea.
2. Once the design is clear and approved, **switch to this skill’s instructions**:
   - Summarize the final agreed design into `spec.md`.
   - Translate the implementation steps into `plan.md` phases and tasks.
   - Fill out `metadata.json` and `index.md`.
3. Do **not** copy raw brainstorming logs directly into spec/plan; keep them structured, concise, and aligned with other Conductor tracks.

## Examples

For concrete reference, compare your generated files to:

- `conductor/archive/midi_visualizer_20260130/spec.md`
- `conductor/archive/midi_visualizer_20260130/plan.md`
- `conductor/archive/midi_visualizer_20260130/metadata.json`
- `conductor/archive/midi_visualizer_20260130/index.md`

Your output should feel like a sibling of these tracks, differing only in feature content and `track_id`.

